import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getProfile } from "@/lib/api/profile";
import { ProfileProvider } from "@/providers/profile-provider";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <ProfileProvider profile={profile}>
      <SidebarProvider defaultOpen={true}  style={
    {
      "--sidebar-width": "16rem",
      "--sidebar-width-icon": "3rem",
    } as React.CSSProperties
  }>
        <Sidebar>
          <SidebarContent>
            <p>foo</p>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
