import { getDocuments } from "@/lib/api/documents";
import { connection } from "next/server";
import CorpusRow from "./corpus-row";

export default async function Corpus() {
  await connection();
  const documents = await getDocuments();
  return (
    <>
      {documents.map((document) => (
        <CorpusRow key={document.id} {...document}></CorpusRow>
      ))}
    </>
  );
}
