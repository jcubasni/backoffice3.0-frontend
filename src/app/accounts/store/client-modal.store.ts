import { create } from "zustand"
import { AccountType } from "@/app/common/types/common.type"

interface ClientModalState {
  accountType: AccountType
  setAccountType: (accountType: AccountType) => void
  reset: () => void
}

const initialState = {
  accountType: AccountType.NONE,
}

export const useClientModalStore = create<ClientModalState>((set) => ({
  ...initialState,
  setAccountType: (accountType) => set({ accountType }),
  reset: () => set(initialState),
}))
