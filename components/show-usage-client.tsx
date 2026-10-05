"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ShowUsageClient() {
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("usage")
        .select("token_count")
        .single();

      if (error || !data) {
        console.error("Failed to fetch usage", error);
        setError("Could not fetch tokens");
        setLoading(false);
        return;
      }

      setTokenCount(data.token_count);
      setLoading(false);
    }

    fetchUsage();
  }, []);

  if (loading) {
    return <p>Loading tokens...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <p>Tokens: {tokenCount}</p>;
}