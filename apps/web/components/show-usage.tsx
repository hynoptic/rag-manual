import { getProfile } from "@/lib/api/profile";
import { getUsage } from "@/lib/api/usage";

export async function ShowUsage() {
  const usage = await getUsage();
  const profile = await getProfile();
  console.log(profile);
  return <span className="text-muted-foreground">{usage.tokenCount.toLocaleString("en-US")}cr</span>;
}
