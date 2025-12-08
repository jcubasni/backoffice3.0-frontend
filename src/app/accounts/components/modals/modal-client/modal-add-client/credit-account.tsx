import { DatePickerForm } from "@/shared/components/form/date-picker-form";
import { InputForm } from "@/shared/components/form/input-form";

type CreditAccountProps = {
  index: number;
};

export function CreditAccount({ index }: CreditAccountProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <InputForm
        label="Linea de credito"
        name={`accounts.${index}.accountData.creditLine`}
        type="number"
      />
      <InputForm
        label="Saldo"
        name={`accounts.${index}.accountData.balance`}
        type="number"
      />
      <DatePickerForm
        label="Fecha de inicio"
        name={`accounts.${index}.accountData.startDate`}
        className="w-full!"
        min={new Date()}
      />
      <DatePickerForm
        label="Fecha de fin"
        name={`accounts.${index}.accountData.endDate`}
        className="w-full!"
      />
      <InputForm
        label="Dias de Facturacion"
        name={`accounts.${index}.accountData.billingDays`}
        type="number"
      />
      <InputForm
        label="Dias de Credito"
        name={`accounts.${index}.accountData.creditDays`}
        type="number"
      />
      <InputForm
        label="Cuotas"
        name={`accounts.${index}.accountData.installments`}
        type="number"
      />
      <InputForm label="Carga archivo" type="file" name="file" />
    </section>
  );
}
