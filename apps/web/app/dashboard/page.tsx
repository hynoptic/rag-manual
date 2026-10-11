import { Chat } from "@/components/chat";
import Corpus from "@/components/corpus";
import CorpusPanel from "@/components/corpus-panel";
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
    <section className="flex flex-col w-80 gap-8">
      <CorpusPanel />
      <SettingsPanel />
    </section>
  );
}
