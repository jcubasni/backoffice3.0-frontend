// client-mapper.ts
import type { CreateClientSchema } from "@/app/accounts/schemas/create-client.schema"
import type { ClientDTO } from "@/app/accounts/types/client.type"

export const mapCreateClientSchemaToClientDTO = (
  data: CreateClientSchema,
): ClientDTO => {
  return {
    documentTypeId: Number(data.documentType),
    documentNumber: data.documentNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,

    // ✅ LO ÚNICO que necesita el backend para ubigeo (según tu ClientDTO)
    districtId: data.districtId,

    email: data.email,
    phone: data.phone,

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
      })) ?? [],

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
      })) ?? [],
  }
}
