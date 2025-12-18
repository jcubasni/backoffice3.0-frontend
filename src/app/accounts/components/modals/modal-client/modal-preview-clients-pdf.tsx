"use client"

import { PDFViewer } from "@react-pdf/renderer"
import ClientsPdfDocument from "@/app/pdf/components/clients/clients-pdf-document"
import { useModalStore } from "@/shared/store/modal.store"
import Modal from "@/shared/components/ui/modal"

const MODAL_ID = "modal-preview-clients-pdf"

export default function ModalPreviewClientsPdf() {
  const modal = useModalStore((state) =>
    state.openModals.find((m) => m.id === MODAL_ID)
  )

  const clients = (modal?.prop as { clients: any[] } | undefined)?.clients

  if (!modal || !clients) return null

  return (
    <Modal modalId={MODAL_ID} title="Vista previa – Reporte de Clientes">
      <PDFViewer className="w-full h-[85vh]">
        <ClientsPdfDocument clients={clients} />
      </PDFViewer>
    </Modal>
  )
}
