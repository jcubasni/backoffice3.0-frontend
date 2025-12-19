"use client"

import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { DollarSign, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/shared/lib/number"
import { formatDate } from "@/shared/lib/date"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"

import {
  useAssignAccountBalance,
  useCreateAccountOnly,
  useGetAccountByClientId,
  useGetAccountTypes,
  useUpdateAccount,
} from "@accounts/hooks/useAccountsService"

import type { AccountResponse, AccountUpdateDTO } from "@accounts/types/client.type"
import { AccountTypeForClient } from "@accounts/types/client.type"
import { AccountTypeStyles } from "@accounts/types/client.enum"

import { Modals } from "@accounts/types/modals-name"
import { useModalStore } from "@/shared/store/modal.store"

import {
  CreditAccountForm,
  type CreditAccountFormValue,
} from "@/app/accounts/components/accounts/credit-account-form"

import {
  ACCOUNTS_TOAST_ID,
  isCreditDraftValid,
  prettyBackendMessage,
} from "@/app/accounts/lib/accounts.helpers"

type ClientAccountsEditProps = {
  clientId: string
}

type EditableFields = {
  creditLine?: number | null
  billingDays?: number | null
  creditDays?: number | null
  installments?: number | null
  startDate?: string
  endDate?: string
}

type NewAccountDraft = CreditAccountFormValue

export function ClientAccountsEdit({ clientId }: ClientAccountsEditProps) {
  const queryClient = useQueryClient()

  const { data: accounts, isLoading } = useGetAccountByClientId(clientId)
  const { data: accountTypes, isLoading: isLoadingTypes } = useGetAccountTypes()

  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount()
  const { mutate: createAccountOnly, isPending: isCreating } = useCreateAccountOnly()

  const { mutate: assignAccountBalance, isPending: isAssigningBalance } =
    useAssignAccountBalance()

  const [openItem, setOpenItem] = useState<string | undefined>(undefined)
  const [editedAccounts, setEditedAccounts] = useState<Record<string, EditableFields>>({})
  const [toCreate, setToCreate] = useState<AccountTypeForClient[]>([])

  const [newCreditDraft, setNewCreditDraft] = useState<NewAccountDraft>({
    creditLine: undefined,
    balance: 0,
    billingDays: undefined,
    creditDays: undefined,
    installments: undefined,
    startDate: "",
    endDate: "",
  })

  const { openModal } = useModalStore()

  const isBusy = isUpdating || isAssigningBalance

  // ✅ helpers: detectar si una cuenta tiene cambios y poder descartarlos
  const hasEdits = (accountId: string) => {
    const edited = editedAccounts[accountId]
    return !!edited && Object.keys(edited).length > 0
  }

  const discardEdits = (accountId: string) => {
    setEditedAccounts((prev) => {
      const next = { ...prev }
      delete next[accountId]
      return next
    })
    toast.info("Cambios descartados.", { id: `discard-${accountId}` })
  }

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
    const fromApi = (accountTypes ?? []).filter((t) => valid.includes(t.id as any))

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

    if (type === AccountTypeForClient.CREDIT) {
      setNewCreditDraft({
        creditLine: undefined,
        balance: 0,
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
              ? null
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

    if (edited === null) return ""
    if (edited !== undefined) return String(edited)

    const originalNumber = (account as any)[field]
    if (originalNumber === null || originalNumber === undefined) return ""
    return String(originalNumber)
  }

  const handleSaveAccount = (account: AccountResponse) => {
    const edited = editedAccounts[account.accountId] || {}

    const pickNumber = (key: keyof EditableFields, fallback: number | undefined) => {
      const v = edited[key]
      if (v === null) return fallback
      return v !== undefined ? (v as number) : fallback
    }

    const body: AccountUpdateDTO = {
      creditLine: pickNumber("creditLine", account.creditLine),
      billingDays: pickNumber("billingDays", account.billingDays),
      creditDays: pickNumber("creditDays", account.creditDays),
      installments: pickNumber("installments", account.installments),
      startDate: edited.startDate !== undefined ? edited.startDate : account.startDate,
      endDate: edited.endDate !== undefined ? edited.endDate : account.endDate,
    }

    updateAccount(
      {
        accountId: account.accountId,
        clientId,
        data: body,
      },
      {
        onSuccess: async () => {
          // ✅ al guardar, se limpian los edits -> el tachito desaparece
          setEditedAccounts((prev) => {
            const next = { ...prev }
            delete next[account.accountId]
            return next
          })

          await queryClient.invalidateQueries({ queryKey: ["accounts", "by-client", clientId] })
        },
        onError: (err: any) => {
          toast.error(prettyBackendMessage(err?.message))
        },
      },
    )
  }

  const handleOpenAddPlate = (accountId: string) => {
    openModal(Modals.ADD_PLATE, accountId)
  }

  const handleOpenAddBalance = (account: AccountResponse) => {
    openModal(Modals.ADD_ACCOUNT_BALANCE, {
      currentBalance: account.balance ?? 0,
      onAssignBalance: (amount: number, note?: string) => {
        if (!amount || amount <= 0) return

        assignAccountBalance({
          accountId: account.accountId,
          clientId,
          body: { amount, note: note?.trim() || undefined },
        })
      },
    })
  }

  const anySelected = toCreate.length > 0
  const hasCreditSelected = toCreate.includes(AccountTypeForClient.CREDIT)

  const canSaveNewAccounts =
    anySelected &&
    (!hasCreditSelected || isCreditDraftValid(newCreditDraft)) &&
    !isCreating &&
    !isLoadingTypes

  const handleSaveNewAccounts = () => {
    if (!canSaveNewAccounts) {
      if (!anySelected) {
        toast.info("Selecciona al menos un tipo de cuenta.")
        return
      }
      if (hasCreditSelected && !isCreditDraftValid(newCreditDraft)) {
        toast.info("Completa los campos de Crédito (incluye fechas).")
        return
      }
      return
    }

    const payloadAccounts = toCreate.map((type) => {
      if (type === AccountTypeForClient.CREDIT) {
        return {
          accountTypeId: type,
          creditLine: newCreditDraft.creditLine!,
          billingDays: newCreditDraft.billingDays!,
          creditDays: newCreditDraft.creditDays!,
          installments: newCreditDraft.installments!,
          startDate: newCreditDraft.startDate || undefined,
          endDate: newCreditDraft.endDate || undefined,
        }
      }
      return { accountTypeId: type }
    })

    createAccountOnly(
      { clientId, accounts: payloadAccounts as any[] },
      {
        onSuccess: async () => {
          toast.dismiss(ACCOUNTS_TOAST_ID)
          toast.success("Cuentas creadas correctamente", { id: ACCOUNTS_TOAST_ID })

          const initialBalance = Number(newCreditDraft.balance ?? 0)
          if (hasCreditSelected && initialBalance > 0) {
            await queryClient.invalidateQueries({ queryKey: ["accounts", "by-client", clientId] })
            const freshAccounts =
              queryClient.getQueryData<AccountResponse[]>(["accounts", "by-client", clientId]) ?? []

            const creditAccount = (freshAccounts ?? []).find(
              (a) => a.type?.id === AccountTypeForClient.CREDIT,
            )

            if (creditAccount?.accountId) {
              assignAccountBalance({
                accountId: creditAccount.accountId,
                clientId,
                body: { amount: initialBalance, note: "Saldo inicial" },
              })
            }
          }

          setToCreate([])
          setNewCreditDraft({
            creditLine: undefined,
            balance: 0,
            billingDays: undefined,
            creditDays: undefined,
            installments: undefined,
            startDate: "",
            endDate: "",
          })
        },

        onError: (err: any) => {
          toast.dismiss(ACCOUNTS_TOAST_ID)
          toast.error(prettyBackendMessage(err?.message), { id: ACCOUNTS_TOAST_ID })
        },
      },
    )
  }

  const renderAccountCard = (account: AccountResponse) => {
    const typeId = account.type?.id as AccountTypeForClient | undefined
    const accountLabel = account.type?.description ?? "Sin tipo"
    const colorStyles = typeId ? AccountTypeStyles[typeId] : undefined

    const itemValue = account.accountId
    const isCredit = typeId === AccountTypeForClient.CREDIT
    const accountHasEdits = hasEdits(account.accountId)

    return (
      <AccordionItem key={account.accountId} value={itemValue} className="border-none">
        <Card className="overflow-hidden bg-sidebar/60">
          <div className="flex items-center justify-between px-4 py-3">
            <AccordionTrigger className="flex-1 py-0 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <span className={cn("h-3 w-3 rounded-full", colorStyles?.color)} />
                <span className="text-base font-semibold leading-none text-foreground">
                  Cuenta {accountLabel}
                </span>
              </div>
            </AccordionTrigger>

            {/* ✅ Tachito SOLO si hay cambios -> Descartar */}
            {accountHasEdits && (
              <TooltipButton
                icon={Trash2}
                tooltip="Descartar cambios"
                onClick={() => discardEdits(account.accountId)}
              />
            )}
          </div>

          <AccordionContent className="border-t border-border px-4 pb-4 pt-3">
            {isCredit ? (
              <div className="space-y-4">
                <CreditAccountForm
                  value={{
                    creditLine:
                      getFieldValue(account, account.accountId, "creditLine") === ""
                        ? undefined
                        : Number(getFieldValue(account, account.accountId, "creditLine")),
                    balance: account.balance ?? 0,
                    billingDays:
                      getFieldValue(account, account.accountId, "billingDays") === ""
                        ? undefined
                        : Number(getFieldValue(account, account.accountId, "billingDays")),
                    creditDays:
                      getFieldValue(account, account.accountId, "creditDays") === ""
                        ? undefined
                        : Number(getFieldValue(account, account.accountId, "creditDays")),
                    installments:
                      getFieldValue(account, account.accountId, "installments") === ""
                        ? undefined
                        : Number(getFieldValue(account, account.accountId, "installments")),
                    startDate: getFieldValue(account, account.accountId, "startDate"),
                    endDate: getFieldValue(account, account.accountId, "endDate"),
                  }}
                  onChange={(newValue) => {
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
                      newValue.installments === undefined ? "" : String(newValue.installments),
                    )
                    handleChangeField(account.accountId, "startDate", newValue.startDate ?? "")
                    handleChangeField(account.accountId, "endDate", newValue.endDate ?? "")
                  }}
                  showBalance
                  balanceReadOnly
                  disabled={isBusy}
                  balanceAction={
                    <TooltipButton
                      icon={DollarSign}
                      tooltip="Agregar saldo"
                      onClick={() => handleOpenAddBalance(account)}
                      disabled={isBusy}
                      className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                    />
                  }
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
                    disabled={isBusy || !accountHasEdits} // ✅ no guardar si no hay cambios
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-2 space-y-4">
                <div className="grid gap-x-10 gap-y-1 text-sm md:grid-cols-2 md:text-right">
                  <div className="text-muted-foreground">Línea crédito</div>
                  <div className="font-semibold">{formatCurrency(account.creditLine || 0, "PEN")}</div>

                  <div className="text-muted-foreground">Saldo</div>
                  <div className="font-semibold">{formatCurrency(account.balance || 0, "PEN")}</div>

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
      <motion.div key={type} layoutId={`to-create-${type}`} className="overflow-hidden">
        <Card className="overflow-hidden bg-sidebar/60">
          {hasForm ? (
            <Accordion type="single" collapsible>
              <AccordionItem value={`create-${type}`} className="border-none">
                <div className="flex items-center justify-between bg-inherit p-4">
                  <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-3 w-3 rounded", styles.color)} />
                      <span className="text-base font-semibold leading-none text-foreground">
                        Cuenta {label}
                      </span>
                    </div>
                  </AccordionTrigger>

                  {/* ✅ aquí sí se mantiene: es para quitar la cuenta NUEVA antes de guardar */}
                  <TooltipButton icon={Trash2} tooltip="Quitar" onClick={() => removeToCreate(type)} />
                </div>

                <AccordionContent>
                  <div className="space-y-3 border-t border-border p-6">
                    <CreditAccountForm
                      value={newCreditDraft}
                      onChange={setNewCreditDraft}
                      showBalance
                      disabled={isBusy}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="flex items-center justify-between bg-transparent p-4">
              <div className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded", styles.color)} />
                <span className="text-base font-semibold leading-none text-foreground">
                  Cuenta {label}
                </span>
              </div>

              <TooltipButton icon={Trash2} tooltip="Quitar" onClick={() => removeToCreate(type)} />
            </div>
          )}
        </Card>
      </motion.div>
    )
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Gestión de cuenta</h2>

        <div className="flex flex-col gap-4">
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Agregar cuentas</p>
            </div>

            <Button type="button" onClick={handleSaveNewAccounts} disabled={!canSaveNewAccounts}>
              Guardar cuentas
            </Button>
          </section>

          <section className="flex flex-wrap gap-3">
            <AnimatePresence>
              {availableButtons.map((b) => (
                <motion.button
                  key={b.id}
                  layoutId={`btn-${b.id}`}
                  type="button"
                  onClick={() => addToCreate(b.id)}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors md:text-base",
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

          <section className="flex flex-col gap-4">
            <AnimatePresence>{toCreate.map((t) => renderToCreateCard(t))}</AnimatePresence>
          </section>
        </div>

        <section className="mt-2">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando cuentas...</p>}

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
