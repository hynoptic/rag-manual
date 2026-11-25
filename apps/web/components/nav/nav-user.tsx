"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { Bell, Bot, ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProfileStore } from "@/providers/profile-provider";
import { Badge } from "../ui/badge";

export function NavUser({
  user,
}: {
  user: {
    email: string;
  };
}) {
  const router = useRouter();
  const { open, isMobile } = useSidebar();
  const fullName = useProfileStore(
    (state) => `${state.firstName} ${state.lastName}`,
  );
  const email = useProfileStore(
    (state) => state.email,
  );
  const isAdmin = useProfileStore((state) => state.role === "admin");

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const admin = async () => {
    router.push("/admin");
  };

  const chat = async () => {
    router.push("/chat");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {open && <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {fullName}
                  {isAdmin && (
                    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                      Admin
                    </Badge>
                  )}
                </span>
                <span className="truncate text-xs">{email}</span>
              </div>}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {fullName}
                    {isAdmin && (
                      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                        Admin
                      </Badge>
                    )}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {isAdmin && (
                <DropdownMenuItem onClick={admin}>
                  <Bell />
                  Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={chat}>
                <Bot />
                Chat
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
