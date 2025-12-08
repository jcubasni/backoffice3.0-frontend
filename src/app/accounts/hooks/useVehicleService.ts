import { useQuery } from "@tanstack/react-query"
import { existVehicle, getVehicleTypes } from "../services/vehicle.service"

export function useGetVehicleTypes() {
  return useQuery({
    queryKey: ["vehicle-types"],
    queryFn: getVehicleTypes,
  })
}

export function useExistVehicle(plate?: string) {
  return useQuery({
    queryKey: ["vehicle", "exists", plate],
    queryFn: () => existVehicle(plate!),
    enabled: !!plate,
  })
}
