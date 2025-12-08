import { create } from "zustand"

interface PanelStore {
  openPanels: { id: string; prop?: any }[]
  openPanel: <T>(id: string, prop?: T) => void
  closePanel: (id: string) => void
}

export const usePanelStore = create<PanelStore>((set) => ({
  openPanels: [],
  openPanel: (id, prop) =>
    set((state) => ({
      openPanels: [...state.openPanels, { id, prop }],
    })),
  closePanel: (id) =>
    set((state) => ({
      openPanels: state.openPanels.filter((panel) => panel.id !== id),
    })),
}))
