"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { QrCode } from "lucide-react"
import { useForm } from "react-hook-form"
import { generateCardNumber } from "@/app/accounts/lib/plates"
import {
  VehicleSchema,
  vehicleSchema,
} from "@/app/accounts/schemas/create-client.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { vehicleTypeOptions } from "./modal-add-client/vehicles-info"

export default function ModalAddVehicle() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.ADD_VEHICLE),
  )?.prop as {
    addVehicle: (data: VehicleSchema) => void
  }
  console.log(dataModal)
  const { closeModal } = useModalStore()

  const form = useForm<VehicleSchema>({
    resolver: zodResolver(vehicleSchema),
  })

  const handleSubmit = (data: VehicleSchema) => {
    dataModal.addVehicle(data)
    closeModal(Modals.ADD_VEHICLE)
    form.reset()
  }

  const handleClose = () => {
    closeModal(Modals.ADD_VEHICLE)
    form.reset()
  }
  const handleGenerateCardNumber = () => {
    const plateValue = form.getValues("licensePlate")
    if (plateValue) {
      const cardNumber = generateCardNumber(plateValue)
      form.setValue("cardNumber", cardNumber)
    }
  }

  const handlePlateChange = (value: string) => {
    let formattedValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, "")
    formattedValue = formattedValue.replace(/-+/g, "-")
    if (formattedValue.length > 3 && !formattedValue.includes("-")) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 6)}`
    }
    if (formattedValue.length > 7) {
      formattedValue = formattedValue.slice(0, 7)
    }
    form.setValue("licensePlate", formattedValue)
  }

  return (
    <Modal
      modalId={Modals.ADD_VEHICLE}
      title="Editar Vehículo"
      className="md:max-w-md!"
      onClose={handleClose}
    >
      <FormWrapper form={form} onSubmit={handleSubmit} className="space-y-4">
        <InputForm
          label="Número de Placa"
          name="licensePlate"
          placeholder="ABC-1234"
          onChange={(e) => handlePlateChange(e.target.value)}
        />
        <ComboBoxForm
          name="vehicleType"
          options={vehicleTypeOptions}
          label="Tipo de Vehículo"
        />
        <InputForm
          label="Número de Tarjeta"
          name="cardNumber"
          placeholder="Ej: 2022 Toyota Camry"
          icon={QrCode}
          iconClick={handleGenerateCardNumber}
        />
        <InputForm
          label="Modelo"
          name="model"
          placeholder="Ej: 2022 Toyota Camry"
        />

        <InputForm
          label="Capacidad de Tanque (Litros)"
          name="tankCapacity"
          type="number"
          placeholder="60"
        />

        <InputForm
          label="Número de Ruedas"
          name="numberOfWheels"
          type="number"
          placeholder="4"
        />

        <InputForm
          label="Kilometraje Inicial"
          name="initialKilometrage"
          type="number"
          placeholder="0"
        />

        <Modal.Footer className="grid-cols-2">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            className="bg-transparent text-slate-700 text-sm md:text-base"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-sm text-white hover:bg-blue-700 md:text-base"
          >
            Guardar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
