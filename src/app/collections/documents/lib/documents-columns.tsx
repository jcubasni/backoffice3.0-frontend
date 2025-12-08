import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useModalStore } from "@/shared/store/modal.store"
import { DocumentResponse, DocumentState } from "../types/document.type"

export const documentsColumns: ColumnDef<DocumentResponse>[] = [
  {
    header: "Nº comprobante",
    accessorKey: "documentNumber",
  },
  {
    header: "Pago referencia",
  },
  {
    header: "RUC",
  },
  {
    header: "Cliente",
  },
  {
    header: "Nº cuotas",
    accessorKey: "installmentsCount",
  },
  {
    header: "Fecha pago",
  },
  {
    header: "Total",
    accessorKey: "amount",
  },
  {
    header: "Cobrado",
    accessorKey: "paidAmount",
  },
  {
    header: "Por cobrar",
    accessorKey: "outstanding",
  },
  {
    header: "Estado",
    cell: ({ row }) => {
      const { status, paid } = row.original

      if (status === DocumentState.ANULADO)
        return <Badge variant="red">Anulado</Badge>
      if (!paid)
        return (
          <Button
            variant="outline"
            size="none"
            className="px-2 py-0.5"
            onClick={() =>
              useModalStore
                .getState()
                .openModal("modal-installment", row.original)
            }
          >
            Por cobrar
          </Button>
        )
      return <Badge variant="green">Pagado</Badge>
    },
  },
  {
    id: "actions",
  },
]
