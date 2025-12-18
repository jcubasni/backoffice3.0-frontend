"use client"

import { Upload, User, Phone, Mail, MapPin, FileText } from "lucide-react"
import { useId } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useModalStore } from "@/shared/store/modal.store"
import { Modals } from "@/app/accounts/types/modals-name"

// ✅ usa el mismo mapper que ya usas en la tabla
import { mapClientsToExport } from "@/app/accounts/utils/clients-export" // <-- AJUSTA LA RUTA si es otra

const PDF_MODAL_ID = "modal-preview-clients-pdf"

export function SidebarEditClient() {
  const photoInputId = useId()

  const dataModal = useModalStore((state) =>
    state.openModals.find((m) => m.id === Modals.EDIT_CLIENT),
  )?.prop as any

  const userName = dataModal
    ? `${dataModal?.firstName ?? ""} ${dataModal?.lastName ?? ""}`.trim() ||
      "No registrado"
    : "No registrado"

  const phone = dataModal?.phoneNumber ?? dataModal?.phone ?? "No registrado"
  const email = dataModal?.email || "No registrado"
  const address = dataModal?.address || "No registrada"

  const photoUrl = dataModal?.photoUrl ?? null

  const handleOpenPdf = () => {
    if (!dataModal) {
      toast.info("No hay datos del cliente para generar el PDF.", {
        id: "client-pdf-no-data",
      })
      return
    }

    // ✅ mandamos solo 1 cliente como reporte
    const exportClients = mapClientsToExport([dataModal])

    useModalStore.getState().openModal(PDF_MODAL_ID, {
      clients: exportClients,
    })
  }

  return (
    <aside
      className="
        hidden lg:flex w-64 flex-col
        border-r border-border bg-sidebar/60 rounded-l-md
        p-6 gap-6
      "
    >
      {/* FOTO DEL CLIENTE */}
      <section>
        <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
          Foto del usuario
        </h3>

        <div className="relative w-full aspect-square rounded-lg border border-border bg-card overflow-hidden flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Foto usuario"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <Upload className="mx-auto mb-2 h-6 w-6" />
              <p className="text-xs">Sin foto</p>
            </div>
          )}
        </div>

        {/* BOTÓN CAMBIAR FOTO */}
        <Label htmlFor={photoInputId} className="block mt-3">
          <input
            id={photoInputId}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs"
            onClick={() => document.getElementById(photoInputId)?.click()}
          >
            <Upload className="mr-2 h-3 w-3" />
            Cambiar foto
          </Button>
        </Label>
      </section>

      {/* INFORMACIÓN */}
      <section className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
          Información
        </h3>

        <div className="space-y-3 text-xs">
          <InfoItem
            icon={<User className="h-4 w-4 text-blue-500" />}
            label="Usuario"
            value={userName}
          />
          <InfoItem
            icon={<Phone className="h-4 w-4 text-green-500" />}
            label="Teléfono"
            value={phone}
          />
          <InfoItem
            icon={<Mail className="h-4 w-4 text-purple-500" />}
            label="Correo"
            value={email}
          />
          <InfoItem
            icon={<MapPin className="h-4 w-4 text-red-500" />}
            label="Dirección"
            value={address}
          />
        </div>
      </section>

      {/* BOTÓN VER PDF */}
      <div className="mt-auto">
        <Button
          size="header"
          className="
            w-full
            hover:bg-red-700 hover:text-white
            dark:hover:bg-red-900 dark:hover:text-white
            transition-colors
          "
          type="button"
          onClick={handleOpenPdf}
        >
          <FileText className="mr-2 h-4 w-4" />
          Ver PDF
        </Button>
      </div>
    </aside>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-md p-2 bg-background/50 border border-border/50">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        <p className="truncate text-muted-foreground text-xs">{value}</p>
      </div>
    </div>
  )
}
