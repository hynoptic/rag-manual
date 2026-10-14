import { getDocuments } from "@/lib/api/documents";
import DocumentRow from "./document-row";

export default async function Documents() {
  const documents = await getDocuments();
  return (
    <>
      {documents.map((document) => (
        <DocumentRow key={document.id} {...document}></DocumentRow>
      ))}
    </>
  );
}
