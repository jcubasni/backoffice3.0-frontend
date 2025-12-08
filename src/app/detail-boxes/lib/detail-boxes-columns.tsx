import { ColumnDef } from "@tanstack/react-table"
import { Eye, FileText, Fuel, ReceiptText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatDateTime } from "@/shared/lib/date"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"
import { usePanelStore } from "@/shared/store/panel.store"
import { DetailBoxes, DetailBoxesStatus } from "../types/detail-boxes.type"
import { formatDetailBoxesStatus } from "./detail-boxes-filters"

export const detailBoxesColumns: ColumnDef<DetailBoxes>[] = [
  {
    id: "select",
    size: 40,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(!!checked)
        }}
        className="mx-auto"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => {
            row.toggleSelected(!!checked)
          }}
          className="mx-auto"
        />
      )
    },
  },
  {
    header: "N° de caja",
    cell: ({ row }) => {
      const code = row.original.cashRegisterCode
      return <span className="text-gray-400">#{code}</span>
    },
  },
  {
    header: "Fecha de apertura",
    accessorFn: (row) => formatDateTime(row.openingDate),
  },
  {
    header: "Responsable",
    accessorKey: "responsible.name",
  },
  {
    header: "Estado",
    accessorKey: "statusCode",
    cell: ({ row }) => {
      const status = row.original.statusCode
      const variants = {
        [DetailBoxesStatus.OPEN]: "blue",
        [DetailBoxesStatus.LIQUIDATED]: "red",
        [DetailBoxesStatus.PRELIQUIDATED]: "purple",
        [DetailBoxesStatus.PRECLOSED]: "amber",
        [DetailBoxesStatus.CLOSED]: "green",
      } as const
      return (
        <Badge variant={variants[status] || "blue"}>
          {formatDetailBoxesStatus(status)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    size: 0,
    cell: ({ row }) => {
      const status = row.original.statusCode
      const active =
        status !== DetailBoxesStatus.OPEN &&
        status !== DetailBoxesStatus.PRECLOSED &&
        status !== DetailBoxesStatus.LIQUIDATED

      return (
        <TooltipButton.Box>
          {/* Contómetro */}
          <TooltipButton
            tooltip="Contómetro"
            to={Routes.Contometer}
            search={{ cashRegisterId: row.original.cashRegisterId }}
            icon={Fuel}
          />

          {/* Vista previa */}
          <TooltipButton
            tooltip="Vista previa"
            onClick={() => {
              useModalStore
                .getState()
                .openModal("modal-preview-detail-box", row.original)
            }}
            icon={Eye}
          />

          {/* Liquidar caja */}
          <TooltipButton
            tooltip="Liquidar caja"
            onClick={() => {
              useModalStore
                .getState()
                .openModal("modal-detail-box", row.original)
            }}
            icon={ReceiptText}
            disabled={!active}
          />

          {/*Reporte de liquidación */}
        <TooltipButton
            tooltip="Reporte de Liquidación"
            onClick={() => {
              usePanelStore
                .getState()
                .openPanel("liquidation-report", {
                  cashRegister: row.original.cashRegisterCode, 
                })
            }}
            icon={FileText}
          />
        </TooltipButton.Box>
      )
    },
  },
]
