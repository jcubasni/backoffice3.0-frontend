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
import { useGetBanks } from "../../../bank/hooks/useBanksService"
import { useEditBankAccount } from "../../hooks/useBankAccountsService"
import {
  AddBankAccount,
  addBankAccountSchema,
} from "../../schemas/bank-account.schema"
import { BankAccount } from "../../types/bank-accounts.type"

export default function ModalEditBankAccount() {
  const { id, accountNumber, bank, currency, description } = useModalStore(
    (state) =>
      state.openModals.find((modal) => modal.id === "modal-edit-bank-account"),
  )?.prop as BankAccount

  const editBankAccount = useEditBankAccount()
  const { data: banks = [] } = useGetBanks()
  const { data: currencies = [] } = useGetCurrencies()

  const form = useForm<AddBankAccount>({
    resolver: zodResolver(addBankAccountSchema),
    defaultValues: {
      accountNumber: accountNumber ?? "",
      bankId: Number(bank.id) ?? 0,
      currencyId: String(currency.idCurrency) ?? "",
      description: description,
    },
  })

  const handleSave = async (data: AddBankAccount) => {
    editBankAccount.mutate({ id: id, body: data })
  }

  return (
    <Modal
      modalId="modal-edit-bank-account"
      title="Editar Cuenta Bancaria"
      className="sm:w-[400px]"
      scrollable={true}
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <ComboBoxForm
          className="w-full!"
          label="Banco:"
          name="bankId"
          options={dataToCombo(banks, "id", "name")}
          defaultValue={String(bank.id)}
        />
        <InputForm label="Nº Cuenta Bancaria:" name="accountNumber" />
        <InputForm label="Descripción" name="description" id="description" />
        <ComboBoxForm
          className="w-full!"
          label="Moneda:"
          name="currencyId"
          options={dataToCombo(currencies, "idCurrency", "simpleDescription")}
          defaultValue={String(currency.idCurrency)}
        />

        <Modal.Footer>
          <ButtonForm text="Guardar" isPending={editBankAccount.isPending} />
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
