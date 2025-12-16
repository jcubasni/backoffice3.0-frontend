"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type CreditAccountFormValue = {
  creditLine?: number
  balance?: number
  billingDays?: number
  creditDays?: number
  installments?: number
  startDate?: string
  endDate?: string
}

type CreditAccountFormProps = {
  value: CreditAccountFormValue
  onChange: (value: CreditAccountFormValue) => void

  /** Mostrar/ocultar saldo */
  showBalance?: boolean

  /** Para edición: no permitir editar saldo */
  balanceReadOnly?: boolean

  /** Bloquear inputs (ej: mientras guarda) */
  disabled?: boolean
}

export function CreditAccountForm({
  value,
  onChange,
  showBalance = true,
  balanceReadOnly = false,
  disabled = false,
}: CreditAccountFormProps) {
  const update =
    (field: keyof CreditAccountFormValue) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      const parsed =
        e.target.type === "number"
          ? raw === ""
            ? undefined
            : Number(raw)
          : raw

      onChange({
        ...value,
        [field]: parsed,
      })
    }

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <Label>Línea de crédito</Label>
        <Input
          type="number"
          value={value.creditLine ?? ""}
          onChange={update("creditLine")}
          disabled={disabled}
        />
      </div>

      {showBalance && (
        <div className="space-y-1">
          <Label>Saldo</Label>
          <Input
            type="number"
            value={value.balance ?? ""}
            onChange={balanceReadOnly ? undefined : update("balance")}
            readOnly={balanceReadOnly}
            disabled={disabled || balanceReadOnly}
          />
        </div>
      )}

      <div className="space-y-1">
        <Label>Fecha de inicio</Label>
        <Input
          type="date"
          value={value.startDate ?? ""}
          onChange={update("startDate")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-1">
        <Label>Fecha de fin</Label>
        <Input
          type="date"
          value={value.endDate ?? ""}
          onChange={update("endDate")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-1">
        <Label>Días de facturación</Label>
        <Input
          type="number"
          value={value.billingDays ?? ""}
          onChange={update("billingDays")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-1">
        <Label>Días de crédito</Label>
        <Input
          type="number"
          value={value.creditDays ?? ""}
          onChange={update("creditDays")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-1">
        <Label>Cuotas</Label>
        <Input
          type="number"
          value={value.installments ?? ""}
          onChange={update("installments")}
          disabled={disabled}
        />
      </div>
    </section>
  )
}
