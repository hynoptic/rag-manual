"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { MyCorporaIcon } from "../utils/my-corpora-icon";

export function SideLogo({}) {
  const { open } = useSidebar();
  return (
    <SidebarMenu>
      {open && <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pointer-events-none"
        >
          <div className="flex aspect-square items-center justify-center rounded-lg">
            <MyCorporaIcon size={40} />
          </div>
          <div className="grid flex-1 text-left">
            <span className="text-2xl font-bold">MyCorpora</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>}
    </SidebarMenu>
  );
}
