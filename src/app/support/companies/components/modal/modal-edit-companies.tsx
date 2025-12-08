import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalEditCompanies() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-edit-companies"),
  )?.prop

  const [businessType, setBusinessType] = useState<string | null>(null)
  const [enabledModules, setEnabledModules] = useState<string[]>([])

  const toggleModule = (module: string) => {
    setEnabledModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module],
    )
  }

  const handleBusinessTypeChange = (type: string) => {
    setBusinessType((prev) => (prev === type ? null : type))
  }

  return (
    <Modal
      modalId="modal-edit-companies"
      title="Editar empresa"
      className="sm:w-[600px]"
      scrollable={true}
    >
      <div className="grid grid-cols-2 gap-4">
        <Input label="RUC:" defaultValue={dataModal?.ruc ?? ""} />
        <Input label="Nombre Empresa:" defaultValue={dataModal?.name ?? ""} />

        <div className="col-span-1">
          <label className="font-medium text-sm">Subdominio:</label>
          <div className="flex items-center gap-1">
            <Input className="flex-1" defaultValue={dataModal?.host ?? ""} />
            <span className="font-semibold text-sm">.jadal.pe</span>
          </div>
        </div>

        <Input
          label="Correo de acceso:"
          defaultValue={dataModal?.email ?? ""}
        />
        <Input label="Contraseña:" type="password" />
        <ComboBox
          label="Perfil:"
          options={[
            { label: "Administrador", value: "admin" },
            { label: "Usuario", value: "user" },
          ]}
        />
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="mb-2 font-semibold text-md">MÓDULOS</h3>

        <div className="mb-4 space-y-2">
          <label className="font-medium text-sm">Negocio:</label>
          <Checkbox
            label="Grifo"
            checked={businessType === "grifos"}
            onCheckedChange={() => handleBusinessTypeChange("grifos")}
          />
          <Checkbox
            label="Canchas"
            checked={businessType === "canchas"}
            onCheckedChange={() => handleBusinessTypeChange("canchas")}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm">Habilitar Módulos:</label>
          {Array.from({ length: 5 }).map((_, i) => (
            <Checkbox
              key={i}
              label={`Modulo${i + 1}`}
              checked={enabledModules.includes(`Modulo${i + 1}`)}
              onCheckedChange={() => toggleModule(`Modulo${i + 1}`)}
            />
          ))}
        </div>
      </div>

      <div className="pt-6">
        <Button variant="outline">Guardar</Button>
      </div>
    </Modal>
  )
}
