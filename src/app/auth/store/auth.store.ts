// auth/store/useAuthStore.ts
import { Auth, Local } from "@auth/types/login.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = Omit<Auth, "accessToken" | "locals">;

type AuthStore = {
  user: User | null;
  selectedLocal: Local | null;
  setUser: (user: User | null) => void;
  setSelectedLocal: (local: Local | null) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      selectedLocal: null,
      setUser: (user) => set({ user }),
      setSelectedLocal: (local) => set({ selectedLocal: local }),
      clearAuth: () => set({ user: null, selectedLocal: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;