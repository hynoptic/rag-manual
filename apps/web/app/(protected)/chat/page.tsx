import { Chat } from "@/components/chat/chat";

export default function ChatPage() {
  return (
    <section className="flex h-[calc(100vh-2rem)] min-h-0 w-full p-8 pt-0">
      {/* <div className="flex w-80 shrink-0 flex-col gap-8 overflow-y-auto">
          <SideBar />
        </div> */}
      <div className="min-h-0 min-w-0 flex-1">
        <Chat />
      </div>
    </section>
  );
}
