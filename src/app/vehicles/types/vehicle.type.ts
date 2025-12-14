// 👉 Tipo que devuelve GET /vehicles/types
export type VehicleTypeResponse = {
  id: number
  name: string
}

// 👉 Vehículo tal como viene en cada fila de GET /vehicles
export type VehicleResponse = {
  id: string
  plate: string
  code: string | null
  vehicleTypeId: number | null
  mileage: number | null
  numberOfWheels: number | null
  brand: string | null
  model: string | null
  year: number | null
  color: string | null
  fuelType: string | null
  vin: string | null
  chassisNumber: string | null
  fuelCapacityGal: string // viene como "0.000"
  fuelReserveGal: string  // viene como "0.000"
  fuelTankCount: number | null
  insurancePolicy: string | null
  notes: string | null
}

// 👉 Wrapper de paginación de GET /vehicles
export type VehicleListResponse = {
  rows: VehicleResponse[]
  total: number
  page: number
  limit: number
  pages: number
}

// 👉 Body para crear vehículo (POST /vehicles)
export type VehicleCreateDTO = {
  plate: string
  vehicleTypeId: number
  // Campos opcionales
  code?: string
  mileage?: number
  numberOfWheels?: number
  brand?: string
  model?: string
  year?: number
  color?: string
  fuelType?: string
  vin?: string
  chassisNumber?: string
  fuelCapacityGal?: number
  fuelReserveGal?: number
  fuelTankCount?: number
  insurancePolicy?: string
  notes?: string
  // metadata?: Record<string, unknown> // si más adelante lo usas
}

// 👉 Body para actualizar vehículo (PATCH /vehicles/:id)
// todos opcionales
export type VehicleUpdateDTO = Partial<VehicleCreateDTO>

// 👉 Fila que usaremos en la tabla (front-only)
export type VehicleTableRow = {
  id: string
  plate: string
  vehicleTypeName?: string
  code?: string | null
  model?: string | null
  brand?: string | null
  year?: number | null
}
