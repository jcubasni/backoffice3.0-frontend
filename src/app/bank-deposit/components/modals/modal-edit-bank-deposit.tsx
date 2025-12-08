import CurrencyTracker from "@bank-deposit/components/currency/currency-tracker"
import {
  useEditDeposit,
  useGetDeposit,
} from "@bank-deposit/hooks/useBankDepositService"
import { CurrencyEntry } from "@bank-deposit/types/currency.type"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalEditBankDeposit() {
  const [showMoney, setShowMoney] = useState(false)
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-edit-bank-deposit",
  )?.prop
  const bankDeposit = useGetDeposit(dataModal?.id ?? "")
  const [edit, setEdit] = useState(bankDeposit.data?.observation)
  const editBankDeposit = useEditDeposit()
  const moneyDetails = useMemo(() => {
    return (
      bankDeposit.data?.moneyDetails.map(
        (item) =>
          ({
            denomination: Number(
              item.denomination.toString().replace(".00", ""),
            ),
            quantity: item.quantity,
            total: item.total,
            type: item.type,
          }) as CurrencyEntry,
      ) ?? []
    )
  }, [bankDeposit.data?.moneyDetails])
  const handleEdit = () => {
    editBankDeposit.mutate({
      id: dataModal?.id ?? "",
      observation: edit ?? "",
    })
  }
  return (
    <Modal
      modalId="modal-edit-bank-deposit"
      title="Editar depósito"
      className="overflow-y-auto sm:w-[400px]"
      scrollable={true}
    >
      <Input
        label="Fecha:"
        defaultValue={bankDeposit.data?.depositDate ?? ""}
        className="w-full!"
        disabled
      />
      <Input
        label="Banco:"
        defaultValue={bankDeposit.data?.bank ?? ""}
        className="w-full!"
        disabled
      />
      <Input
        label="Número de cuenta:"
        disabled
        defaultValue={bankDeposit.data?.accountNumber ?? ""}
        className="w-full!"
      />
      <div className="flex gap-2">
        <ComboBox
          label="Moneda:"
          options={[
            { label: "Sol", value: "PEN" },
            { label: "Dolar", value: "USD" },
          ]}
          placeholder=" "
          className="min-w-24"
          disabled
          defaultValue={bankDeposit.data?.currency ?? ""}
        />
        <Input
          label="Monto depositado:"
          type="number"
          min={1}
          classContainer="w-full"
          disabled
          defaultValue={bankDeposit.data?.depositAmount.toString() ?? ""}
        />
      </div>
      <Checkbox
        label="Ver representacion de moneda"
        checked={showMoney}
        onCheckedChange={(e) => setShowMoney(e as boolean)}
        disabled={bankDeposit.data?.currency === "USD"}
      />
      {showMoney && (
        <CurrencyTracker initialData={moneyDetails} readonly={true} />
      )}
      <Input
        label="Observaciones:"
        value={edit ?? bankDeposit.data?.observation ?? ""}
        onChange={(e) => setEdit(e.target.value)}
      />
      <Input label="Cargar Imagen:" type="file" />
      <Button variant="outline" onClick={handleEdit}>
        Guardar
      </Button>
    </Modal>
  )
}
