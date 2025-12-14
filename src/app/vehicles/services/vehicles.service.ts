import { fetchData } from "@/shared/lib/fetch-data"
import type {
  VehicleTypeResponse,
  VehicleListResponse,
  VehicleCreateDTO,
  VehicleUpdateDTO,
  VehicleResponse,
} from "../types/vehicle.type"

/* ---------------------------------------------
 * 📌 LISTAR TIPOS DE VEHÍCULO
 * GET /vehicles/types
 * ------------------------------------------ */
export const getVehicleTypes = async (): Promise<VehicleTypeResponse[]> => {
  const response = await fetchData<VehicleTypeResponse[]>({
    url: "/vehicles/types",
  })
  return response
}

/* ---------------------------------------------
 * 📌 LISTAR VEHÍCULOS (con paginación)
 * GET /vehicles
 *  - page?: number
 *  - limit?: number
 *  - plate?: string
 *  - vehicleTypeId?: number
 * ------------------------------------------ */
export type GetVehiclesParams = {
  page?: number
  limit?: number
  plate?: string
  vehicleTypeId?: number
}

export const getVehicles = async (
  params?: GetVehiclesParams,
): Promise<VehicleListResponse> => {
  const response = await fetchData<VehicleListResponse>({
    url: "/vehicles",
    params,
  })
  return response
}

/* ---------------------------------------------
 * 📌 CREAR VEHÍCULO
 * POST /vehicles
 * ------------------------------------------ */
export const createVehicle = async (
  body: VehicleCreateDTO,
): Promise<VehicleResponse> => {
  const response = await fetchData<VehicleResponse>({
    url: "/vehicles",
    method: "POST",
    body,
  })
  return response
}

/* ---------------------------------------------
 * 🔄 ACTUALIZAR VEHÍCULO
 * PATCH /vehicles/:id
 * ------------------------------------------ */
export const updateVehicle = async (
  id: string,
  body: VehicleUpdateDTO,
): Promise<VehicleResponse> => {
  const response = await fetchData<VehicleResponse>({
    url: `/vehicles/${id}`,
    method: "PATCH",
    body,
  })
  return response
}

/* ---------------------------------------------
 * 🗑 ELIMINAR VEHÍCULO
 * DELETE /vehicles/:id
 * ------------------------------------------ */
export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    await fetchData<void>({
      url: `/vehicles/${id}`,
      method: "DELETE",
    })
  } catch (error) {
    // 👇 Si el error viene de response.json() por body vacío (204), lo ignoramos
    if (
      error instanceof SyntaxError &&
      error.message.includes("Unexpected end of JSON input")
    ) {
      return
    }

    // Cualquier otro error sí lo propagamos
    throw error
  }
}

/* ---------------------------------------------
 * 🔍 VERIFICAR SI EXISTE PLACA
 * GET /vehicles/exists/:plate
 *   → asumimos que devuelve { exists: boolean }
 *   (si tu backend devuelve otra forma, ajustas el tipo)
 * ------------------------------------------ */
type ExistsVehicleResponse = {
  exists: boolean
}

export const existsVehicleByPlate = async (
  plate: string,
): Promise<boolean> => {
  const response = await fetchData<ExistsVehicleResponse>({
    url: `/vehicles/exists/${plate}`,
  })
  return response.exists
}
