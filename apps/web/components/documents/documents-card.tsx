import { ChevronDown } from "lucide-react";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Loading from "../utils/loading";
import AddDocumentDialogTrigger from "./add-document-dialog-trigger";
import Documents from "./documents";

export default function DocumentsCard() {

  return (
    <Card className="pb-0">
      <Collapsible defaultOpen className="">
        <CardHeader className="pb-4">
          <CollapsibleTrigger className="group flex w-full items-center justify-between text-left">
            <div className="flex flex-col gap-2 w-full">
              <CardTitle className="flex justify-between items-center">
                <span className="my-0">Documents</span>
                <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=closed]:-rotate-90" />
              </CardTitle>
              <CardDescription className="group-data-[state=closed]:hidden">
                Select documents
              </CardDescription>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="">
          <CardContent className="py-4 border-y max-h-[12.25rem] overflow-y-auto">
            <Suspense fallback={<Loading text="Documents" />}>
              <Documents />
            </Suspense>
          </CardContent>
          <CardFooter className="py-6 group-data-[state=closed]:hidden">
            <AddDocumentDialogTrigger/>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
