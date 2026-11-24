import { Profile } from "@/lib/api/types";
import { createStore } from "zustand/vanilla";

export const createProfileStore = (initialState: Profile) =>
  createStore<Profile>()(() => ({
    ...initialState,
  }));

export type ProfileStore = ReturnType<typeof createProfileStore>;