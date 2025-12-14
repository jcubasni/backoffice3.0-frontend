// components/modals/modal-delete-vehicle.tsx
"use client"

import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

import { ModalsVehicle } from "@/app/vehicles/types/modals-name"
import { useDeleteVehicle } from "@/app/vehicles/hooks/useVehiclesService"
import type { VehicleResponse } from "@/app/vehicles/types/vehicle.type"

export default function ModalDeleteVehicle() {
  const { openModals, closeModal } = useModalStore()

  const dataModal = openModals.find(
    (m) => m.id === ModalsVehicle.DELETE_VEHICLE,
  )?.prop as { vehicle?: VehicleResponse } | undefined

  const vehicle = dataModal?.vehicle
  const deleteVehicle = useDeleteVehicle()

  if (!vehicle) return null

  const handleClose = () => {
    closeModal(ModalsVehicle.DELETE_VEHICLE)
  }

  const handleDelete = () => {
    // 👇 AQUÍ es lo clave: pasar SOLO el id (uuid)
    deleteVehicle.mutate(vehicle.id)
  }

  return (
    <Modal
      modalId={ModalsVehicle.DELETE_VEHICLE}
      title="Eliminar vehículo"
      onClose={handleClose}
      className="md:max-w-md!"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          ¿Estás seguro de que deseas eliminar el vehículo{" "}
          <span className="font-semibold">{vehicle.plate}</span>? Esta acción no
          se puede deshacer.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteVehicle.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={deleteVehicle.isPending}
          >
            {deleteVehicle.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
