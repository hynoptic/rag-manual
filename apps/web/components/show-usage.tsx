import { getUsage } from "@/lib/api/usage";

export async function ShowUsage() {
  const usage = await getUsage();

  return <p>Tokens: {usage.tokenCount}</p>;
}