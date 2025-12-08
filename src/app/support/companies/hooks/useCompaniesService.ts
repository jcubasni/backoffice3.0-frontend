import { useQuery } from "@tanstack/react-query"
import { getCompanies } from "../services/companies.service"

export function useGetCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    gcTime: 0,
  })
}
