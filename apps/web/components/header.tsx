
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";

export default function Header() {
  return (
    <nav className="w-full flex justify-end border-b border-b-foreground/10 h-16 p-3 px-5">
        <Suspense>
          <AuthButton />
        </Suspense>
    </nav>
  );
}
