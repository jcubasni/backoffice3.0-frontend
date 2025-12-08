import { createFileRoute } from "@tanstack/react-router"
import { CompaniesView } from "@/app/support/companies/components/companies-view"

export const Route = createFileRoute("/(sidebar)/support/companies")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Empresas",
  },
})

function RouteComponent() {
  return <CompaniesView />
}
