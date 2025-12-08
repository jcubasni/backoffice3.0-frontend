import { zodResolver } from "@hookform/resolvers/zod"
import { useSearch } from "@tanstack/react-router"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { useAddPayment } from "@/app/collections/payments/hooks/usePaymentServive"
import { useGetBanksActive } from "@/app/configurations/bank/hooks/useBanksService"
import { useGetBankAccountsByBankId } from "@/app/configurations/bank-accounts/hooks/useBankAccountsService"
import { useGetCurrencies } from "@/app/configurations/currencies/hooks/useCurrenciesService"
import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { DatePickerForm } from "@/shared/components/form/date-picker-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { formatCurrency } from "@/shared/lib/number"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"
import { useApplyPayment } from "../../hooks/useDocumentsService"
import { PaymentSchema, paymentSchema } from "../../schemas/document.schema"
import { ApplyPaymentDTO, DocumentData } from "../../types/document.type"

export default function ModalPayment() {
  const addPayment = useAddPayment()
  const applyPayment = useApplyPayment()
  const { client: clientId } = useSearch({
    from: `/(sidebar)${Routes.ForDocuments}`,
  })
  const { data: dataModal, saleCreditId } = useModalStore(
    (state) => state.openModals,
  ).find((modal) => modal.id === "modal-payment")?.prop as DocumentData
  console.log("dataModal", dataModal)
  console.log("saleCreditId", saleCreditId)

  const form = useForm<PaymentSchema>({
    mode: "onChange",
    resolver: zodResolver(paymentSchema),
  })

  const currencies = useGetCurrencies()
  const banks = useGetBanksActive()
  const bankAccounts = useGetBankAccountsByBankId(Number(form.watch("bank")))

  const totalAmount =
    dataModal?.reduce((sum, payment) => {
      const amount = Number(payment.amount - payment.paidAmount) || 0
      return sum + amount
    }, 0) || 0

  const handleSave = (values: PaymentSchema) => {
    const bankName =
      banks.data?.find((bank) => bank.id.toString() === values.bank)?.name || ""

    const payload = {
      ...values,
      bank: bankName,
      clientId,
    }

    console.log("payload", payload)
    // Aquí iría la mutación para guardar el pago
    addPayment.mutate(payload, {
      onSuccess: (data) => {
        console.log("data", data.id)

        let remainingAmount = Number(values.amount)
        const items = dataModal
          .map((installment) => {
            const pendingAmount = Number(
              installment.amount - installment.paidAmount,
            )
            const amountToPay = Math.min(remainingAmount, pendingAmount)
            remainingAmount -= amountToPay

            return {
              saleCreditId,
              installmentId: installment.id,
              amount: amountToPay,
            }
          })
          .filter((item) => item.amount > 0)

        const installments: ApplyPaymentDTO = {
          items,
        }

        applyPayment.mutate(
          {
            paymentId: data.id,
            data: installments,
          },
          {
            onSuccess: () => {
              useModalStore.getState().closeModal("modal-payment")
              useModalStore.getState().closeModal("modal-installment")
            },
          },
        )
      },
    })
  }

  return (
    <Modal
      modalId="modal-payment"
      title="Pagas cuota"
      className="sm:w-3xl"
      scrollable={true}
    >
      <FormWrapper
        form={form}
        onSubmit={handleSave}
        className="grid grid-cols-2 gap-4"
      >
        <Input
          label="Monto a pagar"
          value={formatCurrency(totalAmount)}
          disabled
        />
        <DatePickerForm
          name="paymentDate"
          label="Fecha de pago"
          className="w-full!"
          onSelect={(e) =>
            form.setValue("paymentDate", format(e, "yyyy-MM-dd"))
          }
        />
        {/* <ComboSearch
          label="Cliente"
          options={clients}
          classContainer="col-span-full"
        /> */}
        <ComboBoxForm
          name="currencyId"
          label="Moneda"
          className="w-full!"
          options={dataToCombo(
            currencies.data,
            "idCurrency",
            "simpleDescription",
          )}
        />
        <InputForm label="Monto" name="amount" />
        <ComboBoxForm
          name="bank"
          label="Banco"
          options={dataToCombo(banks.data, "id", "name")}
          className="w-full!"
        />
        <ComboBoxForm
          name="account"
          label="Cuenta"
          options={dataToCombo(
            bankAccounts.data,
            "accountNumber",
            "accountNumber",
          )}
          className="w-full!"
        />
        <InputForm name="operationNumber" label="Nº operacion" />
        <Input label="Cargar Archivo" type="file" />
        <Modal.Footer className="col-span-full grid-cols-2">
          <Button
            type="button"
            onClick={() =>
              useModalStore.getState().closeModal("modal-installment")
            }
          >
            Cancelar
          </Button>
          <Button>Guardar</Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
