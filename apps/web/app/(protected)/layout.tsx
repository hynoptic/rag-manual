import CorporaCard from "@/components/corpora/corpora-card";
import DocumentsCard from "@/components/documents/documents-card";
import { AppSidebar } from "@/components/nav/app-sidebar";
import SettingsCard from "@/components/settings/settings-card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getProfile } from "@/lib/api/profile";
import { createClient } from "@/lib/supabase/server";
import { ProfileProvider } from "@/providers/profile-provider";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const email = user?.email || "";

  return (
    <ProfileProvider profile={{...profile, email}}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar>
          <DocumentsCard />
          <CorporaCard />
          <SettingsCard />
        </AppSidebar>
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
