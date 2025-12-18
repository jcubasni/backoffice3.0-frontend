// src/app/accounts/lib/accounts.helpers.ts
import type { CreditAccountFormValue } from "@/app/accounts/components/accounts/credit-account-form"

export const ACCOUNTS_TOAST_ID = "accounts-only"

export function isCreditDraftValid(draft: CreditAccountFormValue) {
  const creditLine = draft.creditLine ?? 0
  const billingDays = draft.billingDays ?? 0
  const creditDays = draft.creditDays ?? 0
  const installments = draft.installments ?? 0

  const startDateOk = !!draft.startDate?.trim()
  const endDateOk = !!draft.endDate?.trim()

  return (
    creditLine >= 1 &&
    billingDays >= 1 &&
    creditDays >= 1 &&
    installments >= 1 &&
    startDateOk &&
    endDateOk
  )
}

export function prettyBackendMessage(msg?: string) {
  const m = (msg ?? "").trim()

  if (m.includes("billingDays") && m.includes("less than 1")) {
    return "Días de facturación debe ser mayor o igual a 1."
  }
  if (m.includes("creditDays") && m.includes("less than 1")) {
    return "Días de crédito debe ser mayor o igual a 1."
  }
  if (m.includes("installments") && m.includes("less than 1")) {
    return "Cuotas debe ser mayor o igual a 1."
  }
  if (m.includes("creditLine") && m.includes("less than 1")) {
    return "Línea de crédito debe ser mayor o igual a 1."
  }

  return m.length ? m : "No se pudieron crear las cuentas"
}
