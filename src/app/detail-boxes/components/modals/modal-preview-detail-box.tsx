import { Button } from "@/components/ui/button"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { formatCurrency } from "@/shared/lib/number"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetDetailBox } from "../../hooks/useDetailBoxService"
import { previewDetailBoxColumns } from "../../lib/preview-detail-box-columns"

export default function ModalPreviewDetailBox() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-preview-detail-box",
  )?.prop
  const { data, isLoading, isFetching } = useGetDetailBox(
    dataModal?.cashRegisterId,
  )

  const table = useDataTable({
    data: data?.details,
    columns: previewDetailBoxColumns,
    isLoading: isLoading || isFetching,
    showRows: 7,
  })

  return (
    <Modal
      modalId="modal-preview-detail-box"
      title={`Detalle de caja - ${dataModal?.cashRegisterCode}`}
      className="md:w-[900px]"
    >
      <DataTable table={table} />
      <div className="grid gap-3.5 text-center sm:grid-cols-3 sm:gap-8">
        <Input
          tabIndex={-1}
          readOnly
          label="Monto total"
          value={formatCurrency(
            table
              .getCoreRowModel()
              .rows.reduce((total, row) => total + row.original.totalAmount, 0),
          )}
        />
        <Input
          tabIndex={-1}
          readOnly
          label="Monto encontrado"
          value={formatCurrency(
            table
              .getCoreRowModel()
              .rows.reduce(
                (total, row) => total + (row.original.foundAmount ?? 0),
                0,
              ),
          )}
        />
        <Input
          tabIndex={-1}
          readOnly
          label="Diferencia"
          value={formatCurrency(
            table
              .getCoreRowModel()
              .rows.reduce(
                (total, row) =>
                  total +
                  (row.original.totalAmount - (row.original.foundAmount ?? 0)),
                0,
              ),
          )}
        />
      </div>
      <Modal.Footer>
        <Button
          onClick={() =>
            useModalStore.getState().closeModal("modal-preview-detail-box")
          }
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
