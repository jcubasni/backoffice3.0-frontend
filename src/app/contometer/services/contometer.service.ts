import { fetchData } from "@/shared/lib/fetch-data"
import { Contometer, DetailContometer } from "../types/contometer.type"

export const getContometersByReport = async (
  id: string,
): Promise<Contometer[]> => {
  const response = await fetchData<Contometer[]>({
    url: `/contometro/cash-register/${id}`,
  })
  return response
}

export const editContometers = async (
  details: DetailContometer[],
): Promise<any> => {
  const response = await fetchData<any>({
    method: "PATCH",
    url: "/contometro/final-cm",
    body: {
      details,
    },
  })
  return response
}
