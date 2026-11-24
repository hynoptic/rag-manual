"use client";

import { useProfileStore } from "@/providers/profile-provider";
import { Badge } from "../ui/badge";

export default function User({ email }: { email: string | undefined }) {
  const fullName = useProfileStore(
    (state) => `${state.firstName} ${state.lastName}`,
  );
  const isAdmin = useProfileStore((state) => state.role === "admin");

  return (
    <div>
      <p className="">
        {fullName}{" "}
        {isAdmin && (
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            Admin
          </Badge>
        )}
      </p>
      <p className="text-muted-foreground text-sm">{email}</p>
    </div>
  );
}
