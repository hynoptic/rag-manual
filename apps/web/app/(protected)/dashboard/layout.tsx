import Header from "@/components/nav/header";
import Loading from "@/components/utils/loading";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  return (
    <main className="flex flex-col gap-2">
      <Suspense fallback={<Loading/>}>
        <Header noLogo={false}/>
      </Suspense>
      <section className="w-full p-5">{children}</section>
    </main>
  );
}
