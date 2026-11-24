"use client";

import { MyCorporaIcon } from "../utils/my-corpora-icon";

export function Sting() {
  return (
    <section className="prose mx-auto flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <h1 className="flex items-center gap-2">
        <MyCorporaIcon size={60} />
        MyCorpora
      </h1>
      <h3>Reducing friction for busy people</h3>
      <p>
        Ask questions of a library of reference material curated by you.
        <br />
        Get answers you can trust, avoid distractions, and stay in your flow.
      </p>
    </section>
  );
}
