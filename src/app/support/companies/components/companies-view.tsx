import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableCompaniesBlock } from "./table-companies-block"
import { TableCompaniesConfig } from "./table-companies-config"
import { TableCompaniesMain } from "./table-companies-main"

export const CompaniesView = () => {
  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList>
        <TabsTrigger value="main">Principal</TabsTrigger>
        <TabsTrigger value="config">Configuración</TabsTrigger>
        <TabsTrigger value="block">Bloqueo</TabsTrigger>
      </TabsList>

      <TabsContent value="main">
        <TableCompaniesMain />
      </TabsContent>

      <TabsContent value="config">
        <div className="max-w-3xl space-y-4 text-sm">
          <TableCompaniesConfig />
        </div>
      </TabsContent>

      <TabsContent value="block">
        <TableCompaniesBlock />
      </TabsContent>
    </Tabs>
  )
}
