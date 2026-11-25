import { ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export default function CorporaCard() {
  return (
    <Card className="pb-0 border-0 shadow-none bg-transparent">
      <Collapsible defaultOpen={false} className="">
        <CardHeader className="pb-4">
          <CollapsibleTrigger className="group flex w-full items-center justify-between text-left">
            <div className="flex flex-col gap-2 w-full">
              <CardTitle className="flex justify-between items-center">
                <span className="my-0">Corpora</span>
                <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=closed]:-rotate-90" />
              </CardTitle>
              <CardDescription className="group-data-[state=closed]:hidden">
                Select a corpus
              </CardDescription>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="">
          <CardContent className="pb-4 max-h-48 overflow-y-auto">
            {/* <Suspense fallback={<Loading text="Documents" />}>
              corpora
            </Suspense> */}
            <i className="text-muted-foreground text-sm">todo: corpora</i>
          </CardContent>
          {/* <CardFooter className="py-6 group-data-[state=closed]:hidden">
            footer
          </CardFooter> */}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
