import { createClient } from "@/lib/supabase/server";

export async function ShowUsage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("usage")
    .select("token_count")
    .single();

  if (error || !data) {
    console.error("Failed to fetch usage", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return <p>Could not fetch tokens</p>
  }
  return <p>Tokens: {data.token_count}</p>;
}
