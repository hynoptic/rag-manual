import { Chat } from "@/components/chat/chat";
import SideBar from "@/components/nav/side-bar";

export default function DashboardPage() {
  return (
    <section className="flex h-[calc(100vh-8rem)] min-h-0 w-full gap-8">
      <div className="flex w-80 shrink-0 flex-col gap-8 overflow-y-auto">
        <SideBar />
      </div>
      <div className="min-h-0 min-w-0 flex-1">
        <Chat />
      </div>
    </section>
  );
}
