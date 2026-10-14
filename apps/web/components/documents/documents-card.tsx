import { Suspense } from "react";
import Documents from "./documents";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import AddDocumentButton from "./add-document-button";
import Loading from "../utils/loading";

export default function DocumentsCard() {
  return (
    <Card>
      <CardHeader className="pb-4 border-b">
        <CardTitle>Documents</CardTitle>
        <CardDescription>Select documents</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 border-b">
        <Suspense fallback={<Loading text="Documents" />}>
          <Documents />
        </Suspense>
      </CardContent>
      <CardFooter>
        <AddDocumentButton />
      </CardFooter>
    </Card>
  );
}
