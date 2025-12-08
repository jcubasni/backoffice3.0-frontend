"use client"
import { User, Phone } from "lucide-react"
import { SupplierInfo } from "@/app/suppliers/components/modal/modal-supplier/modal-add-supplier/supplier-info"

export const supplierTabs = [
  {
    id: "misDatos",
    label: "Mis Datos",
    icon: User,
    component: <SupplierInfo />,
  },
  {
    id: "contactos",
    label: "Contactos",
    icon: Phone,
    component: <div>Próximamente…</div>,
  },
]
