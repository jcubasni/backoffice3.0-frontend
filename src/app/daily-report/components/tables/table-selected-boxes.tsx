import { Button } from "@/components/ui/button"
import { DataTable } from "@/shared/components/ui/data-table"
import Modal from "@/shared/components/ui/modal"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetDailyReportBoxes } from "../../hooks/useDailyReportsService"
import { previewDailyReportColumns } from "../../lib/daily-report/preview-daily-report-columns"

interface TableSelectedBoxesProps {
  id: string
  closedAt: string | null
}

export default function TableSelectedBoxes({
  id,
  closedAt,
}: TableSelectedBoxesProps) {
  const { data, isLoading, isFetching } = useGetDailyReportBoxes(id)
  const table = useDataTable({
    data,
    columns: previewDailyReportColumns,
    isLoading: isLoading || isFetching,
    showRows: 7,
    enableColumnVisibility: !!closedAt,
    hiddenColumns: closedAt ? ["actions"] : [],
  })
  return (
    <>
      <DataTable table={table} />
      <Modal.Footer>
        <Button
          onClick={() => useModalStore.getState().closeModal("modal-boxes")}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </>
  )
}
