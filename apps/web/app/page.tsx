import Header from "@/components/nav/header";
import { MyCorporaIcon } from "@/components/utils/my-corpora-icon";

export default function Home() {
  return (
    <main className="flex h-screen flex-col">
      <Header noLogo />
      <section className="prose mx-auto flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
        <h1 className="flex items-center gap-2">
          <MyCorporaIcon size={60} />
          MyCorpora
        </h1>
        <h3>Focus mode for creative people</h3>
        <p>
          Ask questions of a library of reference material curated by you.
          <br />
          Get answers you can trust, avoid distractions, and stay in your flow.
        </p>
      </section>
    </main>
  );
}
