import Jobs from "@/components/admin/jobs";
import { getJobs } from "@/lib/api/jobs";
import { getProfile } from "@/lib/api/profile";
import { ParseJob } from "@/lib/api/types";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const profile = await getProfile();

  if (profile.role !== "admin") {
    redirect("/chat");
  }

  const jobs = await getJobs();

  return (
    <section className="flex h-[calc(100vh)] min-h-0 flex-col gap-4  p-8 pt-0">
      <Jobs jobs={jobs as ParseJob[]} />
    </section>
  );
}
