import { getDocuments } from "@/lib/api/documents";
import CorpusRow from "./corpus-row";

export default async function Corpus() {
  const documents = await getDocuments();
  return (
    <>
      {documents.map((document) => (
        <CorpusRow key={document.id} {...document}></CorpusRow>
      ))}
    </>
  );
}
