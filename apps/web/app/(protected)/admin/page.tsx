import { getJobs } from "@/lib/api/jobs";
import { getProfile } from "@/lib/api/profile";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const profile = await getProfile();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  const jobs = await getJobs();

  return (
    <section className="flex h-[calc(100vh-8rem)] min-h-0 w-full gap-8">
      <div>
      {jobs.map(job => <p key={job.id}>{job.id} {job.error} {job.startedAt}</p>)}
      </div>
    </section>
  );
}
