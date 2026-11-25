import { Profile } from "@/lib/api/types";
import { createStore } from "zustand/vanilla";

export const createProfileStore = (initialState: Profile & {email: string}) =>
  createStore<Profile & {email: string}>()(() => ({
    ...initialState,
  }));

export type ProfileStore = ReturnType<typeof createProfileStore>;