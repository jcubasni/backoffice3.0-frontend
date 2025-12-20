import type { UseFormSetValue } from "react-hook-form"
import type { PersonByDocumentResponse } from "@/app/person/services/persons.service"

type FieldsMap = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  addressLine1?: string
  districtId?: string
}

export function applyPersonToForm<T extends Record<string, any>>(
  setValue: UseFormSetValue<T>,
  person: PersonByDocumentResponse,
  map: FieldsMap,
) {
  if (map.firstName) setValue(map.firstName as any, person.firstName as any)
  if (map.lastName) setValue(map.lastName as any, person.lastName as any)
  if (map.email) setValue(map.email as any, (person.email ?? "") as any)
  if (map.phone) setValue(map.phone as any, (person.phone ?? "") as any)

  if (map.addressLine1) {
    setValue(map.addressLine1 as any, (person.address?.addressLine1 ?? "") as any)
  }
  if (map.districtId) {
    setValue(map.districtId as any, (person.address?.districtId ?? "") as any)
  }
}
