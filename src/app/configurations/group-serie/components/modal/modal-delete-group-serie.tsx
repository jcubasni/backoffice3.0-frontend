import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteGroupSerie } from "../../hooks/useGroupSerieService"
import { GroupSerieResponse } from "../../types/group-serie.type"

export default function ModalDeleteGroupSerie() {
  const { idGroupSerie, local } = useModalStore(
    (state) => state.openModals,
  ).find((modal) => modal.id === "modal-delete-group-serie")
    ?.prop as GroupSerieResponse

  const deleteGroupSerie = useDeleteGroupSerie()

  const handleDelete = () => {
    deleteGroupSerie.mutate({ localId: local.idLocal, groupId: idGroupSerie })
  }

  return (
    <Modal
      modalId="modal-delete-group-serie"
      title="Eliminar Grupo Serie"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-2 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar este grupo serie?
      </p>

      <Modal.Footer className="grid-cols-2">
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deleteGroupSerie.isPending}
        >
          {deleteGroupSerie.isPending ? "Eliminando..." : "Eliminar"}
        </Button>
        <Button
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-group-serie")
          }
          disabled={deleteGroupSerie.isPending}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
