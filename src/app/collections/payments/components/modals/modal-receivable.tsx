import Big from "big.js"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useModalStore } from "@/shared/store/modal.store"
import { useClientHelper } from "../../../documents/hooks/useClient.helper"
import {
  useApplyPayment,
  useGetUnpaidDocuments,
} from "../../hooks/usePaymentServive"
import { receivableColumns } from "../../lib/receivable-columns.tsx"
import { PaymentResponse } from "../../types/payment.type"

export default function ModalReceivable() {
  const applyPayment = useApplyPayment()
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-receivable"),
  )?.prop as PaymentResponse
  const { closeModal } = useModalStore()
  const [filters, setFilters] = useState({
    search: "",
    client: "",
  })
  const documents = useGetUnpaidDocuments(filters.client)

  const { clients, filterClients, handleSearch } = useClientHelper(
    filters.search,
  )

  const table = useDataTable({
    data: documents.data,
    columns: receivableColumns(dataModal.remainingAmount),
    isLoading: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableRowClickToggle: false,
  })

  const handleSave = () => {
    const selectedRows = table.getSelectedRowModel().rows
    let remainingPaymentAmount = new Big(dataModal.remainingAmount)

    // Ordenar los documentos seleccionados por fecha de emisión y vencimiento
    const sortedRows = [...selectedRows].sort((a, b) => {
      const dateA = new Date(a.original.periodStart).getTime()
      const dateB = new Date(b.original.periodStart).getTime()

      if (dateA !== dateB) {
        return dateA - dateB
      }

      // Si las fechas de inicio son iguales, ordenar por fecha de vencimiento
      const dueA = new Date(a.original.periodEnd).getTime()
      const dueB = new Date(b.original.periodEnd).getTime()
      return dueA - dueB
    })

    // Construir el objeto para la mutación con pagos parciales
    const items = sortedRows.map((row) => {
      const documentOutstanding = new Big(row.original.amount).minus(
        row.original.paidAmount,
      )

      // Si el monto restante del pago es mayor o igual al pendiente del documento,
      // pagar el documento completo. Sino, pagar solo lo que queda disponible
      const amountToPay = remainingPaymentAmount.gte(documentOutstanding)
        ? documentOutstanding
        : remainingPaymentAmount

      // Restar el monto asignado del monto restante
      remainingPaymentAmount = remainingPaymentAmount.minus(amountToPay)

      return {
        saleCreditId: row.original.id,
        amount: Number(amountToPay.toFixed(2)),
      }
    })

    const paymentData = {
      paymentId: dataModal.id,
      body: {
        items,
      },
    }

    console.log(
      "Objeto para applyPayment:",
      JSON.stringify(paymentData, null, 2),
    )
    applyPayment.mutate(paymentData)
  }

  const handleClose = () => {
    closeModal("modal-receivable")
    setFilters({ search: "", client: "" })
  }

  return (
    <Modal
      modalId="modal-receivable"
      title="Vincular pago a documento"
      className="w-2xl"
      scrollable={true}
    >
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Número de pago"
          defaultValue={dataModal.operationNumber ?? ""}
        />
        <Input label="Monto de pago" defaultValue={dataModal.amount} />
        <Input
          label="Monto restante"
          defaultValue={dataModal.remainingAmount}
        />
        <ComboSearch
          label="Cliente"
          placeholder="Buscar cliente..."
          options={clients}
          onSelect={(value) => {
            setFilters({ ...filters, client: value })
          }}
          onSearch={(value) => {
            handleSearch(value)
            setFilters({ ...filters, search: value })
          }}
          isLoading={filterClients.isLoading}
          search={filters.search}
          value={filters.client}
          classContainer="col-span-3"
        />
        <div className="col-span-full">
          <DataTable table={table} />
        </div>

        <Modal.Footer className="col-span-full grid-cols-2">
          <Button onClick={handleSave}>Guardar</Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </Modal.Footer>
      </div>
    </Modal>
  )
}
