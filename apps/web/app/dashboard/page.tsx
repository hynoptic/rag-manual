import { Chat } from "@/components/chat";
import Documents from "@/components/documents";
import DocumentsCard from "@/components/documents-card";
import Loading from "@/components/loading";
import SettingsPanel from "@/components/settings-panel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UploadButton from "@/components/upload-button";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <section className="flex h-[calc(100vh-8rem)] min-h-0 w-full gap-8">
      <div className="flex w-80 shrink-0 flex-col gap-8">
        <DocumentsCard />
        <SettingsPanel />
      </div>
      <div className="min-h-0 min-w-0 flex-1">
        <Chat></Chat>
      </div>
    </section>
  );
}
