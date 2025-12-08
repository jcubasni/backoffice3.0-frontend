import { create } from "zustand"

type LoadStore = {
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useLoadStore = create<LoadStore>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}))
