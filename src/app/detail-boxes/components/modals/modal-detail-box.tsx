import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { formatCurrency } from "@/shared/lib/number"
import { useModalStore } from "@/shared/store/modal.store"
import { useDetailBoxModalLogic } from "../../hooks/useDetailBox"
import { useGetTotalsDetailBox } from "../../hooks/useDetailBoxService"
import { DetailBoxes } from "../../types/detail-boxes.type"

export default function ModalDetailBox() {
  const { cashRegisterId, cashRegisterCode } = useModalStore(
    (state) => state.openModals,
  ).find((modal) => modal.id === "modal-detail-box")?.prop as DetailBoxes
  const totals = useGetTotalsDetailBox(cashRegisterId)
  const {
    preliquidated,
    closed,
    edit,
    table,
    totalDeposit,
    foundAmount,
    handlePreliquidated,
    handleSave,
    handleLiquidated,
    handleEditToggle,
  } = useDetailBoxModalLogic({ cashRegisterId })

  return (
    <Modal
      modalId="modal-detail-box"
      title={`Detalle de caja - ${cashRegisterCode}`}
      className="md:min-h-fit md:w-[900px]"
    >
      <HeaderContent>
        <HeaderContent.Left>
          <Input
            label="Total Ventas"
            value={formatCurrency(totals.data?.totalAmount ?? 0)}
            classContainer="w-60"
            readOnly
          />
          <Input
            label="Total Tarjetas"
            value={formatCurrency(totals.data?.totalCards ?? 0)}
            classContainer="w-60"
            readOnly
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button
            size="header"
            disabled={!preliquidated}
            onClick={handleEditToggle}
            className={cn(!preliquidated && "hidden")}
          >
            <Edit />
            {edit ? "Cancelar Edición" : "Editar"}
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <div className="grid gap-3 text-center sm:grid-cols-3 sm:gap-8">
        <Input
          readOnly
          tabIndex={-1}
          label="Total Depositado"
          value={formatCurrency(totalDeposit)}
        />
        <Input
          readOnly
          tabIndex={-1}
          label="Total Encontrado"
          value={formatCurrency(foundAmount)}
        />
        <Input
          readOnly
          tabIndex={-1}
          label="Diferencia Total"
          value={formatCurrency(foundAmount - totalDeposit)}
        />
      </div>
      <Modal.Footer className="sm:grid-cols-2">
        <Button
          disabled={!edit}
          onClick={closed ? handlePreliquidated : handleSave}
        >
          Guardar Cambios
        </Button>
        {preliquidated ? (
          <Button disabled={edit} onClick={handleLiquidated}>
            Liquidar
          </Button>
        ) : (
          <Button
            onClick={() =>
              useModalStore.getState().closeModal("modal-detail-box")
            }
          >
            Cerrar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}
