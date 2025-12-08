import { createFileRoute } from "@tanstack/react-router"
import { ListCompanies } from "@/app/companies/components/list-companies"

export const Route = createFileRoute("/companies")({
  component: RouteComponent,
})

function RouteComponent() {
  return <ListCompanies />
}
