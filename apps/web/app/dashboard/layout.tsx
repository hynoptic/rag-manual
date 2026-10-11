import Header from "@/components/header";
import Loading from "@/components/loading";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  return (
    <main className="flex flex-col gap-2">
      <Suspense fallback={<Loading/>}>
        <Header />
      </Suspense>
      <section className="w-full p-5">{children}</section>
    </main>
  );
}
