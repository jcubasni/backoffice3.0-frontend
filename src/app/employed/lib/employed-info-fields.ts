import { Mail, MapPin, Phone, User } from "lucide-react"

export type EmployedInfoField = {
  id: string
  icon: typeof User
  label: string
  iconColor: string
  getValue: string
}

export const employedInfoFields: EmployedInfoField[] = [
  {
    id: "usuario",
    icon: User,
    label: "Usuario",
    iconColor: "text-blue-600",
    getValue: "No registrado",
  },
  {
    id: "telefono",
    icon: Phone,
    label: "Teléfono",
    iconColor: "text-green-600",
    getValue: "No registrado",
  },
  {
    id: "correo",
    icon: Mail,
    label: "Correo",
    iconColor: "text-purple-600",
    getValue: "No registrado",
  },
  {
    id: "direccion",
    icon: MapPin,
    label: "Dirección",
    iconColor: "text-red-600",
    getValue: "No registrada",
  },
]
