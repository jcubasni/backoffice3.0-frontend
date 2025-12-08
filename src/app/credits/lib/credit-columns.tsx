import { ColumnDef } from "@tanstack/react-table"

export const creditColumns: ColumnDef<any>[] = [
  { header: "#" },
  { header: "Tipo de documento" },
  { header: "Documento" },
  { header: "Fecha Emisión" },
  { header: "Fecha Vto." },
  { header: "Nº Pago" },
  { header: "Saldo" },
  { header: "Total" },
]
