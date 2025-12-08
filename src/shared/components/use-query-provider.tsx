import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { toast } from "sonner"
import { useLoadStore } from "../store/load.store"

export default function UseQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  })

  queryClient.getMutationCache().subscribe((event) => {
    const state = event.mutation?.state

    if (event.type !== "updated") return

    if (state?.status === "success") {
      useLoadStore.getState().setLoading(false)
    }
    if (state?.status === "error") {
      toast.error(state.error.message || "Algo ocurrio")
      useLoadStore.getState().setLoading(false)
    }
    if (state?.status === "pending") {
      useLoadStore.getState().setLoading(true)
    }
  })
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
