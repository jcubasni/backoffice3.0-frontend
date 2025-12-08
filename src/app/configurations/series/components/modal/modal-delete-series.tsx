import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteSeries } from "../../hooks/useSeriesService"

export default function ModalDeleteSeries() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-series",
  )?.prop as string // asumimos que se pasa el id como string

  const deleteSeries = useDeleteSeries()

  const handleDelete = () => {
    deleteSeries.mutate(dataModal)
  }

  return (
    <Modal
      modalId="modal-delete-series"
      title="Eliminar Serie"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 pt-2 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar esta serie?
      </p>

      <Modal.Footer className="mt-4 grid grid-cols-2 gap-2 px-6 pb-6">
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deleteSeries.isPending}
        >
          {deleteSeries.isPending ? "Eliminando..." : "Eliminar"}
        </Button>
        <Button
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-series")
          }
          disabled={deleteSeries.isPending}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
