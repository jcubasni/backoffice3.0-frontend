import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/shared/components/ui/date-picker"
import Modal from "@/shared/components/ui/modal"
import { formatDate } from "@/shared/lib/date"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalCreateDailyReport() {
  const [date, setDate] = useState<string | undefined>()
  const navigate = useNavigate()
  const handleAddDailyReport = () => {
    if (!date) return
    navigate({ to: Routes.GenerateDailyReport, search: { date } })
    useModalStore.getState().closeModal("modal-create-daily-report")
  }
  return (
    <Modal
      modalId="modal-create-daily-report"
      title="Ingresar fecha del parte diario"
      className="sm:w-[400px]"
    >
      <DatePicker
        label="Fecha del parte diario"
        className="w-full!"
        onSelect={(e) => setDate(formatDate(e))}
        max={new Date()}
      />
      <Modal.Footer>
        <Button
          variant="outline"
          disabled={!date}
          onClick={handleAddDailyReport}
        >
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
