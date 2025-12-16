import {
  Car,
  CreditCard,
  FileText,
  Globe,
  type LucideIcon,
  User,
  Users,
  Wallet,
} from "lucide-react"
import { JSX } from "react"
import { AccountInfo } from "../components/modals/modal-client/modal-add-client/account-info"
import { Cards } from "../components/modals/modal-client/modal-add-client/cards"
import { ClientInfo } from "../components/modals/modal-client/modal-add-client/client-info"

type ClientTab = {
  id: string
  label: string
  icon: LucideIcon
  component?: JSX.Element
}

export const clientTabs: ClientTab[] = [
  { id: "misDatos", label: "Mis Datos", icon: User, component: <ClientInfo /> },
  { id: "cuentas", label: "Cuentas", icon: Wallet, component: <AccountInfo /> },
  { id: "tarjetas", label: "Tarjetas", icon: CreditCard, component: <Cards /> },
  { id: "facturacion", label: "Facturación", icon: FileText },
  { id: "contactos", label: "Contactos", icon: Users },
  { id: "extranet", label: "Extranet", icon: Globe },
] as const

export type ClientTabId = (typeof clientTabs)[number]["id"]
