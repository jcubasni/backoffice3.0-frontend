import { Building2, Goal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Company } from "../types/company.type"

interface CardCompanyProps {
  company?: Company
}

export const CardCompany = ({ company }: CardCompanyProps) => {
  const host = window.location.host
  const protocol = window.location.protocol
  const subdomain = company?.tenantSubdomain
  const dailyReport = () => {
    window.location.href = `${protocol}//${subdomain}.${host}/daily-report/`
  }
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <section className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-md bg-muted p-2">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{company?.name}</CardTitle>
          </div>
        </section>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={dailyReport}
        >
          <Goal />
        </Button>
      </CardHeader>
    </Card>
  )
}
