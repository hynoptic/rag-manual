import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";

export default function Header() {
  return (
    <nav className="w-full flex justify-between items-center border-b h-16 p-3 px-6">
      <h1 className="text-xl font-bold /italic">MyCorpora</h1>
      <Suspense>
        <AuthButton />
      </Suspense>
    </nav>
  );
}
