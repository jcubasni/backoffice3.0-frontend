import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TooltipButton } from "@/shared/components/ui/tooltip-button";
import { formatDateTime } from "@/shared/lib/date";
import { formatCurrency } from "@/shared/lib/number";
import { useModalStore } from "@/shared/store/modal.store";
import { SaleResponse } from "../../types/sale";

export const salesColumns: ColumnDef<SaleResponse>[] = [
  {
    header: "Tipo de documento",
    accessorKey: "documentType.name",
  },
  {
    header: "Comprobante",
    accessorKey: "documentNumber",
  },
  {
    header: "Nombre o Razon social",
    accessorFn: (row) => `${row.client.firstName} ${row.client.lastName ?? ""}`,
  },
  {
    header: "N° de documento",
    accessorKey: "client.documentNumber",
  },
  {
    header: "Fecha y hora",
    accessorFn: (row) => formatDateTime(row.createdAt),
  },
  {
    header: "Caja",
    accessorKey: "cashRegister.cashRegisterCode",
  },
  {
    header: "Total",
    accessorFn: (row) => formatCurrency(row.totalAmount),
  },
  {
    header: "Estado",
    cell: ({ row }) => {
      const active = row.original.state === 1;
      return (
        <Badge variant={active ? "green" : "amber"}>
          {active ? "Activo" : "Anulado"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Ver"
            icon={Eye}
            onClick={() => {
              useModalStore
                .getState()
                .openModal("modal-preview-sale", row.original);
            }}
          />
        </TooltipButton.Box>
      );
    },
  },
];
