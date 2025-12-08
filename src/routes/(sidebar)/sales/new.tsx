import { createFileRoute } from "@tanstack/react-router"
import { FormSale } from "@/app/sales/components/new-sale/form-sale"

export const Route = createFileRoute("/(sidebar)/sales/new")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Nueva venta",
  },
})

function RouteComponent() {
  return <FormSale />
}
