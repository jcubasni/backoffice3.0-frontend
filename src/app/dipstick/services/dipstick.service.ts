import { fetchData } from "@/shared/lib/fetch-data"
import { DetailDipstick, Dipstick } from "../types/dipstick.type"

export const getDipstick = async (id: string): Promise<Dipstick[]> => {
  const response = await fetchData<Dipstick[]>({
    url: `/dipstick/daily-report/${id}`,
  })
  return response
}

export const editDipstick = async (data: DetailDipstick[]): Promise<any> => {
  const response = await fetchData<any>({
    method: "PATCH",
    url: "/dipstick/final-stick",
    body: {
      details: data,
    },
  })
  return response
}
