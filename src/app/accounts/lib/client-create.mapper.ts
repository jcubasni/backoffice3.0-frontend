import type { CreateClientSchema } from "../schemas/create-client.schema"
import type { CreateClientBody } from "../services/clients.service"

export const mapCreateClientSchemaToCreateClientBody = (
  data: CreateClientSchema,
): CreateClientBody => {
  return {
    documentTypeId: Number(data.documentType),
    documentNumber: data.documentNumber,
    firstName: data.firstName,
    lastName: data.lastName || undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,
    // dateOfBirth: data.dateOfBirth || undefined, // si lo tienes
    address: data.address
      ? {
          addressLine1: data.address,
          reference: data.reference || undefined,
          districtId: data.districtId || undefined,
        }
      : undefined,
  }
}
