import { ContometerStatus } from "../types/contometer.type"

export const formatContometerStatus = (status: ContometerStatus): string => {
  switch (status) {
    case ContometerStatus.OPENED:
      return "Abierto"
    case ContometerStatus.CLOSED:
      return "Cerrado"
    default:
      return "Sin estado"
  }
}
