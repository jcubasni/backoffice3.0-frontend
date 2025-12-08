import { create } from "zustand"

interface ModalStore {
  openModals: { id: string; prop?: any }[]
  openModal: <T>(id: string, prop?: T) => void
  closeModal: (id: string) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  openModals: [],
  openModal: (id, prop) =>
    set((state) => ({
      openModals: [...state.openModals, { id, prop }],
    })),
  closeModal: (id) =>
    set((state) => ({
      openModals: state.openModals.filter((modal) => modal.id !== id),
    })),
}))
