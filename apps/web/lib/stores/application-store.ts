import { create } from "zustand";

export type PromptMode = "full" | "rag";

type ApplicationStore = {
  selectedDocumentIds: string[];
  promptMode: PromptMode;
  toggleDocument: (id: string) => void;
  clearSelection: () => void;
  setPromptMode: (mode: PromptMode) => void;
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  selectedDocumentIds: [],
  promptMode: "full",

  toggleDocument: (id) =>
    set((state) => ({
      selectedDocumentIds: state.selectedDocumentIds.includes(id)
        ? state.selectedDocumentIds.filter((documentId) => documentId !== id)
        : [...state.selectedDocumentIds, id],
    })),

  clearSelection: () => set({ selectedDocumentIds: [] }),

  setPromptMode: (mode) => set({ promptMode: mode }),
}));
