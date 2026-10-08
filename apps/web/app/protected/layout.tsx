import Header from "@/components/header";
import { connection } from "next/server";
export const instant = false;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    await connection();
  return (
    <main className="flex flex-col">
      <Header />
      <div className="w-full max-w-5xl p-5 mx-auto">{children}</div>
    </main>
  );
}
