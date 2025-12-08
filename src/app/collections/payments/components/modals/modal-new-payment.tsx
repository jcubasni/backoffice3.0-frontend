import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useSearchClientBySaleDocument } from "@/app/accounts/hooks/useClientsService"
import { useGetBanksActive } from "@/app/configurations/bank/hooks/useBanksService"
import { useGetBankAccountsByBankId } from "@/app/configurations/bank-accounts/hooks/useBankAccountsService"
import { useGetCurrencies } from "@/app/configurations/currencies/hooks/useCurrenciesService"
import { PaymentType, SaleDocumentType } from "@/app/sales/types/sale"
import { Button } from "@/components/ui/button"
import { ButtonForm } from "@/shared/components/form/button-form"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { DatePickerForm } from "@/shared/components/form/date-picker-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"
import { useAddPayment } from "../../hooks/usePaymentServive"
import { PaymentSchema, paymentSchema } from "../../schemas/payment.schema"

export default function ModalNewPayment() {
  const [clientSearchTerm, setClientSearchTerm] = useDebounce("", 500)
  const { closeModal } = useModalStore()

  const form = useForm<PaymentSchema>({
    mode: "onChange",
    resolver: zodResolver(paymentSchema),
  })
  const currencies = useGetCurrencies()
  const banks = useGetBanksActive()
  const bankAccounts = useGetBankAccountsByBankId(Number(form.watch("bank")))
  const filterClients = useSearchClientBySaleDocument({
    saleDocumentTypeId: SaleDocumentType.NOTA_VENTA,
    searchTerm: clientSearchTerm,
    paymentTypeId: PaymentType.CREDIT,
  })
  const addPayment = useAddPayment()

  const clients = useMemo(
    () =>
      filterClients.data?.map((client) => ({
        label: `${client.documentNumber} - ${client.firstName} ${client.lastName ?? ""}`,
        value: client.id,
      })) ?? [],
    [filterClients.data],
  )

  const handleSave = (values: PaymentSchema) => {
    const bankName =
      banks.data?.find((bank) => bank.id === values.bank.toString())?.name || ""

    const payload = {
      ...values,
      bank: bankName,
    }

    addPayment.mutate(payload)
  }

  return (
    <Modal
      modalId="modal-new-payment"
      title="Agregar nuevo pago"
      className="md:w-xl!"
    >
      <FormWrapper
        form={form}
        onSubmit={handleSave}
        className="grid grid-cols-2 gap-4"
      >
        <DatePickerForm
          name="paymentDate"
          label="Fecha de pago"
          className="w-full!"
          onSelect={(e) =>
            form.setValue("paymentDate", format(e, "yyyy-MM-dd"))
          }
          max={new Date()}
        />
        <ComboBoxForm
          name="currencyId"
          label="Moneda"
          className="w-full!"
          options={dataToCombo(
            currencies.data,
            "idCurrency",
            "simpleDescription",
          )}
          defaultValue={currencies.data?.[0].idCurrency}
        />
        <ComboBoxForm
          name="bank"
          label="Banco"
          className="w-full!"
          options={dataToCombo(banks.data, "id", "name")}
        />
        <InputForm name="amount" label="Monto" />
        <ComboSearch
          label="Cliente"
          classContainer="col-span-full"
          onSearch={setClientSearchTerm}
          options={clients}
          onSelect={(e) => form.setValue("clientId", e)}
        />
        <ComboBoxForm
          name="account"
          label="Cuenta"
          className="w-full!"
          options={dataToCombo(
            bankAccounts.data,
            "accountNumber",
            "accountNumber",
          )}
        />
        <InputForm name="operationNumber" label="Número de Operación" />
        <Input
          type="file"
          name="file"
          label="Cargar archivo"
          classContainer="col-span-full"
        />
        <Modal.Footer className="col-span-full grid-cols-2">
          <ButtonForm text="Guardar" isPending={false} />
          <Button type="button" onClick={() => closeModal("modal-add-side")}>
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
