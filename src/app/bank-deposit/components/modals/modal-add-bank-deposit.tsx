import CurrencyTracker from "@bank-deposit/components/currency/currency-tracker"
import { useAddDeposit } from "@bank-deposit/hooks/useBankDepositService"
import {
  AddBankDeposit,
  addBankDepositSchema,
} from "@bank-deposit/schemas/add-bank-deposit.schema"
import { CurrencyEntry } from "@bank-deposit/types/currency.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useGetBanksActive } from "@/app/configurations/bank/hooks/useBanksService"
import { useGetBankAccountsByBankId } from "@/app/configurations/bank-accounts/hooks/useBankAccountsService"
import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { DatePickerForm } from "@/shared/components/form/date-picker-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { formatDate } from "@/shared/lib/date"

export default function ModalAddBankDeposit() {
  const [showMoney, setShowMoney] = useState(false)
  const [moneyData, setMoneyData] = useState<CurrencyEntry[]>()
  const [initialCurrencyData, setInitialCurrencyData] =
    useState<CurrencyEntry[]>()
  const addBankDeposit = useAddDeposit()
  const previousCurrency = useRef<string | undefined>(undefined)

  const form = useForm<AddBankDeposit>({
    resolver: zodResolver(addBankDepositSchema),
  })
  const bank = useWatch({
    control: form.control,
    name: "bank",
  })
  const currency = useWatch({
    control: form.control,
    name: "currency",
  })
  const banks = useGetBanksActive()
  const bankAccounts = useGetBankAccountsByBankId(bank)

  const handleCurrencyChange = (data: CurrencyEntry[], total: number) => {
    setMoneyData(data)
    form.setValue("depositAmount", Number(total.toFixed(2)), {
      shouldValidate: true,
    })
  }

  const handleSave = (data: AddBankDeposit) => {
    addBankDeposit.mutate({
      depositDate: formatDate(data.depositDate),
      bank: String(data.bank),
      accountNumber: data.accountNumber,
      currency: data.currency,
      depositAmount: Number(data.depositAmount),
      money: moneyData,
      observation: data.observation,
    })
  }

  useEffect(() => {
    if (previousCurrency.current && previousCurrency.current !== currency) {
      setMoneyData([])
      setInitialCurrencyData([])
      form.setValue("depositAmount", 0, { shouldValidate: false })
      setShowMoney(false)
    }
    previousCurrency.current = currency
  }, [currency])

  return (
    <Modal
      modalId="modal-add-bank-deposit"
      title="Agregar depósito"
      className="sm:w-[400px]"
      scrollable={true}
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <DatePickerForm
          label="Fecha:"
          name="depositDate"
          className="w-full!"
          max={new Date()}
        />
        <ComboBoxForm
          name="bank"
          label="Banco:"
          className="w-full!"
          options={dataToCombo(banks.data, "id", "name")}
        />
        <ComboBoxForm
          label="Número de cuenta:"
          name="accountNumber"
          className="w-full!"
          disabled={!bank}
          options={dataToCombo(
            bankAccounts.data,
            "accountNumber",
            "accountNumber",
          )}
        />
        <div className="flex gap-2">
          <ComboBoxForm
            label="Moneda:"
            name="currency"
            options={[
              { label: "Sol", value: "PEN" },
              { label: "Dolar", value: "USD" },
            ]}
            className="min-w-24"
            defaultValue="PEN"
          />
          <InputForm
            label="Monto depositado:"
            name="depositAmount"
            type="number"
            classContainer="w-full"
            readOnly={showMoney}
          />
        </div>
        <Checkbox
          label="Representacion de moneda"
          name="represent"
          checked={showMoney}
          onCheckedChange={(e) => setShowMoney(e as boolean)}
          disabled={currency === "USD"}
        />
        {showMoney && (
          <CurrencyTracker
            onChange={handleCurrencyChange}
            initialData={initialCurrencyData}
          />
        )}
        <InputForm label="Observaciones:" name="observation" />
        <Input label="Cargar Imagen:" type="file" />
        <Modal.Footer>
          <Button variant="outline">Guardar</Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
