// ⚠️ Importante:
// Usa IDs distintos a los de "accounts" para que no choquen en useModalStore.

export const ModalsVehicle = {
  ADD_VEHICLE: "vehicle-modal-add-vehicle",
  EDIT_VEHICLE: "vehicle-modal-edit-vehicle",
  DELETE_VEHICLE: "vehicle-modal-delete-vehicle",
} as const

export type ModalsVehicleId =
  (typeof ModalsVehicle)[keyof typeof ModalsVehicle]
