import { Sting } from "@/components/chat/sting";
import Header from "@/components/nav/header";

export default function Home() {
  return (
    <main className="flex h-screen flex-col">
      <Header noLogo={true} />
      <Sting />
    </main>
  );
}
