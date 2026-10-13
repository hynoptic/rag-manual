import { getProfile } from "@/lib/api/profile";
import { redirect } from "next/navigation";

export default async function AdminPage() {

  const profile = await getProfile();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }
  
  return (
    <section className="flex h-[calc(100vh-8rem)] min-h-0 w-full gap-8">
      admin
    </section>
  );
}
