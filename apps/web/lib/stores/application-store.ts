import { create } from "zustand";

export type PromptMode = "full" | "rag";

type ApplicationStore = {
  selectedDocumentIds: string[];
  promptMode: PromptMode;
  allowWebSearch: boolean;
  toggleDocument: (id: string) => void;
  clearSelection: () => void;
  setPromptMode: (mode: PromptMode) => void;
  setAllowWebSearch: (value: boolean) => void;
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  selectedDocumentIds: [],
  promptMode: "full",
  allowWebSearch: false,

  toggleDocument: (id) =>
    set((state) => ({
      selectedDocumentIds: state.selectedDocumentIds.includes(id)
        ? state.selectedDocumentIds.filter((documentId) => documentId !== id)
        : [...state.selectedDocumentIds, id],
    })),

  clearSelection: () => set({ selectedDocumentIds: [] }),
  setPromptMode: (mode) => set({ promptMode: mode }),
  setAllowWebSearch: (value) => set({ allowWebSearch: value }),
}));
