import type { CreateClientSchema } from "@/app/accounts/schemas/create-client.schema"
import type { ClientDTO } from "@/app/accounts/types/client.type"

/**
 * Transforma los datos del formulario CreateClientSchema a ClientDTO
 * para enviarlos al backend
 */
export const mapCreateClientSchemaToClientDTO = (
  data: CreateClientSchema,
): ClientDTO => {
  return {
    // Datos del cliente
    documentTypeId: Number(data.documentType),
    documentNumber: data.documentNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    department: data.department,
    province: data.province,
    district: data.district,
    email: data.email,
    phone: data.phone,

    // Cuentas - transformar de AccountSchema[] a ClientAccountConfigDto[]
    accounts:
      data.accounts?.map((account) => ({
        accountTypeId: account.accountTypeId,
        accountData: account.accountData
          ? {
              creditLine: account.accountData.creditLine,
              balance: account.accountData.balance,
              billingDays: account.accountData.billingDays,
              creditDays: account.accountData.creditDays,
              installments: account.accountData.installments,
              startDate: account.accountData.startDate.toISOString(),
              endDate: account.accountData.endDate.toISOString(),
            }
          : undefined,
      })) || [],

    // Vehiculos - transformar de VehicleSchema[] a VehicleCardDto[]
    vehicles:
      data.vehicles?.map((vehicle) => ({
        licensePlate: vehicle.licensePlate,
        vehicleType: Number(vehicle.vehicleType),
        model: vehicle.model,
        tankCapacity: vehicle.tankCapacity,
        numberOfWheels: vehicle.numberOfWheels,
        initialKilometrage: vehicle.initialKilometrage,
        accountsType: vehicle.accountsType?.map((accountType) => ({
          accountTypeId: accountType.accountTypeId,
          cardNumber: accountType.cardNumber,
          balance: accountType.balance ?? 0,
          productIds: accountType.productIds,
        })),
      })) || [],
  }
}
