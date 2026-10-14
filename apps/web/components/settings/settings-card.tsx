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
import PromptModeSetting from "./prompt-mode-setting";
import AllowWebSearch from "./allow-web-search";
import { Separator } from "../ui/separator";

export default function SettingsCard() {
  return (
    <Card className="pb-0">
      <Collapsible defaultOpen className="">
        <CardHeader className="pb-4">
          <CollapsibleTrigger className="group flex w-full items-center justify-between text-left">
            <div className="flex flex-col gap-2 w-full">
              <CardTitle className="flex justify-between items-center">
                <span className="my-0">Settings</span>
                <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=closed]:-rotate-90" />
              </CardTitle>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="">
          <CardContent className="py-4 pb-4 border-t max-h-[12.25rem] overflow-y-auto flex flex-col gap-4">
            <PromptModeSetting />
            <Separator />
            <AllowWebSearch />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}