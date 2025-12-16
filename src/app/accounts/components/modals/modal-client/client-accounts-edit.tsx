"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/shared/lib/number"
import { formatDate } from "@/shared/lib/date"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"

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

import {
  CreditAccountForm,
  type CreditAccountFormValue,
} from "@/app/accounts/components/accounts/credit-account-form"

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

// Draft para crear CUENTA CRÉDITO (nuevo) usando UI reutilizada
type NewAccountDraft = CreditAccountFormValue

export function ClientAccountsEdit({ clientId }: ClientAccountsEditProps) {
  const { data: accounts, isLoading } = useGetAccountByClientId(clientId)
  const { data: accountTypes, isLoading: isLoadingTypes } = useGetAccountTypes()

  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount()
  const { mutate: createAccountOnly, isPending: isCreating } =
    useCreateAccountOnly()

  // 🔽 acordeones cerrados al inicio
  const [openItem, setOpenItem] = useState<string | undefined>(undefined)

  // 🔄 estado local de edición por cuenta existente
  const [editedAccounts, setEditedAccounts] = useState<
    Record<string, EditableFields>
  >({})

  // ✅ cuentas nuevas a crear en este modal (solo faltantes)
  const [toCreate, setToCreate] = useState<AccountTypeForClient[]>([])

  // ✅ draft solo para crédito (cuando vas a CREAR crédito)
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

  const availableButtons = useMemo(() => {
    const valid = Object.values(AccountTypeForClient)

    // Tomamos la data de /accounts/types para mostrar label real (name)
    const fromApi = (accountTypes ?? []).filter((t) =>
      valid.includes(t.id as any),
    )

    // Nos quedamos con los que NO existen aún en backend y NO están ya en toCreate
    return fromApi
      .filter((t) => !existingTypeIds.has(t.id))
      .filter((t) => !toCreate.includes(t.id as AccountTypeForClient))
      .map((t) => ({
        id: t.id as AccountTypeForClient,
        label: t.name,
        styles: AccountTypeStyles[t.id as AccountTypeForClient],
      }))
  }, [accountTypes, existingTypeIds, toCreate])

  const addToCreate = (type: AccountTypeForClient) => {
    if (existingTypeIds.has(type)) return
    if (toCreate.includes(type)) return
    setToCreate((prev) => [...prev, type])
  }

  const removeToCreate = (type: AccountTypeForClient) => {
    setToCreate((prev) => prev.filter((t) => t !== type))

    // si removemos crédito, limpiamos draft
    if (type === AccountTypeForClient.CREDIT) {
      setNewCreditDraft({
        creditLine: undefined,
        billingDays: undefined,
        creditDays: undefined,
        installments: undefined,
        startDate: "",
        endDate: "",
      })
    }
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
      const original =
        field === "startDate" ? account.startDate : account.endDate
      return (edited as string | undefined) ?? original ?? ""
    }

    const originalNumber =
      (account as any)[field] !== undefined ? (account as any)[field] : ""
    return edited !== undefined ? String(edited) : String(originalNumber ?? "")
  }

  const handleSaveAccount = (account: AccountResponse) => {
    const edited = editedAccounts[account.accountId] || {}

    const body: AccountUpdateDTO = {
      creditLine:
        edited.creditLine !== undefined ? edited.creditLine : account.creditLine,
      billingDays:
        edited.billingDays !== undefined
          ? edited.billingDays
          : account.billingDays,
      creditDays:
        edited.creditDays !== undefined ? edited.creditDays : account.creditDays,
      installments:
        edited.installments !== undefined
          ? edited.installments
          : account.installments,
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
  // ✅ POST /accounts/only (crear faltantes)
  // -----------------------------------
  const handleSaveNewAccounts = () => {
    if (toCreate.length === 0) return

    const payloadAccounts = toCreate.map((type) => {
      if (type === AccountTypeForClient.CREDIT) {
        return {
          accountTypeId: type,
          creditLine: newCreditDraft.creditLine ?? 0,
          billingDays: newCreditDraft.billingDays ?? 0,
          creditDays: newCreditDraft.creditDays ?? 0,
          installments: newCreditDraft.installments ?? 0,
          startDate: newCreditDraft.startDate || undefined,
          endDate: newCreditDraft.endDate || undefined,
        }
      }
      return { accountTypeId: type }
    })

    createAccountOnly(
      { clientId, accounts: payloadAccounts as any[] },
      {
        onSuccess: () => {
          setToCreate([])
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
      <AccordionItem
        key={account.accountId}
        value={itemValue}
        className="border-none"
      >
        <Card className="overflow-hidden bg-sidebar/60">
          <div className="flex items-center justify-between px-4 py-3">
            <AccordionTrigger className="flex-1 py-0 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <span
                  className={cn("h-3 w-3 rounded-full", colorStyles?.color)}
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
                console.log("Eliminar cuenta (futuro DELETE)", account.accountId)
              }
            />
          </div>

          <AccordionContent className="border-t border-border px-4 pb-4 pt-3">
            <div className="mb-4 space-y-1 text-sm">
              <p className="text-muted-foreground">
                N° documento:{" "}
                <span className="text-foreground">{account.documentNumber}</span>
              </p>
              <p className="text-muted-foreground">
                Cliente:{" "}
                <span className="text-foreground">{account.clientName}</span>
              </p>
              <p className="text-muted-foreground">
                Dirección:{" "}
                <span className="text-foreground">{account.address || "-"}</span>
              </p>
            </div>

            {isCredit ? (
            <div className="space-y-4">
              <CreditAccountForm
                value={{
                  creditLine: Number(
                    getFieldValue(account, account.accountId, "creditLine") || 0,
                  ),
                  balance: account.balance ?? 0,
                  billingDays: Number(
                    getFieldValue(account, account.accountId, "billingDays") || 0,
                  ),
                  creditDays: Number(
                    getFieldValue(account, account.accountId, "creditDays") || 0,
                  ),
                  installments: Number(
                    getFieldValue(account, account.accountId, "installments") || 0,
                  ),
                  startDate: getFieldValue(account, account.accountId, "startDate"),
                  endDate: getFieldValue(account, account.accountId, "endDate"),
                }}
                onChange={(newValue) => {
                  // números
                  handleChangeField(
                    account.accountId,
                    "creditLine",
                    newValue.creditLine === undefined ? "" : String(newValue.creditLine),
                  )
                  handleChangeField(
                    account.accountId,
                    "billingDays",
                    newValue.billingDays === undefined ? "" : String(newValue.billingDays),
                  )
                  handleChangeField(
                    account.accountId,
                    "creditDays",
                    newValue.creditDays === undefined ? "" : String(newValue.creditDays),
                  )
                  handleChangeField(
                    account.accountId,
                    "installments",
                    newValue.installments === undefined
                      ? ""
                      : String(newValue.installments),
                  )

                  // fechas
                  handleChangeField(
                    account.accountId,
                    "startDate",
                    newValue.startDate ?? "",
                  )
                  handleChangeField(account.accountId, "endDate", newValue.endDate ?? "")
                }}
                showBalance
                balanceReadOnly
                disabled={isUpdating}
              />

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

  // -----------------------------------
  // ✅ UI “Nuevo style” para crear faltantes
  // -----------------------------------
  const renderToCreateCard = (type: AccountTypeForClient) => {
    const styles = AccountTypeStyles[type]
    const label =
      type === AccountTypeForClient.CREDIT
        ? "Crédito"
        : type === AccountTypeForClient.ANTICIPO
          ? "Anticipo"
          : "Canje"

    const hasForm = type === AccountTypeForClient.CREDIT

    return (
      <motion.div
        key={type}
        layoutId={`to-create-${type}`}
        className="overflow-hidden"
      >
        <Card className="overflow-hidden bg-sidebar/60">
          {hasForm ? (
            <Accordion type="single" collapsible>
              <AccordionItem value={`create-${type}`} className="border-none">
                <div className="flex items-center justify-between bg-inherit p-4">
                  <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-3 w-3 rounded", styles.color)} />
                      <span className="font-semibold text-foreground">
                        Cuenta {label}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <TooltipButton
                    icon={Trash2}
                    tooltip="Quitar"
                    onClick={() => removeToCreate(type)}
                  />
                </div>

                <AccordionContent>
                  <div className="space-y-6 border-t border-border p-6">
                    {/* ✅ REUSO TOTAL del UI de crédito */}
                    <CreditAccountForm
                      value={newCreditDraft}
                      onChange={setNewCreditDraft}
                      showBalance={false}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="flex items-center justify-between bg-transparent p-4">
              <div className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded", styles.color)} />
                <span className="font-semibold text-foreground">Cuenta {label}</span>
              </div>

              <TooltipButton
                icon={Trash2}
                tooltip="Quitar"
                onClick={() => removeToCreate(type)}
              />
            </div>
          )}
        </Card>
      </motion.div>
    )
  }

  const anySelected = toCreate.length > 0

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Gestión de cuenta</h2>

        {/* ✅ HEADER: igual estilo que “Nuevo → Cuentas” */}
        <div className="flex flex-col gap-4">
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Agregar cuentas</p>
              <p className="text-xs text-muted-foreground">
                Si al cliente le falta una cuenta, agrégala aquí.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleSaveNewAccounts}
              disabled={!anySelected || isCreating || isLoadingTypes}
            >
              Guardar cuentas
            </Button>
          </section>

          {/* Botones disponibles (como Nuevo): solo muestra los que faltan */}
          <section className="flex flex-wrap gap-3">
            <AnimatePresence>
              {availableButtons.map((b) => (
                <motion.button
                  key={b.id}
                  layoutId={`btn-${b.id}`}
                  type="button"
                  onClick={() => addToCreate(b.id)}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-2 rounded-sm border px-4 py-2 font-semibold text-sm text-white shadow-xs transition-colors md:text-base",
                    b.styles.color,
                    b.styles.hoverColor,
                  )}
                  exit={{ opacity: 0 }}
                >
                  <Plus className="h-4 w-4" />
                  {b.label}
                </motion.button>
              ))}
            </AnimatePresence>
          </section>

          {/* Cards seleccionadas (como Nuevo) */}
          <section className="flex flex-col gap-4">
            <AnimatePresence>{toCreate.map((t) => renderToCreateCard(t))}</AnimatePresence>

            {!isLoadingTypes && availableButtons.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Este cliente ya tiene todas las cuentas disponibles.
              </p>
            )}
          </section>
        </div>

        {/* Cuentas existentes */}
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
    </LayoutGroup>
  )
}

