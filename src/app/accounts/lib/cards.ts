import type {
  AccountSchema,
  VehicleAccountTypeSchema,
  VehicleSchema,
} from "@/app/accounts/schemas/create-client.schema"
import { AccountTypeForClient } from "@/app/accounts/types/client.type"

export type CardAssignment = VehicleAccountTypeSchema & {
  id: string
  licensePlate: string
  vehicleIndex: number
  accountIndex: number
}

/**
 * Obtiene todas las asignaciones de tarjetas de todos los vehiculos
 */
export const getAllCardAssignments = (
  vehicles: VehicleSchema[],
): CardAssignment[] => {
  const assignments: CardAssignment[] = []
  vehicles.forEach((vehicle, vehicleIndex) => {
    if (vehicle.accountsType && vehicle.accountsType.length > 0) {
      vehicle.accountsType.forEach((accountType, accountIndex) => {
        assignments.push({
          id: `${vehicle.licensePlate}__${accountType.accountTypeId}__${accountIndex}`,
          licensePlate: vehicle.licensePlate,
          vehicleIndex,
          accountIndex,
          ...accountType,
        })
      })
    }
  })
  return assignments
}

/**
 * Obtiene los tipos de cuenta ya asignados a una placa especifica
 */
export const getAssignedAccountTypes = (
  selectedPlacaCard: string,
  vehicles: VehicleSchema[],
): AccountTypeForClient[] => {
  if (!selectedPlacaCard) return []

  const vehicle = vehicles.find((v) => v.licensePlate === selectedPlacaCard)
  if (!vehicle || !vehicle.accountsType) return []

  return vehicle.accountsType.map((acc) => acc.accountTypeId)
}

/**
 * Filtra las cuentas disponibles basado en las ya asignadas
 */
export const getAvailableAccounts = (
  accounts: AccountSchema[],
  selectedPlacaCard: string,
  vehicles: VehicleSchema[],
  editingCardId: string | null,
): AccountSchema[] => {
  const assignedTypes = getAssignedAccountTypes(selectedPlacaCard, vehicles)

  // Si estamos editando, permitir el tipo actual
  if (editingCardId) {
    const [licensePlate, , accountIndexStr] = editingCardId.split("__")
    if (licensePlate === selectedPlacaCard) {
      const accountIndex = Number.parseInt(accountIndexStr, 10)
      const vehicle = vehicles.find((v) => v.licensePlate === selectedPlacaCard)
      const currentAccountType =
        vehicle?.accountsType?.[accountIndex]?.accountTypeId

      if (currentAccountType !== undefined) {
        return accounts.filter(
          (acc) =>
            !assignedTypes.includes(acc.accountTypeId) ||
            acc.accountTypeId === currentAccountType,
        )
      }
    }
  }

  return accounts.filter((acc) => !assignedTypes.includes(acc.accountTypeId))
}

/**
 * Genera el cardNumber unico concatenando el cardNumber del vehiculo con el codigo del tipo de cuenta
 */
export const generateCardNumberForAccount = (
  vehicleCardNumber: string,
  accountTypeCode: string,
): string => {
  return `${accountTypeCode}${vehicleCardNumber}`
}

/**
 * Crea una nueva asignacion de cuenta a vehiculo
 */
export const createNewAssignment = (
  accountTypeId: AccountTypeForClient,
  accountTypeCode: string,
  vehicleCardNumber: string,
): VehicleAccountTypeSchema => {
  return {
    accountTypeId,
    cardNumber: generateCardNumberForAccount(vehicleCardNumber, accountTypeCode),
    balance: 0,
    productIds: [0],
  }
}
