import { useDeleteReportFromDeposit } from "@bank-deposit/hooks/useDailyReportService"
import { DeleteReportFromDeposit } from "@bank-deposit/types/daily-report.type"
import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalDeleteDailyReport() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-daily-report",
  )?.prop as DeleteReportFromDeposit
  const deleteReport = useDeleteReportFromDeposit()

  const handleDelete = () => {
    deleteReport.mutate(dataModal)
  }

  return (
    <Modal
      modalId="modal-delete-daily-report"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        ¿Esta seguro que desea eliminar el parte diario de este depósito?
      </p>
      <Modal.Footer className="grid grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-daily-report")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
