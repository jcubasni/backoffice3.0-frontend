import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteUser } from "../../hooks/useUsersService"

export default function ModalDeleteUser() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-user",
  )?.prop as string

  const deleteUser = useDeleteUser()

  const handleDelete = () => {
    deleteUser.mutate(dataModal)
  }

  return (
    <Modal
      modalId="modal-delete-user"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar este usuario?
      </p>
      <Modal.Footer className="grid grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-user")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
