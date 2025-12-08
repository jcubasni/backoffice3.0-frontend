import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalViewCompanyStatus() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-view-company-status"),
  )?.prop

  if (!dataModal) return null

  return (
    <Modal
      modalId="modal-view-company-status"
      title={`Estado de empresa - ${dataModal.name}`}
      className="md:w-[700px]"
    >
      <div className="rounded-md border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted text-left font-semibold text-muted-foreground">
              <th className="px-4 py-2">Campo</th>
              <th className="px-4 py-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">ID</td>
              <td className="px-4 py-2">{dataModal.id}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Host</td>
              <td className="px-4 py-2">{dataModal.host}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">RUC</td>
              <td className="px-4 py-2">{dataModal.ruc}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Empresa</td>
              <td className="px-4 py-2">{dataModal.name}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Correo</td>
              <td className="px-4 py-2">{dataModal.email}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Baja</td>
              <td className="px-4 py-2">
                {dataModal.isInactive ? "Inactivo" : "Activo"}
              </td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Bloqueado</td>
              <td className="px-4 py-2">{dataModal.isBlocked ? "Sí" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal.Footer>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-view-company-status")
          }
          className="w-full"
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
