import { getUsage } from "@/lib/api/usage";

export async function ShowUsage() {
  const usage = await getUsage();
  return <span className="text-muted-foreground">{usage.tokenCount.toLocaleString("en-US")}cr</span>;
}
