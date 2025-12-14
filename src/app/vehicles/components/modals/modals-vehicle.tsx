"use client"

import { ModalContainer } from "@/shared/components/modals/modal-container"
import { ModalsVehicle } from "@/app/vehicles/types/modals-name"

export function ModalsVehicleRoot() {
  return (
    <ModalContainer
      modals={[
        {
          modalId: ModalsVehicle.ADD_VEHICLE,
          component: () =>
            import("@/app/vehicles/components/modals/modal-add-vehicle"),
        },
        {
          modalId: ModalsVehicle.EDIT_VEHICLE,
          component: () =>
            import("@/app/vehicles/components/modals/modal-edit-vehicle"),
        },
        // luego agregamos DELETE
        {
          modalId: ModalsVehicle.DELETE_VEHICLE,
          component: () =>
            import("@/app/vehicles/components/modals/modal-delete-vehicle"),
        },
      ]}
    />
  )
}
