"use client"

import { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
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
  useCreateVehicle,
  useExistsVehicleByPlate,
  useGetVehicleTypes,
} from "@/app/vehicles/hooks/useVehiclesService"
import {
  createVehicleSchema,
  type CreateVehicleSchema,
} from "@/app/vehicles/schemas/create-vehicle.schema"
import type { VehicleCreateDTO } from "@/app/vehicles/types/vehicle.type"

export default function ModalAddVehicle() {
  const { closeModal } = useModalStore()

  // 🔥 Mutación de creación
  const createVehicle = useCreateVehicle()

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
  // 🧾 Form
  const form = useForm<CreateVehicleSchema>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      licensePlate: "",
      vehicleTypeId: "",
      model: "",
      tankCapacity: undefined,
      numberOfWheels: undefined,
      initialKilometrage: undefined,
    },
  })

  // 👀 Verificar existencia de placa (solo en creación)
  const licensePlate = useWatch({
    control: form.control,
    name: "licensePlate",
  })

  const { data: vehicleExists } = useExistsVehicleByPlate(
  licensePlate || undefined,
)

  const handleClose = () => {
    closeModal(ModalsVehicle.ADD_VEHICLE)
    form.reset()
  }
 const handlePlateChange = (raw: string) => {
  // 1) Todo en mayúscula y solo letras/números
  let value = raw.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (value.length > 6) {
    value = value.slice(0, 6)
  }
  if (value.length <= 3) {
    form.setValue("licensePlate", value)
    return
  }
 
  const firstPart = value.slice(0, 3)      
  const secondPart = value.slice(3)       

  const formatted = `${firstPart}-${secondPart}` 
  form.setValue("licensePlate", formatted)
}
  const onSubmit = (data: CreateVehicleSchema) => {
    // Evitamos chocar con placa ya registrada
    if (vehicleExists) {
      form.setError("licensePlate", {
        type: "manual",
        message: "El vehículo ya existe en el sistema",
      })
      return
    }
    // Mapear formulario → DTO del backend
    const dto: VehicleCreateDTO = {
      plate: data.licensePlate,
      vehicleTypeId: Number(data.vehicleTypeId),
      model: data.model || undefined,
      fuelCapacityGal: data.tankCapacity,
      numberOfWheels: data.numberOfWheels,
      mileage: data.initialKilometrage,
    }
    createVehicle.mutate(dto, {
      onSuccess: () => {
        form.reset()
      },
      onError: () => {
      },
    })
  }
  /* ----------------- UI ----------------- */
  return (
    <Modal
      modalId={ModalsVehicle.ADD_VEHICLE}
      title="Nuevo Vehículo"
      className="md:max-w-md!"
      onClose={handleClose}
    >
      <FormWrapper
        form={form}
        onSubmit={onSubmit}
        className="space-y-4"
      >
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
          <Button type="button" onClick={handleClose} variant="outline">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createVehicle.isPending}
          >
            {createVehicle.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
