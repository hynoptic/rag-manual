import { Chat } from "@/components/chat/chat";
import DocumentsCard from "@/components/documents/documents-card";
import SettingsPanel from "@/components/settings/settings-panel";

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
