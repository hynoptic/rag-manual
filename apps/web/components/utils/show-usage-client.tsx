"use client";

import { useQuery } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api/client";
import { UsageResponse } from "@/lib/api/types";

export function ShowUsageClient() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["usage"],
    queryFn: () => clientApiFetch<UsageResponse>("/api/usage"),
  });

  if (isPending) {
    return <p>Loading credits</p>;
  }

  if (isError) {
    console.error("Failed to fetch usage", error);
    return <p>Could not fetch credits</p>;
  }

  return (
    <span className="text-muted-foreground">
      {data.tokenCount.toLocaleString("en-US")}cr
    </span>
  );
}
