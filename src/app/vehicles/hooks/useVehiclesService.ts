import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  getVehicleTypes,
  getVehicles,
  type GetVehiclesParams,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  existsVehicleByPlate,
} from "../services/vehicles.service"

import type {
  VehicleTypeResponse,
  VehicleListResponse,
  VehicleCreateDTO,
  VehicleUpdateDTO,
} from "../types/vehicle.type"

import { useModalStore } from "@/shared/store/modal.store"
import { ModalsVehicle } from "../types/modals-name"

const VEHICLES_QUERY_KEY = ["vehicles"] as const
const VEHICLE_TYPES_QUERY_KEY = ["vehicle-types"] as const

/* -------------------------------------------
 * 🟢 LISTAR TIPOS DE VEHÍCULO
 * ---------------------------------------- */
export function useGetVehicleTypes() {
  return useQuery<VehicleTypeResponse[]>({
    queryKey: VEHICLE_TYPES_QUERY_KEY,
    queryFn: getVehicleTypes,
  })
}

/* -------------------------------------------
 * 🟢 LISTAR VEHÍCULOS (con filtros)
 * ---------------------------------------- */
export function useGetVehicles(params?: GetVehiclesParams) {
  return useQuery<VehicleListResponse>({
    // 👇 importante: usamos el mismo prefijo que VEHICLES_QUERY_KEY
    queryKey: [...VEHICLES_QUERY_KEY, params] as const,
    queryFn: () => getVehicles(params),
  })
}

/* -------------------------------------------
 * 🟢 CREAR VEHÍCULO
 * ---------------------------------------- */
export function useCreateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-vehicle"],
    mutationFn: (body: VehicleCreateDTO) => createVehicle(body),

    onSuccess() {
      toast.success("Vehículo creado correctamente")

      // 🔁 Refrescar listado
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })

      // Cerrar modal de Nuevo vehículo
      useModalStore.getState().closeModal(ModalsVehicle.ADD_VEHICLE)
    },

    onError() {
      toast.error("No se pudo crear el vehículo")
    },
  })
}

/* -------------------------------------------
 * 🟢 ACTUALIZAR VEHÍCULO
 * ---------------------------------------- */
export function useUpdateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-vehicle"],
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: VehicleUpdateDTO
    }) => updateVehicle(id, data),

    onSuccess() {
      toast.success("Vehículo actualizado correctamente")
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
      useModalStore.getState().closeModal(ModalsVehicle.EDIT_VEHICLE)
    },

    onError() {
      toast.error("No se pudo actualizar el vehículo")
    },
  })
}

/* -------------------------------------------
 * 🟢 ELIMINAR VEHÍCULO
 * ---------------------------------------- */
export function useDeleteVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-vehicle"],
    mutationFn: (id: string) => deleteVehicle(id),

    onSuccess() {
      toast.success("Vehículo eliminado correctamente")
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
      useModalStore.getState().closeModal(ModalsVehicle.DELETE_VEHICLE)
    },

    onError() {
      toast.error("No se pudo eliminar el vehículo")
    },
  })
}

/* -------------------------------------------
 * 🟢 VERIFICAR SI EXISTE UNA PLACA
 * ---------------------------------------- */
// useVehiclesService.ts
export function useExistsVehicleByPlate(plate?: string) {
  return useQuery<boolean>({
    queryKey: ["vehicle-exists-by-plate", plate],
    queryFn: () => existsVehicleByPlate(plate!),
    enabled: !!plate && plate.length > 0,
  })
}

