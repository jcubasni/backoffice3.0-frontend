"use client"

import { useFormContext } from "react-hook-form"

import { CreditAccountForm } from "@/app/accounts/components/accounts/credit-account-form"
import type { CreditAccountFormValue } from "@/app/accounts/components/accounts/credit-account-form"
import type { CreateClientSchema } from "@/app/accounts/schemas/create-client.schema"

// -------------------------
// helpers (Date <-> string)
// -------------------------
const toDateInput = (date?: Date | null) => {
  if (!date) return ""
  // YYYY-MM-DD
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const fromDateInput = (value?: string) => {
  if (!value) return undefined
  // value: YYYY-MM-DD -> Date (local)
  const [y, m, d] = value.split("-").map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

type CreditAccountProps = {
  index: number
}

export function CreditAccount({ index }: CreditAccountProps) {
  const { watch, setValue } = useFormContext<CreateClientSchema>()

  const accountData = watch(`accounts.${index}.accountData`)

  // RHF(schema) -> UI(value)
  const uiValue: CreditAccountFormValue = {
    creditLine: accountData?.creditLine ?? undefined,
    balance: accountData?.balance ?? undefined,
    billingDays: accountData?.billingDays ?? undefined,
    creditDays: accountData?.creditDays ?? undefined,
    installments: accountData?.installments ?? undefined,
    startDate: toDateInput(accountData?.startDate),
    endDate: toDateInput(accountData?.endDate),
  }

  const handleChange = (newValue: CreditAccountFormValue) => {
    // UI(value) -> RHF(schema)
    setValue(
      `accounts.${index}.accountData`,
      {
        // en tu schema son number obligatorios, así que damos fallback
        creditLine: newValue.creditLine ?? 0,
        balance: newValue.balance ?? 0,
        billingDays: newValue.billingDays ?? 0,
        creditDays: newValue.creditDays ?? 0,
        installments: newValue.installments ?? 0,
        // en tu schema son Date, así que convertimos
        startDate: fromDateInput(newValue.startDate) ?? new Date(),
        endDate: fromDateInput(newValue.endDate) ?? new Date(),
      },
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    )
  }

  return <CreditAccountForm value={uiValue} onChange={handleChange} showBalance />
}
