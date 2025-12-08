import { Button } from "@/components/ui/button"
import { DataTable } from "@/shared/components/ui/data-table"
import Modal from "@/shared/components/ui/modal"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { adjustDate } from "@/shared/lib/date"
import { useModalStore } from "@/shared/store/modal.store"
import { useAddDailyReportBox, useGetBoxes } from "../../hooks/useBoxesService"
import { addBoxesToReportColumns } from "../../lib/daily-report/add-daily-report-columns"

interface TableAddBoxesProps {
  id: string
  date: string
  closedAt: string | null
}

export default function TableSelectedBoxes({
  id,
  date,
  closedAt,
}: TableAddBoxesProps) {
  const { data, isLoading, isFetching } = useGetBoxes({
    startDate: date,
    endDate: adjustDate(date, 1),
  })
  const addBox = useAddDailyReportBox()
  const table = useDataTable({
    data,
    columns: addBoxesToReportColumns,
    isLoading: isLoading || isFetching,
    showRows: 7,
    enableRowSelection: !closedAt,
    enableMultiRowSelection: !closedAt,
    enableColumnVisibility: !closedAt,
    hiddenColumns: closedAt ? ["actions"] : [],
  })
  const handleAdd = () => {
    if (!id) return
    const cashRegisterIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id)
    addBox.mutate({
      dailyReportId: id,
      cashRegisterIds,
    })
  }
  return (
    <>
      <DataTable table={table} />
      <Modal.Footer className="grid-cols-2">
        <Button onClick={handleAdd}>Aceptar</Button>
        <Button
          onClick={() => useModalStore.getState().closeModal("modal-boxes")}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </>
  )
}
