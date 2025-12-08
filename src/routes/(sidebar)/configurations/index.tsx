import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { maintenanceTabs } from "@/app/configurations/shared/lib/maintenance-tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Routes } from "@/shared/lib/routes"

const configurationsSearchParams = z.object({
  tab: z.string().optional().default("series"),
})

export const Route = createFileRoute("/(sidebar)/configurations/")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Mantenimiento",
  },
  validateSearch: configurationsSearchParams,
})

function RouteComponent() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate()
  const handleTabChange = (newTab: string) => {
    navigate({
      to: Routes.Configurations,
      search: { tab: newTab },
    })
  }

  return (
    <Tabs
      value={tab || "series"}
      onValueChange={handleTabChange}
      className="flex-1"
    >
      <TabsList className="flex h-fit w-full flex-wrap">
        {maintenanceTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {maintenanceTabs.map((tab) => {
        const Component = tab.component
        return (
          <TabsContent
            className="flex flex-col gap-3"
            key={tab.value}
            value={tab.value}
          >
            <Component />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
