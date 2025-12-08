import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import { isAuth } from "@/app/auth/lib/auth"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/shared/components/header"
import { Sidebar } from "@/shared/components/sidebar"
import useBranchStore from "@/shared/store/branch.store"

export const Route = createFileRoute("/(sidebar)")({
  component: RouteComponent,
  beforeLoad: isAuth,
})

function RouteComponent() {
  const selectedBranch = useBranchStore((state) => state.selectedBranch)
  const queryClient = useQueryClient()
  useEffect(() => {
    if (selectedBranch) queryClient.invalidateQueries()
  }, [selectedBranch, queryClient])
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="ml-auto flex-1 bg-sidebar transition-[width] duration-300 ease-in-out">
        <section className="flex min-h-screen flex-1 flex-col p-2">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-background">
            <Header />
            <main className="box-border flex flex-1 flex-col gap-3 p-4">
              <Outlet />
            </main>
          </div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
