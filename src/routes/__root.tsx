import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Toaster } from "sonner"
import { NotFound } from "@/shared/components/404"
import UseQueryProvider from "@/shared/components/use-query-provider"
import { useThemeToggle } from "@/shared/hooks/useTheme"

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  useThemeToggle()
  return (
    <UseQueryProvider>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <ReactQueryDevtools />
      <Toaster position="top-center" richColors />
    </UseQueryProvider>
  )
}
