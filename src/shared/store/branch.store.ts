import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Local } from "@/app/auth/types/login.type"

type BranchStore = {
  selectedBranch: Local | null
  setSelectedBranch: (branch: Local | null) => void
  branch: Local[]
  setBranch: (branches: Local[]) => void
}

const useBranchStore = create<BranchStore>()(
  persist(
    (set) => ({
      selectedBranch: null,
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      branch: [],
      setBranch: (branches) =>
        set({
          branch: branches,
          selectedBranch: branches.length > 0 ? branches[0] : null,
        }),
    }),
    {
      name: "local",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useBranchStore
