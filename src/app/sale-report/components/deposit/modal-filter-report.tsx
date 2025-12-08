"use client"

import { useState } from "react"
import { useWorkShifts } from "@/app/sale-report/hooks/useSaleFilterReport"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { useModalStore } from "@/shared/store/modal.store"
import { getDepositReport } from "../../service/sale-report.service"
import { ByDeposit } from "../../types/sale-report.type"
import { usePanelStore } from "@/shared/store/panel.store"

export default function DepositReportModal() {
  const { openModals, closeModal } = useModalStore((state) => state)

  // Tomamos los props del modal
  const modalData = openModals.find(m => m.id === "modal-deposit-report")?.prop
  const cashRegisters = modalData?.cashRegisters as
    | { cashRegisterId: string; cashRegisterCode: string }[]
    | undefined

  const [selectedShiftId, setSelectedShiftId] = useState<string>("")
  const [fecha, setFecha] = useState<string>("")

  const { data: workShifts, isLoading, error } = useWorkShifts()

  const handleApply = async () => {
    // ids será undefined si no hay selección, para indicar "todas las cajas"
    const ids = cashRegisters && cashRegisters.length > 0
      ? cashRegisters.map(c => c.cashRegisterId)
      : undefined

    const result: ByDeposit[] = await getDepositReport(
      ids as any, // aquí tu endpoint acepta string | undefined, no string[]
      selectedShiftId,
      fecha
    )

    // Abrimos panel global con los datos
    usePanelStore.getState().openPanel("deposit-report-detail", {
      data: result,
      date: fecha,
      cashRegisterIds: ids,
      shiftId: selectedShiftId,
    })

    // Cerramos modal
    setTimeout(() => closeModal("modal-deposit-report"), 100)
  }

  // Abrimos modal si está en el store
  const isOpen = openModals.some(m => m.id === "modal-deposit-report")
  if (!isOpen) return null

  // Título dinámico según selección
  const modalTitle =
    cashRegisters?.length === 1
      ? `Reporte de Depósito - Caja #${cashRegisters[0].cashRegisterCode}`
      : cashRegisters?.length && cashRegisters.length > 1
      ? `Reporte de Depósito - ${cashRegisters.length} Cajas seleccionadas`
      : `Reporte de Depósito - Todas las Cajas`

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && closeModal("modal-deposit-report")}
    >
      <DialogContent className="max-w-md rounded-xl bg-white">
        <DialogHeader>
          <DialogTitle className="mb-5 text-center">{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          <DatePicker
            label="Fecha"
            onSelect={(d) => setFecha(d.toISOString().split("T")[0])}
            max={new Date()}
            className="mb-5 w-full!"
          />
          <ComboBox
            label="Turno"
            className="w-full!"
            placeholder="Seleccionar turno"
            options={(workShifts ?? []).map((turno) => ({
              value: turno.id_work_shift.toString(),
              label: turno.shift_name,
            }))}
            isLoading={isLoading}
            value={selectedShiftId}
            onSelect={(val) => setSelectedShiftId(val)}
          />
          <p className="text-center text-gray-400 text-xs">
            Si no selecciona, lista todos los turnos
          </p>
          {error && (
            <p className="mt-1 text-red-500 text-sm">
              Error al cargar los turnos
            </p>
          )}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleApply}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
