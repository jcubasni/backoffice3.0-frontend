import type { CreateClientSchema } from "../schemas/create-client.schema"
import type { CreateClientBody } from "../services/clients.service"

export const mapCreateClientSchemaToCreateClientBody = (
  data: CreateClientSchema,
): CreateClientBody => {
  const hasAddress = !!data.address
  const hasDistrict = !!data.districtId

  return {
    documentTypeId: Number(data.documentType),
    documentNumber: data.documentNumber,
    firstName: data.firstName,
    lastName: data.lastName || undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,

    // ✅✅ CAMBIO: si hay address o districtId, mandamos address object
    address: hasAddress || hasDistrict
      ? {
          addressLine1: data.address ?? "",
          districtId: data.districtId || undefined,
          // reference: data.reference || undefined, // (lo comentas como dijiste)
        }
      : undefined,
  }
}
