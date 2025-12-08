import { create } from "zustand"

type TitleHeaderStore = {
  title: string
  setTitle: (title: string) => void
}

export const useTitleHeaderStore = create<TitleHeaderStore>((set) => ({
  title: "",
  setTitle: (title) => set({ title }),
}))
