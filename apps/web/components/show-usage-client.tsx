"use client";

import { useQuery } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api/client";

type Usage = {
  tokenCount: number;
};

export function ShowUsageClient() {
  const {
    data,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["usage"],
    queryFn: () => clientApiFetch<Usage>("/api/usage"),
  });

  if (isPending) {
    return <p>Loading tokens...</p>;
  }

  if (isError) {
    console.error("Failed to fetch usage", error);
    return <p>Could not fetch tokens.</p>;
  }

  return <p>Tokens (client): {data.tokenCount}</p>;
}