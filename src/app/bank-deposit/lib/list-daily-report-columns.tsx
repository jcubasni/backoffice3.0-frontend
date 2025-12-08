import { AssignedReport } from "@bank-deposit/types/daily-report.type"
import { ColumnDef } from "@tanstack/react-table"
import { formatCurrency } from "@/shared/lib/number"

export const listDailyReportColumns: ColumnDef<AssignedReport>[] = [
  {
    header: "N° parte diario",
    accessorKey: "period",
  },
  {
    header: "Monto de parte diario",
    accessorFn: (row) => formatCurrency(row.totalDailyReportAmount),
  },
  {
    header: "Abono de depósito",
    accessorFn: (row) => formatCurrency(row.totalDepositAmount),
  },
  // {
  //   id: "delete",
  //   size: 0,
  //   cell: ({ row }) => {
  //     const { bankDeposit } = useParams({
  //       from: "/(sidebar)/bank-deposit/list/$bankDeposit",
  //     })
  //     return (
  //       <div>
  //         <Button
  //           variant="outline"
  //           size="icon"
  //           onClick={() => {
  //             useModalStore.getState().openModal("modal-delete-daily-report", {
  //               id: bankDeposit,
  //               dailyReportIds: [row.original.id],
  //             })
  //           }}
  //         >
  //           <Trash />
  //         </Button>
  //       </div>
  //     )
  //   },
  // },
]
