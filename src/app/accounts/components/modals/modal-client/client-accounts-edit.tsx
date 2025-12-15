"use client"

import { useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/shared/lib/number"
import { formatDate } from "@/shared/lib/date"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

import {
  useGetAccountByClientId,
  useUpdateAccount,
} from "@accounts/hooks/useClientsService"
import type {
  AccountResponse,
  AccountUpdateDTO,
} from "@accounts/types/client.type"
import {
  AccountTypeForClient,
} from "@accounts/types/client.type"
import { AccountTypeStyles } from "@accounts/types/client.enum"

// 👇 NUEVOS IMPORTS
import { Modals } from "@accounts/types/modals-name"
import { useModalStore } from "@/shared/store/modal.store"

type ClientAccountsEditProps = {
  clientId: string
}

// Campos editables para una cuenta
type EditableFields = {
  creditLine?: number
  balance?: number
  billingDays?: number
  creditDays?: number
  installments?: number
  startDate?: string
  endDate?: string
}

export function ClientAccountsEdit({ clientId }: ClientAccountsEditProps) {
  const { data: accounts, isLoading } = useGetAccountByClientId(clientId)
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount()

  // 🔽 acordeones cerrados al inicio
  const [openItem, setOpenItem] = useState<string | undefined>(undefined)

  // 🔄 estado local de edición por cuenta
  const [editedAccounts, setEditedAccounts] = useState<
    Record<string, EditableFields>
  >({})

  // 👉 hook de modales (lo usamos para abrir "Agregar placa/tarjeta")
  const { openModal } = useModalStore()

  const handleChangeField = (
    accountId: string,
    field: keyof EditableFields,
    value: string,
  ) => {
    setEditedAccounts((prev) => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        [field]:
          field === "startDate" || field === "endDate"
            ? value
            : value === ""
              ? undefined
              : Number(value),
      },
    }))
  }

  const getFieldValue = (
    account: AccountResponse,
    accountId: string,
    field: keyof EditableFields,
  ): string => {
    const edited = editedAccounts[accountId]?.[field]

    // fechas → string
    if (field === "startDate" || field === "endDate") {
      const original =
        field === "startDate" ? account.startDate : account.endDate
      return (edited as string | undefined) ?? original ?? ""
    }

    // números
    const originalNumber =
      (account as any)[field] !== undefined ? (account as any)[field] : ""
    return edited !== undefined ? String(edited) : String(originalNumber ?? "")
  }

  const handleSaveAccount = (account: AccountResponse) => {
    const edited = editedAccounts[account.accountId] || {}

    const body: AccountUpdateDTO = {
      creditLine:
        edited.creditLine !== undefined
          ? edited.creditLine
          : account.creditLine,
      billingDays:
        edited.billingDays !== undefined
          ? edited.billingDays
          : account.billingDays,
      creditDays:
        edited.creditDays !== undefined
          ? edited.creditDays
          : account.creditDays,
      installments:
        edited.installments !== undefined
          ? edited.installments
          : account.installments,
      startDate:
        edited.startDate !== undefined
          ? edited.startDate
          : account.startDate,
      endDate:
        edited.endDate !== undefined ? edited.endDate : account.endDate,
    }

    updateAccount({
      accountId: account.accountId,
      clientId,
      data: body,
    })
  }

  const renderAccountCard = (account: AccountResponse) => {
    const typeId = account.type?.id as AccountTypeForClient | undefined
    const accountLabel = account.type?.description ?? "Sin tipo"
    const colorStyles = typeId ? AccountTypeStyles[typeId] : undefined

    const itemValue = account.accountId

    // Para cuentas NO crédito solo mostramos info básica (sin formulario)
    const isCredit = typeId === AccountTypeForClient.CREDIT

    const handleOpenAddPlate = () => {
      // 👉 Abrir modal para agregar placas/tarjetas para esta cuenta
      openModal(Modals.ADD_PLATE, account.accountId)
    }

    return (
      <AccordionItem
        key={account.accountId}
        value={itemValue}
        className="border-none"
      >
        <Card className="overflow-hidden bg-sidebar/60">
          {/* CABECERA */}
          <div className="flex items-center justify-between px-4 py-3">
            <AccordionTrigger className="flex-1 py-0 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <span
                  className={cn(
                    "h-3 w-3 rounded-full",
                    colorStyles?.color,
                  )}
                />
                <span className="font-semibold text-foreground">
                  Cuenta {accountLabel}
                </span>
              </div>
            </AccordionTrigger>

            <TooltipButton
              icon={Trash2}
              tooltip="Eliminar cuenta"
              onClick={() =>
                console.log(
                  "Eliminar cuenta (futuro DELETE)",
                  account.accountId,
                )
              }
            />
          </div>

          {/* CONTENIDO */}
          <AccordionContent className="border-t border-border px-4 pb-4 pt-3">
            {/* Datos fijos */}
            <div className="mb-4 space-y-1 text-sm">
              <p className="text-muted-foreground">
                N° documento:{" "}
                <span className="text-foreground">
                  {account.documentNumber}
                </span>
              </p>
              <p className="text-muted-foreground">
                Cliente:{" "}
                <span className="text-foreground">
                  {account.clientName}
                </span>
              </p>
              <p className="text-muted-foreground">
                Dirección:{" "}
                <span className="text-foreground">
                  {account.address || "-"}
                </span>
              </p>
            </div>

            {/* 📝 FORMULARIO SOLO PARA CUENTA CRÉDITO */}
            {isCredit ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Línea de crédito
                    </label>
                    <Input
                      type="number"
                      value={getFieldValue(
                        account,
                        account.accountId,
                        "creditLine",
                      )}
                      onChange={(e) =>
                        handleChangeField(
                          account.accountId,
                          "creditLine",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Saldo
                    </label>
                    <Input
                      type="number"
                      value={account.balance ?? 0}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Fecha de inicio
                    </label>
                    <Input
                      type="date"
                      value={getFieldValue(
                        account,
                        account.accountId,
                        "startDate",
                      )}
                      onChange={(e) =>
                        handleChangeField(
                          account.accountId,
                          "startDate",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Fecha de fin
                    </label>
                    <Input
                      type="date"
                      value={getFieldValue(
                        account,
                        account.accountId,
                        "endDate",
                      )}
                      onChange={(e) =>
                        handleChangeField(
                          account.accountId,
                          "endDate",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Días de facturación
                    </label>
                    <Input
                      type="number"
                      value={getFieldValue(
                        account,
                        account.accountId,
                        "billingDays",
                      )}
                      onChange={(e) =>
                        handleChangeField(
                          account.accountId,
                          "billingDays",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Días de crédito
                    </label>
                    <Input
                      type="number"
                      value={getFieldValue(
                        account,
                        account.accountId,
                        "creditDays",
                      )}
                      onChange={(e) =>
                        handleChangeField(
                          account.accountId,
                          "creditDays",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Cuotas
                    </label>
                    <Input
                      type="number"
                      value={getFieldValue(
                        account,
                        account.accountId,
                        "installments",
                      )}
                      onChange={(e) =>
                        handleChangeField(
                          account.accountId,
                          "installments",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAddPlate}
                  >
                    Gestionar tarjetas
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleSaveAccount(account)}
                    disabled={isUpdating}
                    className="mt-1 md:mt-0"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              // Para ANTICIPO / CANJE solo mostramos resumen + botón de tarjetas
              <div className="mt-2 space-y-4">
                <div className="grid gap-x-10 gap-y-1 text-sm md:grid-cols-2 md:text-right">
                  <div className="text-muted-foreground">Línea crédito</div>
                  <div className="font-semibold">
                    {formatCurrency(account.creditLine || 0, "PEN")}
                  </div>

                  <div className="text-muted-foreground">Saldo</div>
                  <div className="font-semibold">
                    {formatCurrency(account.balance || 0, "PEN")}
                  </div>

                  {account.startDate && account.endDate && (
                    <>
                      <div className="text-muted-foreground">Vigencia</div>
                      <div className="font-semibold">
                        {formatDate(account.startDate)} -{" "}
                        {formatDate(account.endDate)}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAddPlate}
                  >
                    Gestionar tarjetas
                  </Button>
                </div>
              </div>
            )}
          </AccordionContent>
        </Card>
      </AccordionItem>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">
        Gestión de cuenta
      </h2>

      <section className="mt-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Cargando cuentas...
          </p>
        )}

        {!isLoading && (!accounts || accounts.length === 0) && (
          <p className="text-sm text-muted-foreground">
            Este cliente aún no tiene cuentas creadas.
          </p>
        )}

        {!isLoading && accounts && (
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={(value) =>
              setOpenItem(value as string | undefined)
            }
            className="space-y-3"
          >
            {accounts.map((account) => renderAccountCard(account))}
          </Accordion>
        )}
      </section>
    </div>
  )
}
