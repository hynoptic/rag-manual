"use client";

import { createProfileStore, ProfileStore } from "@/components/stores/profile-store";
import { Profile } from "@/lib/api/types";
import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

const ProfileContext = createContext<ProfileStore | null>(null);

export function ProfileProvider({
  profile,
  children,
}: {
  profile: Profile & {email: string};
  children: React.ReactNode;
}) {
  const [store] = useState(() => createProfileStore(profile));

  return (
    <ProfileContext.Provider value={store}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileStore<T>(
  selector: (state: Profile & {email: string}) => T,
): T {
  const store = useContext(ProfileContext);

  if (!store) {
    throw new Error("Missing ProfileProvider");
  }

  return useStore(store, selector);
}