import { EmployedResponse } from "../types/employed.type"

// MOCK DATA (maquetación)
export const mockEmployeds: EmployedResponse[] = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    documentNumber: "12345678",
    documentType: { id: 1, name: "DNI" },
    email: "juan@example.com",
    phoneNumber: "987654321",
    address: "Av. Siempre Viva 123",
    isActive: true,
  },
  {
    id: "2",
    firstName: "María",
    lastName: "Gómez",
    documentNumber: "87654321",
    documentType: { id: 1, name: "DNI" },
    email: "maria@example.com",
    phoneNumber: "987111222",
    address: "Calle Falsa 456",
    isActive: false,
  },
]

// GET (mock)
export function getEmployeds() {
  return mockEmployeds
}

// ADD (mock)
export function addEmployed(data: any) {
  console.log("Empleado agregado:", data)
  return data
}

// UPDATE (mock)
export function updateEmployed(data: any) {
  console.log("Empleado actualizado:", data)
  return data
}
