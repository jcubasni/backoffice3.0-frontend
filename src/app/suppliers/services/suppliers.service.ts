import { SupplierResponse } from "@/app/suppliers/types/supplier.type"
import { CreateSupplierSchema } from "@/app/suppliers/schemas/create-supplier.schema"

const STORAGE_KEY = "suppliers"

/* ---------------------------------------------
   Helpers: lectura / escritura localStorage
---------------------------------------------- */
function loadSuppliers(): SupplierResponse[] {
  if (typeof window === "undefined") return []

  const data = window.localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveSuppliers(suppliers: SupplierResponse[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers))
}

/* ---------------------------------------------
   Mapeo local para tipos de documento
---------------------------------------------- */
const DOCUMENT_TYPES: Record<number, string> = {
  1: "PASAPORTE",
  2: "DNI",
  3: "RUC",
  4: "CE",
}

/** Obtiene el nombre del tipo de documento */
function getDocumentTypeName(id: number): string {
  return DOCUMENT_TYPES[id] ?? "Otro"
}

/* ---------------------------------------------
   GET — usado por useGetSuppliers()
---------------------------------------------- */
export async function getSuppliers(): Promise<SupplierResponse[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(loadSuppliers()), 120)
  })
}

/* ---------------------------------------------
   ADD — usado por useAddSupplier()
---------------------------------------------- */
export async function addSupplier(
  data: CreateSupplierSchema,
): Promise<SupplierResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const current = loadSuppliers()

      // Asegurar que siempre sea number
      const docTypeId = Number(data.documentType)

      const newSupplier: SupplierResponse = {
        id: String(Date.now()),
        documentType: {
          id: docTypeId,
          name: getDocumentTypeName(docTypeId),
        },
        documentNumber: data.documentNumber,
        businessName: data.businessName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        isActive: data.isActive ?? true,
      }

      const updated = [...current, newSupplier]
      saveSuppliers(updated)

      resolve(newSupplier)
    }, 120)
  })
}
