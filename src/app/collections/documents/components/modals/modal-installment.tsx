import { useGetInstallments } from "@/app/billing-notes/hooks/useNotesService"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useModalStore } from "@/shared/store/modal.store"
import { installmentColumns } from "../../lib/installment.columns"
import { DocumentResponse } from "../../types/document.type"

export default function ModalInstallment() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-installment",
  )?.prop as DocumentResponse

  const installments = useGetInstallments(dataModal.saleId)
  const table = useDataTable({
    data: installments.data,
    columns: installmentColumns,
    isLoading: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableRowClickToggle: false,
  })
  return (
    <Modal
      modalId="modal-installment"
      title="Vincular pago a documentos"
      className="sm:w-3xl"
      scrollable={true}
    >
      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          label="Nº de comprobante"
          orientation="horizontal"
          disabled
          value={dataModal.documentNumber}
        />
        <Input
          label="Monto"
          orientation="horizontal"
          disabled
          value={dataModal.amount}
        />
      </div>
      <div className="flex justify-between">
        <h2 className="my-2 font-bold">Número de cuotas pendientes:</h2>
        <Button
          disabled={!table.getSelectedRowModel().rows.length}
          onClick={() => {
            useModalStore.getState().openModal("modal-payment", {
              data: table.getSelectedRowModel().rows.map((row) => row.original),
              saleCreditId: dataModal.id,
            })
          }}
        >
          Pagar
        </Button>
      </div>
      <DataTable table={table} />
      <Modal.Footer className="grid-cols-2">
        <Button
          type="button"
          onClick={() =>
            useModalStore.getState().closeModal("modal-installment")
          }
        >
          Cancelar
        </Button>
        <Button type="button">Guardar</Button>
      </Modal.Footer>
    </Modal>
  )
}
