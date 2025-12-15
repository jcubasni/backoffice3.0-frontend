"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { dataToComboAdvanced } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

import { ModalsVehicle } from "@/app/vehicles/types/modals-name"
import {
  useGetVehicleTypes,
  useUpdateVehicle,
} from "@/app/vehicles/hooks/useVehiclesService"
import {
  createVehicleSchema,
  type CreateVehicleSchema,
} from "@/app/vehicles/schemas/create-vehicle.schema"
import type {
  VehicleResponse,
  VehicleUpdateDTO,
} from "@/app/vehicles/types/vehicle.type"

type EditVehicleSchema = CreateVehicleSchema
const editVehicleSchema = createVehicleSchema

export default function ModalEditVehicle() {
  const { closeModal, openModals } = useModalStore()

  // 🧩 Obtenemos el vehículo que se pasó desde la tabla
  const modalState = openModals.find(
    (modal) => modal.id === ModalsVehicle.EDIT_VEHICLE,
  ) 

  const vehicle = modalState?.prop?.vehicle as VehicleResponse | undefined

  const handleClose = () => {
    closeModal(ModalsVehicle.EDIT_VEHICLE)
  }

  // Si por algún motivo no hay vehicle, no renderizamos nada
  if (!vehicle) return null

  // 🔽 Tipos de vehículo para el combo
  const {
    data: vehicleTypes = [],
    isLoading: isLoadingVehicleTypes,
  } = useGetVehicleTypes()

  const vehicleTypeOptions = useMemo(
    () =>
      dataToComboAdvanced(
        vehicleTypes,
        (type) => type.id.toString(),
        (type) => type.name,
      ),
    [vehicleTypes],
  )

  const updateVehicle = useUpdateVehicle()

  // 🧾 Form con valores iniciales desde el vehículo
  const form = useForm<EditVehicleSchema>({
    resolver: zodResolver(editVehicleSchema),
    defaultValues: {
      licensePlate: vehicle.plate,
      vehicleTypeId: vehicle.vehicleTypeId
        ? String(vehicle.vehicleTypeId)
        : "",
      model: vehicle.model ?? "",
      tankCapacity:
        vehicle.fuelCapacityGal && Number(vehicle.fuelCapacityGal) > 0
          ? Number(vehicle.fuelCapacityGal)
          : undefined,
      numberOfWheels: vehicle.numberOfWheels ?? undefined,
      initialKilometrage: vehicle.mileage ?? undefined,
    },
  })

  /* ----------------- Helpers ----------------- */

  const handlePlateChange = (value: string) => {
    let formattedValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, "")
    formattedValue = formattedValue.replace(/-+/g, "-")

    if (formattedValue.length > 3 && !formattedValue.includes("-")) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
        3,
        7,
      )}`
    }

    if (formattedValue.length > 7) {
      formattedValue = formattedValue.slice(0, 7)
    }

    form.setValue("licensePlate", formattedValue)
  }

  const onSubmit = (data: EditVehicleSchema) => {
    const dto: VehicleUpdateDTO = {
      plate: data.licensePlate,
      vehicleTypeId: Number(data.vehicleTypeId),
      model: data.model || undefined,
      fuelCapacityGal: data.tankCapacity,
      numberOfWheels: data.numberOfWheels,
      mileage: data.initialKilometrage,
    }

    updateVehicle.mutate(
      { id: vehicle.id, data: dto },
      {
        onSuccess: () => {
          form.reset()
          handleClose()
        },
      },
    )
  }

  /* ----------------- UI ----------------- */

  return (
    <Modal
      modalId={ModalsVehicle.EDIT_VEHICLE}
      title="Editar Vehículo"
      className="md:max-w-md!"
      onClose={handleClose}
    >
      <FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
        {/* Placa */}
        <InputForm
          label="Número de Placa"
          name="licensePlate"
          placeholder="ABC-123"
          onChange={(e) => handlePlateChange(e.target.value)}
        />

        {/* Tipo de vehículo */}
        <ComboBoxForm
          name="vehicleTypeId"
          options={vehicleTypeOptions}
          label="Tipo de Vehículo"
          className="w-full!"
          disabled={isLoadingVehicleTypes}
        />

        {/* Modelo */}
        <InputForm
          label="Modelo"
          name="model"
          placeholder="Ej: Toyota Hilux 2022"
        />

        {/* Capacidad de tanque */}
        <InputForm
          label="Capacidad de Tanque (Litros)"
          name="tankCapacity"
          type="number"
          placeholder="60"
        />

        {/* Número de ruedas */}
        <InputForm
          label="Número de Ruedas"
          name="numberOfWheels"
          type="number"
          placeholder="4"
        />

        {/* Kilometraje inicial */}
        <InputForm
          label="Kilometraje Inicial"
          name="initialKilometrage"
          type="number"
          placeholder="0"
        />

        <Modal.Footer className="grid-cols-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={updateVehicle.isPending}>
            {updateVehicle.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
