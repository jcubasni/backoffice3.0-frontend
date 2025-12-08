import { useQuery } from "@tanstack/react-query"
import { getRetentionByClientId } from "@/app/sales/service/client.service"

export function useGetRetentionByClientId(
  clientId?: string,
  hasRetention?: boolean,
) {
  return useQuery({
    queryKey: ["retention", clientId],
    queryFn: () => getRetentionByClientId(clientId!),
    enabled: !!clientId && hasRetention,
  })
}
