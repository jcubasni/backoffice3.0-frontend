import { fetchData } from "@/shared/lib/fetch-data"

export const getWorkShifts = async (): Promise<
  { id_work_shift: string; shift_name: string }[]
> => {
  const res = await fetchData<{ id_work_shift: string; shift_name: string }[]>({
    url: "/reports/sale/work-shifts",
  })
  return res
}
