import { Suspense } from "react";
import { AuthButton } from "../auth/auth-button";
import { MyCorporaIcon } from "../utils/my-corpora-icon";

export default function Header({ noLogo = false }: { noLogo: boolean }) {
  return (
    <nav className="w-full flex justify-between items-center border-b h-16 p-3 px-6">
      {noLogo ? <span></span> : (
        <h1 className="text-xl font-bold flex items-center gap-1">
          <MyCorporaIcon size={32} />
          <span>MyCorpora</span>
        </h1>
      )}
      <Suspense>
        <AuthButton />
      </Suspense>
    </nav>
  );
}
