import { create } from "zustand"

type DetailBoxStore = {
  dailyReportId: string | null
  setDailyReportId: (id: string | null) => void
}

export const useDetailBoxStore = create<DetailBoxStore>((set) => ({
  dailyReportId: null,
  setDailyReportId: (id) => set({ dailyReportId: id }),
}))
