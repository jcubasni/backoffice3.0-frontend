import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useLoadStore } from "@/shared/store/load.store"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteBankAccount } from "../../hooks/useBankAccountsService"

export default function ModalDeleteBankAccount() {
  const account = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-delete-bank-account"),
  )?.prop as { id: string; accountNumber: string } | undefined

  const deleteBankAccount = useDeleteBankAccount()

  const handleDelete = () => {
    if (!account?.id) {
      toast.error("ID de la cuenta bancaria no encontrado")
      return
    }

    useLoadStore.getState().setLoading(true)
    deleteBankAccount.mutate(account.id, {
      onSuccess: () => {
        useModalStore.getState().closeModal("modal-delete-bank-account")
        useLoadStore.getState().setLoading(false)
      },
    })
  }

  return (
    <Modal
      modalId="modal-delete-bank-account"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="mx-auto mt-4 text-center font-medium text-gray-600">
        Nº Cuenta: <span className="font-bold">{account?.accountNumber}</span>
      </p>

      <p className="px-10 py-4 text-center font-semibold text-lg">
        ¿Estás seguro que deseas eliminar esta cuenta bancaria?
      </p>

      <Modal.Footer className="grid grid-cols-2 gap-2 px-6 pb-6">
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deleteBankAccount.isPending}
        >
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-bank-account")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
