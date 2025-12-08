import { CreditCard } from "lucide-react"
import type { AccountResponse } from "@/app/accounts/types/client.type"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ClientAccountDetailProps {
  accounts: AccountResponse[]
}

interface AccountField {
  label: string
  value: string
  colorClass?: string
  fullWidth?: boolean
  renderCustom?: () => React.ReactNode
}

function AccountDetails({ account }: { account: AccountResponse }) {
  const fields: AccountField[] = [
    {
      label: "N° Documento",
      value: account.documentNumber || "",
      colorClass: "text-primary",
    },
    {
      label: "Línea de Crédito",
      value: account.creditLine
        ? `S/ ${account.creditLine.toLocaleString("es-PE")}`
        : "",
      colorClass: "text-emerald-700 dark:text-chart-2",
    },
    {
      label: "Saldo Disponible",
      value: account.balance
        ? `S/ ${account.balance.toLocaleString("es-PE")}`
        : "",
      colorClass: "text-amber-700 dark:text-chart-3",
    },
    {
      label: "Días de Crédito",
      value: account.creditDays ? `${account.creditDays} días` : "",
      colorClass: "text-purple-700 dark:text-chart-5",
    },
    {
      label: "Cuotas",
      value: account.installments ? `${account.installments}` : "",
      colorClass: "text-pink-700 dark:text-chart-4",
    },
    {
      label: "Días de Facturación",
      value: account.billingDays ? `${account.billingDays} días` : "",
      colorClass: "text-blue-700 dark:text-chart-1",
    },
    {
      label: "Fecha Inicio",
      value: account.startDate
        ? new Date(account.startDate).toLocaleDateString("es-PE")
        : "",
      colorClass: "text-primary",
    },
    {
      label: "Fecha Fin",
      value: account.endDate
        ? new Date(account.endDate).toLocaleDateString("es-PE")
        : "",
      colorClass: "text-foreground",
    },
    {
      label: "Estado",
      value: "",
      colorClass: "text-accent-foreground",
      renderCustom:
        account.status !== null
          ? () => (
              <Badge variant={account.status ? "green" : "red"}>
                {account.status ? "Activo" : "Inactivo"}
              </Badge>
            )
          : undefined,
    },
    {
      label: "Dirección",
      value: account.address || "",
      colorClass: "text-muted-foreground",
      fullWidth: true,
    },
  ].filter((field) => field.value || field.renderCustom)

  return (
    <>
      <div className="mb-6 flex items-center gap-3 border-border border-b pb-3">
        <div className="rounded-lg bg-primary p-2">
          <CreditCard className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-card-foreground text-lg">
            {account.accountType}
          </h3>
          <p className="text-muted-foreground text-sm">{account.clientName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div
            key={field.label}
            className={`rounded-lg border border-border bg-background p-4 shadow-sm ${
              field.fullWidth ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
            }`}
          >
            <p
              className={`mb-2 font-semibold text-xs uppercase tracking-wide ${field.colorClass}`}
            >
              {field.label}
            </p>
            {field.renderCustom ? (
              field.renderCustom()
            ) : (
              <p
                className={cn(
                  "font-bold text-foreground! text-lg",
                  field.fullWidth ? "font-medium" : field.colorClass,
                )}
              >
                {field.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export function ClientAccountDetail({ accounts }: ClientAccountDetailProps) {
  if (accounts.length === 1) {
    return (
      <div className="bg-card p-6">
        <AccountDetails account={accounts[0]} />
      </div>
    )
  }

  return (
    <div className="bg-card p-6">
      <Tabs defaultValue="0">
        <TabsList className="mb-4">
          {accounts.map((account, index) => (
            <TabsTrigger key={account.accountId} value={index.toString()}>
              {account.accountType}
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts.map((account, index) => (
          <TabsContent key={account.accountId} value={index.toString()}>
            <AccountDetails account={account} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
