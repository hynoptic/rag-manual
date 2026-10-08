import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  RecursiveCharacterTextSplitter,
  MarkdownTextSplitter,
} from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import "dotenv/config";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import { readFile } from "fs/promises";
import { Document, DocumentInterface } from "@langchain/core/documents";

import pc from "picocolors";
import { ingestMarkdown } from "./ingestion/ingest-markdown.js";
import { retrieveExhaustive } from "./ingestion/retrieve.js";
import { classifyIntent } from "./classification.js";

const query = `Referring only to the context provided, what machines are available on the Syntakt's analogue tracks?`;

console.clear();
console.log("\n\n\n\n\n\n\n\n\n\n");

console.log("");
console.log(
  pc.bgGreen(
    pc.black(`          Query ${new Date().toLocaleTimeString()}         `),
  ),
);
console.log("");

console.log(pc.green(query));
const classification = await classifyIntent(query);
console.log("");


console.log(
  pc.bgMagenta(
    pc.black(`          Intent          `),
  ),
);
console.log("");
console.log(pc.magenta(classification.intent));
console.log(pc.magenta(classification.reason));
console.log("");

// {
//   intent: "focused",
//   reason: "Asks for the parameters of one specific machine."
// }

// const markdownPaths = [
//   "/Users/jim/Documents/jimharris.io/rag-manual-all/rag-manual/apps/api/src/rag/docs/Syntakt-User-Manual_ENG_OS1.30_241016.md",
// ];

// const allDocs = [];

// for (const markdownPath of markdownPaths) {
//   const text = await readFile(markdownPath, "utf8");

//   allDocs.push(
//     new Document({
//       pageContent: text,
//       metadata: {
//         source: markdownPath,
//       },
//     }),
//   );
// }

// const textSplitter = new MarkdownTextSplitter({
//   chunkSize: 1000,
//   chunkOverlap: 200,
//   keepSeparator: true,
// });

// const allSplits = await textSplitter.splitDocuments(allDocs);

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
});

const documents = await ingestMarkdown(
  "./src/rag/docs/Syntakt-User-Manual_ENG_OS1.42_260930-llamaparse.md",
);

const vectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  embeddings,
);

// const vectorStore = new MemoryVectorStore(embeddings);

// await vectorStore.addDocuments(allSplits);

const ragMiddleware = dynamicSystemPromptMiddleware(async (state) => {
  const userMessage = state.messages[0]!.content;
  const query = typeof userMessage === "string" ? userMessage : "";

  const result = await retrieveExhaustive(
    query,
    vectorStore,
    documents,
    3
  );

  const retrievedDocs = result.documents;

  console.log("");
  console.log(
    pc.bgBlue(
      pc.black(`          Retrieved docs (${retrievedDocs.length})         `),
    ),
  );
  console.log("");

  retrievedDocs.forEach((doc, i) => {
    console.log(pc.bgCyan(pc.black(`     Doc #${i}     `)));
    // console.log(pc.cyan(JSON.stringify(doc.metadata, null, 2)));
    console.log(pc.cyan(doc.metadata.headingPath));
    // console.log(pc.cyan(`${doc.pageContent.replace(/\\n/g, "\n")}`));
    console.log("");
  });

  const docsContent = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");
  return `You are a helpful assistant answering user's questions about music technology such as synthesisers, grooveboxes, and drum machines, using only the provided context derived from equipment manuals, rather than accessing the web or relying on information from your model which may be out of date. ${documents[0]}`;
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  middleware: [ragMiddleware],
});

const response = await agent.invoke({
  messages: [
    {
      role: "user",
      content: query,
    },
  ],
});

console.log("");
console.log(pc.bgYellow(pc.black("          Response          ")));
console.log("");
const longMessage = response.messages[response.messages.length - 1]!.content;
console.log(pc.yellow(longMessage as string));
console.log("");
