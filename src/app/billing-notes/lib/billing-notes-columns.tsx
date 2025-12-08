import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { NotesResponse } from "../types/notes.type"

export const notesColumns: ColumnDef<NotesResponse>[] = [
  {
    header: "Fecha y hora",
    accessorFn: (row) => format(row.createdAt, "yyyy-MM-dd HH:mm"),
  },
  {
    header: "Serie",
    accessorKey: "serie",
  },
  {
    header: "Correlativo",
    accessorKey: "number",
  },
  {
    header: "Doc. Referencia",
    accessorKey: "referenceDocumentNumber",
  },
  {
    header: "RUC",
    accessorKey: "client.documentNumber",
  },
  // {
  //   header: "Cliente",
  //   accessorFn: (row) => row.client.firstName.toUpperCase(),
  // },
  {
    header: "Fecha de emision",
    accessorFn: (row) => format(row.createdAt, "yyyy-MM-dd"),
  },
  {
    header: "Fecha de vencimiento",
    accessorFn: (row) => format(row.issueDate, "yyyy-MM-dd"),
  },
  {
    header: "Total",
    accessorKey: "totalAmount",
  },
  {
    header: "Estado",
    accessorKey: "status",
  },
  // { id: "actions" },
]
