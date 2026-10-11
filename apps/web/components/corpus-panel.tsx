import { Suspense } from "react";
import Corpus from "./corpus";
import Loading from "./loading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import UploadButton from "./upload-button";

export default function CorpusPanel() {
  return (
    <Card>
      <CardHeader className="pb-4 border-b">
        <CardTitle>Corpus</CardTitle>
        <CardDescription>Select documents</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 border-b">
        <Suspense fallback={<Loading text="Corpus" />}>
          <Corpus />
        </Suspense>
      </CardContent>
      <CardFooter>
        <UploadButton />
      </CardFooter>
    </Card>
  );
}
