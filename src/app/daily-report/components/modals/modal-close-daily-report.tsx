import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useCloseDailyReport } from "../../hooks/useDailyReportsService"
import { DailyReport } from "../../types/daily-report.type"

export default function ModalCloseDailyReport() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-close-daily-report",
  )?.prop as DailyReport

  const closeDailyReport = useCloseDailyReport()

  const handleClose = () => {
    closeDailyReport.mutate(dataModal.id)
  }

  return (
    <Modal modalId="modal-close-daily-report" className="w-lg">
      {dataModal?.allLiquidated ? (
        <>
          <p className="px-10 text-center font-semibold text-lg">
            ¿Esta seguro que desea cerrar el parte diario del periodo
            seleccionado?
          </p>
          <Modal.Footer className="grid grid-cols-2">
            <Button variant="outline" onClick={handleClose}>
              Aceptar
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                useModalStore.getState().closeModal("modal-close-daily-report")
              }
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <p className="px-10 text-center font-semibold text-lg">
            Aun existen cajas por Liquidar, termine el proceso de liquidación{" "}
          </p>
          <Modal.Footer className="grid grid-cols-1">
            <Button
              variant="outline"
              className="mx-auto w-full"
              onClick={() =>
                useModalStore.getState().closeModal("modal-close-daily-report")
              }
            >
              Aceptar
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  )
}
