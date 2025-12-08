import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useGetCurrencies } from "@/app/configurations/currencies/hooks/useCurrenciesService"
import { ButtonForm } from "@/shared/components/form/button-form"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetBanksActive } from "../../../bank/hooks/useBanksService"
import { useAddBankAccount } from "../../hooks/useBankAccountsService"
import {
  AddBankAccount,
  addBankAccountSchema,
} from "../../schemas/bank-account.schema"

export default function ModalAddBankAccount() {
  useModalStore()
  const addBankAccount = useAddBankAccount()
  const { data: banks = [] } = useGetBanksActive()
  const { data: currencies = [], isLoading: isLoadingCurrencies } =
    useGetCurrencies()

  const form = useForm<AddBankAccount>({
    resolver: zodResolver(addBankAccountSchema),
  })

  const handleSave = async (data: AddBankAccount) => {
    addBankAccount.mutate({ ...data, holderName: "-" })
  }

  return (
    <Modal
      modalId="modal-add-bank-account"
      title="Agregar Cuenta Bancaria"
      className="sm:w-[400px]"
      scrollable
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <ComboBoxForm
          className="w-full!"
          label="Banco"
          name="bankId"
          options={dataToCombo(banks, "id", "name")}
        />
        <InputForm
          label="Nº Cuenta Bancaria"
          name="accountNumber"
          id="accountNumber"
          onChange={(e) => {
            const value = e.target.value
            form.setValue("accountNumber", value, { shouldValidate: true })
            form.setValue("description", value, { shouldValidate: true })
          }}
        />
        <InputForm label="Descripción" name="description" id="description" />
        <ComboBoxForm
          className="w-full!"
          label="Moneda"
          name="currencyId"
          options={dataToCombo(currencies, "idCurrency", "simpleDescription")}
          defaultValue={String(currencies[0]?.idCurrency)}
          disabled={addBankAccount.isPending || isLoadingCurrencies}
        />
        <Modal.Footer>
          <ButtonForm text="Guardar" isPending={addBankAccount.isPending} />
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
