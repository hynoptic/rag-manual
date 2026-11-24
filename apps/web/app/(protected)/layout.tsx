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
      {children}
    </ProfileProvider>
  );
}