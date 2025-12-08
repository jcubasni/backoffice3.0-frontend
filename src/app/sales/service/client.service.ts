import { fetchData } from "@/shared/lib/fetch-data"
import { RetentionResponse } from "../types/client.type"

export const getRetentionByClientId = async (
  clientId: string,
): Promise<RetentionResponse> => {
  const response = await fetchData<RetentionResponse[]>({
    url: `/retention-agents/client/${clientId}`,
  })
  return response[0]
}
