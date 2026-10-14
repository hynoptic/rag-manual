"use client";

import { useApplicationStore } from "@/lib/stores/application-store";
import { Switch } from "../ui/switch";

export default function AllowWebSearch() {
  const allowWebSearch = useApplicationStore((state) => state.allowWebSearch);
  const setAllowWebSearch = useApplicationStore(
    (state) => state.setAllowWebSearch,
  );

  return (<div className="flex items-center justify-between gap-2">
      <p className="text-muted-foreground">Allow Web Search</p>
    <Switch checked={allowWebSearch} onCheckedChange={setAllowWebSearch} /></div>
  );
}
