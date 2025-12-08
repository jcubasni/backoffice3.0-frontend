import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteDailyReportBox } from "../../hooks/useBoxesService"
import { useDetailBoxStore } from "../../store/detail-box.store"

export default function ModalDeleteDailyReportBox() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-daily-report-box",
  )?.prop
  const dailyReportId = useDetailBoxStore.getState().dailyReportId
  const deleteBox = useDeleteDailyReportBox()

  const handleDelete = () => {
    if (!dailyReportId) return
    deleteBox.mutate({
      dailyReportId,
      cashRegisterId: dataModal,
    })
  }

  return (
    <Modal
      modalId="modal-delete-daily-report-box"
      title="Quitar caja de parte diario"
      className="sm:w-sm"
    >
      <p className="mx-auto">Esta seguro que desea eliminar esta caja?</p>
      <Modal.Footer className="grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-daily-report-box")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
