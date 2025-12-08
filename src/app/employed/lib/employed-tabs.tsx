import { User, Users } from "lucide-react"
import { JSX } from "react"

import { EmployedInfo } from "../components/modals/modal-employed/modal-add-employed/employed-info.tsx"
import { EmployedContacts } from "../components/modals/modal-employed/modal-add-employed/employed-contacts.tsx"

export type EmployedTab = {
  id: string
  label: string
  icon: any
  component?: JSX.Element
}

export const employedTabs: EmployedTab[] = [
  {
    id: "misDatos",
    label: "Mis Datos",
    icon: User,
    component: <EmployedInfo />,
  },
  {
    id: "contactos",
    label: "Contactos",
    icon: Users,
    component: <EmployedContacts />,
  },
]
