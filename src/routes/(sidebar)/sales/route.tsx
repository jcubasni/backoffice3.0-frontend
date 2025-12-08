import { createFileRoute, Outlet } from "@tanstack/react-router"
import { ModalsSale } from "@/app/sales/components/modals/modals-sale"

export const Route = createFileRoute("/(sidebar)/sales")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
      <ModalsSale />
    </>
  )
}
