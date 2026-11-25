"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { SideLogo } from "./side-logo";

export function AppSidebar({ children, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SideLogo />
      </SidebarHeader>
      <SidebarContent>
        {open && children}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <NavUser user={{ email: "hardcoded@icloud.com" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
