import { fetchData } from "@/shared/lib/fetch-data"
import { Company } from "../types/company.type"

export const getCompanies = async (): Promise<Company[]> => {
  const response = await fetchData<Company[]>({
    url: "/admin/companies",
  })
  return response
}
