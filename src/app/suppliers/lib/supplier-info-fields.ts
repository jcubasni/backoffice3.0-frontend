import { Mail, MapPin, Phone, Building2 } from "lucide-react"

export type SupplierInfoField = {
  id: string
  icon: any
  label: string
  iconColor: string
  getValue: string
}

export const supplierInfoFields: SupplierInfoField[] = [
  {
    id: "razonSocial",
    icon: Building2,
    label: "Razón Social",
    iconColor: "text-blue-600",
    getValue: "No registrada",
  },
  {
    id: "contacto",
    icon: Phone,
    label: "Contacto",
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
