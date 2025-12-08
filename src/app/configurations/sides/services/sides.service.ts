import { ProductResponse } from "@/app/products/types/product.type"
import { fetchData } from "@/shared/lib/fetch-data"
import { AddSideDTO, Side } from "../types/sides.type"

// ✅ Obtener todos los lados
export async function getSides(localId: string): Promise<Side[]> {
  return fetchData({
    url: "/sides",
    headers: { "x-local-id": localId },
  })
}

// ✅ Crear un nuevo lado
export const addSide = async (body: AddSideDTO): Promise<Side> => {
  return fetchData<Side>({
    url: "/sides",
    method: "POST",
    body,
  })
}

// ✅ Eliminar un lado
export const deleteSide = async (id: string): Promise<void> => {
  return fetchData<void>({
    url: `/sides/${id}`,
    method: "DELETE",
  })
}

// ✅ Actualizar una manguera (cambiar producto)
export const updateHose = async (
  id: string,
  productId: string | null,
): Promise<void> => {
  return fetchData<void>({
    url: `/hoses/${id}`,
    method: "PATCH",
    body: { productId },
  })
}

// ✅ Actualizar múltiples mangueras (guardar todo)
export const updateMultipleHoses = async (
  body: { id: string; productId: string | null }[],
): Promise<void> => {
  return fetchData<void>({
    url: "/hoses",
    method: "PATCH",
    body,
  })
}

// ✅ Obtener productos para ComboBox
export const getProductOptions = async (): Promise<ProductResponse[]> => {
  const response = await fetchData<ProductResponse[]>({
    url: "/products",
  })
  return response
}
