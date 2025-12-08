import { fetchData } from "@/shared/lib/fetch-data"
import { VehicleType } from "../types/client.type"

export const getVehicleTypes = async (): Promise<VehicleType[]> => {
  const response = await fetchData<VehicleType[]>({
    url: "/vehicles/types",
  })
  return response
}

export const existVehicle = async (plate: string): Promise<boolean> => {
  const response = await fetchData<boolean>({
    url: `/vehicles/exists/${plate}`,
  })
  return response
}
