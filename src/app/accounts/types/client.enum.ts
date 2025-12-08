import { AccountTypeForClient } from "./client.type"

export const AccountTypeStyles: Record<
  AccountTypeForClient,
  { color: string; hoverColor: string }
> = {
  [AccountTypeForClient.CREDIT]: {
    color: "bg-blue-600 border-blue-600",
    hoverColor: "hover:bg-blue-700 hover:border-blue-700",
  },
  [AccountTypeForClient.ANTICIPO]: {
    color: "bg-orange-600 border-orange-600",
    hoverColor: "hover:bg-orange-700 hover:border-orange-700",
  },
  [AccountTypeForClient.CANJE]: {
    color: "bg-purple-600 border-purple-600",
    hoverColor: "hover:bg-purple-700 hover:border-purple-700",
  },
}
