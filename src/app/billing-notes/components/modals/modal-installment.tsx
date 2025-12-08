import Big from "big.js"
import { addDays, format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"
import { useGetAccountByClientId } from "@/app/accounts/hooks/useClientsService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { parseLocalDate } from "@/shared/lib/date"
import { formatCurrency } from "@/shared/lib/number"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetInstallments } from "../../hooks/useNotesService"
import { BillingNoteSchema } from "../../schemas/note.schema"
import { useSaleDocumentStore } from "../../store/note.store"

type InstallmentData = {
  dueDate: Date
  amount: number
  isPaid?: boolean
}

export default function ModalInstallment() {
  const form = useFormContext<BillingNoteSchema>()
  const { selectedSaleDocument, setInstallmentData } = useSaleDocumentStore(
    useShallow((state) => ({
      selectedSaleDocument: state.selectedSaleDocument,
      setInstallmentData: state.setInstallmentData,
    })),
  )
  const selectedClient = useWatch({
    control: form.control,
    name: "clientId",
  })

  const installments = useGetInstallments(selectedSaleDocument.id)
  const client = useGetAccountByClientId(selectedClient)

  // Debug: Mostrar cuotas existentes en consola
  useEffect(() => {
    if (installments.data) {
      console.log("=== CUOTAS EXISTENTES DEL DOCUMENTO ===")
      console.log("Total de cuotas:", installments.data.length)
      console.log("Cuotas detalladas:", installments.data)
      console.table(
        installments.data.map((inst, idx) => ({
          Cuota: idx + 1,
          Fecha: inst.dueDate,
          Monto: inst.amount,
          Pagado: inst.paidAmount,
          Pendiente: inst.amount - inst.paidAmount,
          Estado: inst.paid ? "Pagada" : "Pendiente",
        })),
      )
    }
  }, [installments.data])

  // Contar cuotas pagadas
  const installmentPaidCount = useMemo(() => {
    return (
      installments.data?.filter((installment) => installment.paid).length ?? 0
    )
  }, [installments.data])

  // Calcular total pendiente de cuotas existentes
  const totalPending = useMemo(() => {
    if (!installments.data) return 0

    return Number(
      installments.data.reduce((total, item) => {
        const amount = new Big(item.amount)
        const paidAmount = new Big(item.paidAmount)
        const pending = amount.minus(paidAmount)
        return total.plus(pending)
      }, new Big(0)),
    )
  }, [installments.data])

  // Estado local para número de cuotas nuevas
  const [newInstallmentsCount, setNewInstallmentsCount] = useState(
    installments.data?.length ?? 1,
  )

  // Estado para almacenar las cuotas calculadas con fechas editables
  const [editableInstallments, setEditableInstallments] = useState<
    InstallmentData[]
  >([])

  // Inicializar con el número de cuotas existentes cuando se carguen
  useEffect(() => {
    if (installments.data?.length) {
      setNewInstallmentsCount(installments.data.length)
    }
  }, [installments.data])

  // Calcular las nuevas cuotas basándose en las existentes
  const calculatedInstallmentData = useMemo((): InstallmentData[] => {
    if (
      !installments.data ||
      !client.data ||
      !totalPending ||
      newInstallmentsCount === 0
    )
      return []

    const { creditDays, endDate } = client.data
    if (!creditDays) return []

    const data: InstallmentData[] = []
    const existingCount = installments.data.length

    // Calcular monto base por cuota
    const totalPendingBig = new Big(totalPending)
    const installmentCountBig = new Big(newInstallmentsCount)
    const baseAmount = totalPendingBig.div(installmentCountBig)
    const baseAmountRounded = Number(baseAmount.toFixed(2))

    // Calcular la suma de todas las cuotas con el monto base
    const totalWithBaseAmount = new Big(baseAmountRounded).times(
      installmentCountBig,
    )
    const difference = totalPendingBig.minus(totalWithBaseAmount)

    for (let i = 1; i <= newInstallmentsCount; i++) {
      let dueDate: Date

      // Si existe una cuota en esa posición, usar su fecha como base
      if (i <= existingCount) {
        // Usar la fecha de la cuota existente (convertir string a Date)
        dueDate = parseLocalDate(installments.data[i - 1].dueDate) ?? new Date()
      } else {
        // Para cuotas nuevas, calcular desde la última cuota existente
        const lastExistingDate =
          parseLocalDate(installments.data[existingCount - 1].dueDate) ??
          new Date()
        const additionalInstallments = i - existingCount
        dueDate = addDays(lastExistingDate, creditDays * additionalInstallments)

        // Si hay endDate y la fecha calculada lo excede, limitarla
        if (endDate) {
          const endDateParsed = parseLocalDate(endDate) ?? new Date()
          if (dueDate > endDateParsed) {
            dueDate = endDateParsed
          }
        }
      }

      // Calcular monto: si es la última cuota, ajustar con la diferencia
      let amount = baseAmountRounded
      if (i === newInstallmentsCount) {
        amount = Number(new Big(baseAmountRounded).plus(difference).toFixed(2))
      }

      // Determinar si la cuota está pagada (solo para cuotas existentes)
      const isPaid = i <= existingCount ? installments.data[i - 1].paid : false

      data.push({ dueDate, amount, isPaid })
    }

    return data
  }, [client.data, totalPending, newInstallmentsCount, installments.data])

  // Sincronizar las cuotas calculadas con el estado editable
  useEffect(() => {
    if (calculatedInstallmentData.length > 0) {
      setEditableInstallments(calculatedInstallmentData)
    }
  }, [calculatedInstallmentData])

  // Calcular el total de las cuotas editables
  const totalNewInstallments = useMemo(() => {
    return editableInstallments.reduce((sum, item) => {
      return Number(new Big(sum).plus(item.amount).toFixed(2))
    }, 0)
  }, [editableInstallments])

  // Función para cambiar la fecha de una cuota específica
  const handleDateChange = (index: number, newDate: Date) => {
    setEditableInstallments((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, dueDate: newDate } : item,
      ),
    )
  }

  const handleCancel = () => {
    useModalStore.getState().closeModal("modal-installment")
  }

  const handleSave = () => {
    const existingCount = installments.data?.length ?? 0

    // Validar que el nuevo número de cuotas sea mayor o igual al existente
    if (newInstallmentsCount < existingCount) {
      console.error(
        `No se puede reducir el número de cuotas. Mínimo: ${existingCount}, Actual: ${newInstallmentsCount}`,
      )
      alert(
        `El número de cuotas no puede ser menor a ${existingCount}. Por favor, ingrese un número mayor o igual.`,
      )
      return
    }

    if (editableInstallments.length > 0) {
      console.log("=== DATOS QUE SE ENVIARÁN ===")
      console.log("Cuotas editables:", editableInstallments)
      console.log(
        "Fechas formateadas:",
        editableInstallments.map((inst) => ({
          fecha: format(inst.dueDate, "yyyy-MM-dd"),
          fechaOriginal: inst.dueDate,
        })),
      )

      const dataToSave = {
        startDate: new Date(),
        endDate: editableInstallments[editableInstallments.length - 1].dueDate,
        newInstallmentsCount,
        totalPending,
        installments: editableInstallments.map((inst) => ({
          newAmount: inst.amount,
          newDueDate: format(inst.dueDate, "yyyy-MM-dd"),
        })),
      }

      console.log("Data a guardar:", dataToSave)

      setInstallmentData(dataToSave)
    }

    useModalStore.getState().closeModal("modal-installment")
    form.handleSubmit(() => {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
      const formElement = document.querySelector("form")
      if (formElement) {
        formElement.dispatchEvent(submitEvent)
      }
    })()
  }

  const existingInstallmentsCount = installments.data?.length ?? 0

  return (
    <Modal
      modalId="modal-installment"
      title="Términos de pago"
      className="sm:w-[600px]"
      scrollable={true}
      onClose={handleCancel}
    >
      <div className="space-y-4">
        {/* Badges de información */}
        <div className="flex gap-3">
          <Badge variant="outline" className="font-semibold text-base">
            N° cuotas: {existingInstallmentsCount}
          </Badge>
          <Badge variant="outline" className="font-semibold text-base">
            Cuotas pagadas: {installmentPaidCount}
          </Badge>
          <Badge variant="outline" className="font-semibold text-base">
            Total pendiente: {formatCurrency(totalPending)}
          </Badge>
        </div>

        {/* Input de número de cuotas */}
        <Input
          label="Número de cuotas"
          type="number"
          min={existingInstallmentsCount}
          value={newInstallmentsCount}
          onChange={(e) => setNewInstallmentsCount(Number(e.target.value))}
        />

        {/* Información de crédito */}
        {client.data?.creditDays && (
          <div className="rounded-md border p-3">
            <Label className="font-semibold text-sm">
              Información de crédito
            </Label>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Días de crédito:</span>{" "}
                {client.data.creditDays} días
              </p>
              <p>
                <span className="text-muted-foreground">
                  Fecha límite de contrato:
                </span>{" "}
                {client.data.endDate
                  ? format(new Date(client.data.endDate), "dd/MM/yyyy")
                  : "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Total pendiente:</span>{" "}
                S/ {totalPending.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Detalle de cuotas */}
        {editableInstallments.length > 0 && (
          <div className="rounded-md border p-3">
            <Label className="font-semibold text-sm">Detalle de cuotas</Label>
            <div className="mt-2 max-h-60 space-y-2 overflow-y-auto">
              {editableInstallments.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "grid grid-cols-3 items-center gap-3 rounded-md p-2 text-sm",
                    item.isPaid ? "bg-green-500/10" : "bg-muted/50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Cuota {index + 1}:</span>
                    {item.isPaid && (
                      <Badge variant="green" className="text-xs">
                        Pagada
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {item.isPaid ? (
                      <span className="text-muted-foreground text-xs">
                        {format(item.dueDate, "dd/MM/yyyy")}
                      </span>
                    ) : (
                      <DatePicker
                        defaultValue={format(item.dueDate, "yyyy-MM-dd")}
                        onSelect={(date) => handleDateChange(index, date)}
                        className="h-8 text-xs"
                      />
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">
                      S/ {item.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-2 font-semibold text-sm">
              <span>Total:</span>
              <span>S/ {totalNewInstallments.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <Modal.Footer className="grid-cols-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
