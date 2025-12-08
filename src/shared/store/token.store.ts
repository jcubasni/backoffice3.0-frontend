import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type TokenStore = {
  token: string | null
  setToken: (token: string | null) => void
}

const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useTokenStore
