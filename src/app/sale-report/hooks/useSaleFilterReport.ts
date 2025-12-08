import { useQuery } from "@tanstack/react-query"
import { getWorkShifts } from "../service/sale-filter-report.service"

interface IWorkShift {
  id_work_shift: string
  shift_name: string
}

export const useWorkShifts = (options: any = {}) => {
  return useQuery<IWorkShift[]>({
    queryKey: ["workShifts"],
    queryFn: () => getWorkShifts(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}
