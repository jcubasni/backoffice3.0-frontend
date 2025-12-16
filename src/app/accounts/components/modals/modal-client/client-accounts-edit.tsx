"use client"

import { useMemo, useState } from "react"

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
  useCreateAccountOnly,
  useGetAccountByClientId,
  useGetAccountTypes,
  useUpdateAccount,
} from "@accounts/hooks/useClientsService"

import type { AccountResponse, AccountUpdateDTO } from "@accounts/types/client.type"
import { AccountTypeForClient } from "@accounts/types/client.type"
import { AccountTypeStyles } from "@accounts/types/client.enum"

import { Modals } from "@accounts/types/modals-name"
import { useModalStore } from "@/shared/store/modal.store"

type ClientAccountsEditProps = {
  clientId: string
}

// Campos editables para una cuenta (existente)
type EditableFields = {
  creditLine?: number
  balance?: number
  billingDays?: number
  creditDays?: number
  installments?: number
  startDate?: string
  endDate?: string
}

// Campos para crear cuenta nueva (ONLY) - solo se usa en crédito
type NewAccountDraft = {
  creditLine?: number
  billingDays?: number
  creditDays?: number
  installments?: number
  startDate?: string
  endDate?: string
}

export function ClientAccountsEdit({ clientId }: ClientAccountsEditProps) {
  const { data: accounts, isLoading } = useGetAccountByClientId(clientId)
  const { data: accountTypes, isLoading: isLoadingTypes } = useGetAccountTypes()

  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount()
  const { mutate: createAccountOnly, isPending: isCreating } =
    useCreateAccountOnly()

  // 🔽 acordeones cerrados al inicio
  const [openItem, setOpenItem] = useState<string | undefined>(undefined)

  // 🔄 estado local de edición por cuenta existente
  const [editedAccounts, setEditedAccounts] = useState<Record<string, EditableFields>>({})

  // ✅ selección de cuentas nuevas a crear
  const [selectedToCreate, setSelectedToCreate] = useState<
    Record<AccountTypeForClient, boolean>
  >({
    [AccountTypeForClient.CREDIT]: false,
    [AccountTypeForClient.ANTICIPO]: false,
    [AccountTypeForClient.CANJE]: false,
  })

  // ✅ draft de formulario SOLO para crédito (cuenta nueva)
  const [newCreditDraft, setNewCreditDraft] = useState<NewAccountDraft>({
    creditLine: undefined,
    billingDays: undefined,
    creditDays: undefined,
    installments: undefined,
    startDate: "",
    endDate: "",
  })

  const { openModal } = useModalStore()

  // -----------------------------------
  // helpers
  // -----------------------------------

  const existingTypeIds = useMemo(() => {
    const set = new Set<number>()
    ;(accounts ?? []).forEach((a) => {
      const t = a.type?.id
      if (typeof t === "number") set.add(t)
    })
    return set
  }, [accounts])

  const findAccountTypeId = (type: AccountTypeForClient) => {
    // buscamos el id real desde /accounts/types (por si cambia)
    const found = accountTypes?.find((t) => t.id === type)
    return found?.id
  }

  const canSelectType = (type: AccountTypeForClient) => {
    // si ya existe en backend, no permitir seleccionar para crear
    return !existingTypeIds.has(type)
  }

  const toggleSelect = (type: AccountTypeForClient) => {
    if (!canSelectType(type)) return
    setSelectedToCreate((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

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

    if (field === "startDate" || field === "endDate") {
      const original = field === "startDate" ? account.startDate : account.endDate
      return (edited as string | undefined) ?? original ?? ""
    }

    const originalNumber = (account as any)[field] !== undefined ? (account as any)[field] : ""
    return edited !== undefined ? String(edited) : String(originalNumber ?? "")
  }

  const handleSaveAccount = (account: AccountResponse) => {
    const edited = editedAccounts[account.accountId] || {}

    const body: AccountUpdateDTO = {
      creditLine: edited.creditLine !== undefined ? edited.creditLine : account.creditLine,
      billingDays: edited.billingDays !== undefined ? edited.billingDays : account.billingDays,
      creditDays: edited.creditDays !== undefined ? edited.creditDays : account.creditDays,
      installments:
        edited.installments !== undefined ? edited.installments : account.installments,
      startDate: edited.startDate !== undefined ? edited.startDate : account.startDate,
      endDate: edited.endDate !== undefined ? edited.endDate : account.endDate,
    }

    updateAccount({
      accountId: account.accountId,
      clientId,
      data: body,
    })
  }

  const handleOpenAddPlate = (accountId: string) => {
    openModal(Modals.ADD_PLATE, accountId)
  }

  // -----------------------------------
  // ✅ crear cuentas nuevas (ONLY)
  // -----------------------------------
  const handleSaveNewAccounts = () => {
    const selectedTypes = Object.entries(selectedToCreate)
      .filter(([_, v]) => v)
      .map(([k]) => Number(k) as AccountTypeForClient)

    if (selectedTypes.length === 0) return

    const payloadAccounts = selectedTypes
      .map((type) => {
        const accountTypeId = findAccountTypeId(type)
        if (!accountTypeId) return null

        if (type === AccountTypeForClient.CREDIT) {
          return {
            accountTypeId,
            creditLine: newCreditDraft.creditLine,
            billingDays: newCreditDraft.billingDays,
            creditDays: newCreditDraft.creditDays,
            installments: newCreditDraft.installments,
            startDate: newCreditDraft.startDate || undefined,
            endDate: newCreditDraft.endDate || undefined,
          }
        }

        // anticipo / canje sin formulario
        return { accountTypeId }
      })
      .filter(Boolean) as any[]

    if (payloadAccounts.length === 0) return

    createAccountOnly(
      {
        clientId,
        accounts: payloadAccounts,
      },
      {
        onSuccess: () => {
          setSelectedToCreate({
            [AccountTypeForClient.CREDIT]: false,
            [AccountTypeForClient.ANTICIPO]: false,
            [AccountTypeForClient.CANJE]: false,
          })
          setNewCreditDraft({
            creditLine: undefined,
            billingDays: undefined,
            creditDays: undefined,
            installments: undefined,
            startDate: "",
            endDate: "",
          })
        },
      },
    )
  }

  // -----------------------------------
  // render cuenta existente (acordeón)
  // -----------------------------------
  const renderAccountCard = (account: AccountResponse) => {
    const typeId = account.type?.id as AccountTypeForClient | undefined
    const accountLabel = account.type?.description ?? "Sin tipo"
    const colorStyles = typeId ? AccountTypeStyles[typeId] : undefined

    const itemValue = account.accountId
    const isCredit = typeId === AccountTypeForClient.CREDIT

    return (
      <AccordionItem key={account.accountId} value={itemValue} className="border-none">
        <Card className="overflow-hidden bg-sidebar/60">
          <div className="flex items-center justify-between px-4 py-3">
            <AccordionTrigger className="flex-1 py-0 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <span className={cn("h-3 w-3 rounded-full", colorStyles?.color)} />
                <span className="font-semibold text-foreground">
                  Cuenta {accountLabel}
                </span>
              </div>
            </AccordionTrigger>

            <TooltipButton
              icon={Trash2}
              tooltip="Eliminar cuenta"
              onClick={() => console.log("Eliminar cuenta (futuro DELETE)", account.accountId)}
            />
          </div>

          <AccordionContent className="border-t border-border px-4 pb-4 pt-3">
            <div className="mb-4 space-y-1 text-sm">
              <p className="text-muted-foreground">
                N° documento: <span className="text-foreground">{account.documentNumber}</span>
              </p>
              <p className="text-muted-foreground">
                Cliente: <span className="text-foreground">{account.clientName}</span>
              </p>
              <p className="text-muted-foreground">
                Dirección: <span className="text-foreground">{account.address || "-"}</span>
              </p>
            </div>

            {isCredit ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Línea de crédito</label>
                    <Input
                      type="number"
                      value={getFieldValue(account, account.accountId, "creditLine")}
                      onChange={(e) =>
                        handleChangeField(account.accountId, "creditLine", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Saldo</label>
                    <Input type="number" value={account.balance ?? 0} disabled readOnly />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Fecha de inicio</label>
                    <Input
                      type="date"
                      value={getFieldValue(account, account.accountId, "startDate")}
                      onChange={(e) =>
                        handleChangeField(account.accountId, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Fecha de fin</label>
                    <Input
                      type="date"
                      value={getFieldValue(account, account.accountId, "endDate")}
                      onChange={(e) =>
                        handleChangeField(account.accountId, "endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Días de facturación</label>
                    <Input
                      type="number"
                      value={getFieldValue(account, account.accountId, "billingDays")}
                      onChange={(e) =>
                        handleChangeField(account.accountId, "billingDays", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Días de crédito</label>
                    <Input
                      type="number"
                      value={getFieldValue(account, account.accountId, "creditDays")}
                      onChange={(e) =>
                        handleChangeField(account.accountId, "creditDays", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Cuotas</label>
                    <Input
                      type="number"
                      value={getFieldValue(account, account.accountId, "installments")}
                      onChange={(e) =>
                        handleChangeField(account.accountId, "installments", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenAddPlate(account.accountId)}
                  >
                    Gestionar tarjetas
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleSaveAccount(account)}
                    disabled={isUpdating}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
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
                        {formatDate(account.startDate)} - {formatDate(account.endDate)}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenAddPlate(account.accountId)}
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

  const CreateAccountsHeader = () => {
    const creditDisabled = !canSelectType(AccountTypeForClient.CREDIT)
    const anticipoDisabled = !canSelectType(AccountTypeForClient.ANTICIPO)
    const canjeDisabled = !canSelectType(AccountTypeForClient.CANJE)

    const anySelected =
      selectedToCreate[AccountTypeForClient.CREDIT] ||
      selectedToCreate[AccountTypeForClient.ANTICIPO] ||
      selectedToCreate[AccountTypeForClient.CANJE]

    return (
      <Card className="bg-sidebar/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Crear cuentas</p>
            <p className="text-xs text-muted-foreground">
              Selecciona crédito, anticipo o canje para crear cuentas faltantes.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleSaveNewAccounts}
            disabled={!anySelected || isCreating || isLoadingTypes}
          >
            Guardar cuentas
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={selectedToCreate[AccountTypeForClient.CREDIT] ? "default" : "outline"}
            onClick={() => toggleSelect(AccountTypeForClient.CREDIT)}
            disabled={creditDisabled || isLoadingTypes}
          >
            {creditDisabled ? "Crédito (ya creado)" : "Crédito"}
          </Button>

          <Button
            type="button"
            variant={selectedToCreate[AccountTypeForClient.ANTICIPO] ? "default" : "outline"}
            onClick={() => toggleSelect(AccountTypeForClient.ANTICIPO)}
            disabled={anticipoDisabled || isLoadingTypes}
          >
            {anticipoDisabled ? "Anticipo (ya creado)" : "Anticipo"}
          </Button>

          <Button
            type="button"
            variant={selectedToCreate[AccountTypeForClient.CANJE] ? "default" : "outline"}
            onClick={() => toggleSelect(AccountTypeForClient.CANJE)}
            disabled={canjeDisabled || isLoadingTypes}
          >
            {canjeDisabled ? "Canje (ya creado)" : "Canje"}
          </Button>
        </div>

        {selectedToCreate[AccountTypeForClient.CREDIT] && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Línea de crédito</label>
              <Input
                type="number"
                value={newCreditDraft.creditLine ?? ""}
                onChange={(e) =>
                  setNewCreditDraft((p) => ({
                    ...p,
                    creditLine: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Días de facturación</label>
              <Input
                type="number"
                value={newCreditDraft.billingDays ?? ""}
                onChange={(e) =>
                  setNewCreditDraft((p) => ({
                    ...p,
                    billingDays: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Días de crédito</label>
              <Input
                type="number"
                value={newCreditDraft.creditDays ?? ""}
                onChange={(e) =>
                  setNewCreditDraft((p) => ({
                    ...p,
                    creditDays: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Cuotas</label>
              <Input
                type="number"
                value={newCreditDraft.installments ?? ""}
                onChange={(e) =>
                  setNewCreditDraft((p) => ({
                    ...p,
                    installments: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Fecha de inicio</label>
              <Input
                type="date"
                value={newCreditDraft.startDate ?? ""}
                onChange={(e) =>
                  setNewCreditDraft((p) => ({
                    ...p,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Fecha de fin</label>
              <Input
                type="date"
                value={newCreditDraft.endDate ?? ""}
                onChange={(e) =>
                  setNewCreditDraft((p) => ({
                    ...p,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">Gestión de cuenta</h2>

      <CreateAccountsHeader />

      <section className="mt-2">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando cuentas...</p>}

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
            onValueChange={(value) => setOpenItem(value as string | undefined)}
            className="space-y-3"
          >
            {accounts.map((account) => renderAccountCard(account))}
          </Accordion>
        )}
      </section>
    </div>
  )
}
