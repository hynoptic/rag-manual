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
    <Card className="border-0 shadow-none bg-transparent -ml-1 pb-0">
      <Collapsible defaultOpen className="">
        <CardHeader className="pb-4">
          <CollapsibleTrigger className="group flex w-full items-center justify-between text-left">
            <div className="flex flex-col gap-2 w-full">
              <CardTitle className="flex justify-between items-center">
                <span className="my-0">Documents</span>
                <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=closed]:-rotate-90" />
              </CardTitle>
              <CardDescription className="group-data-[state=closed]:hidden">
                Select documents for context
              </CardDescription>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="border/ border-muted-foreground">
          <CardContent className="max-h-48 overflow-y-auto">
          <div className="border p-2 rounded-lg">
            <Suspense fallback={<Loading text="Documents" />}>
              <Documents />
            </Suspense>
            </div>
          </CardContent>
          <CardFooter className="pt-6 group-data-[state=closed]:hidden">
            <AddDocumentDialogTrigger/>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
