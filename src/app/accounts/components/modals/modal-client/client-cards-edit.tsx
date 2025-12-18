"use client"

import { useState } from "react"
import { Car, CreditCard, DollarSign, Package, Plus } from "lucide-react"

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
import { ComboBox } from "@/shared/components/ui/combo-box"

import {
  useGetAccountByClientId,
  useUpdateAccount,
} from "@accounts/hooks/useClientsService"
import type { AccountResponse, AccountUpdateDTO } from "@accounts/types/client.type"
import { AccountTypeForClient } from "@accounts/types/client.type"
import { AccountTypeStyles } from "@accounts/types/client.enum"

import { useSearchPlateByClientId } from "@/app/accounts/hooks/usePlatesServicec"
import type { CardResponse } from "@/app/accounts/types/plate.type"
import { CardStatus } from "@/app/accounts/types/plate.type"
import { Modals } from "@/app/accounts/types/modals-name"
import { useModalStore } from "@/shared/store/modal.store"

/* ───────────────────────────────────── */
/*  PEQUEÑOS COMPONENTES DE APOYO       */
/* ───────────────────────────────────── */

function CardStatusBadge({ status }: { status: CardStatus }) {
  if (status === CardStatus.ACTIVE) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
        Activa
      </span>
    )
  }

  return (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
      Inactiva
    </span>
  )
}

function CardItem({ card }: { card: CardResponse }) {
  const { openModal } = useModalStore()

  const plate = card.vehicle?.plate ?? "Sin placa"

  const mainProductName =
    card.products && card.products.length > 0
      ? card.products[0].name
      : "Sin producto"

  const handleAssignBalance = () => {
    openModal(Modals.UPDATE_BALANCE, {
      accountCardId: card.accountCardId,
      currentBalance: card.balance,
    })
  }
  const handleEditProducts = () => {
  openModal(Modals.UPDATE_CARD_PRODUCTS, {
    accountCardId: card.accountCardId,
    cardNumber: card.cardNumber,
    plate: card.vehicle?.plate ?? "Sin placa",
    currentProducts: card.products ?? [],
  })
}

  return (
    <Card className="bg-sidebar/60 p-4">
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="space-y-3">
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{plate}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {card.client.fullName}
              </p>
            </div>

            <CardStatusBadge status={card.status} />
          </div>

          {/* Detalle */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-4 w-4" />
              <span className="font-mono text-xs md:text-sm">
                {card.cardNumber}
              </span>
            </div>

            <div className="flex items-center gap-2 text-foreground">
              <span className="text-xs font-medium text-muted-foreground">
                Producto:
              </span>
              <span className="text-xs md:text-sm">{mainProductName}</span>
            </div>

            <div className="flex items-center gap-2 text-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs md:text-sm">
                Saldo: S/ {card.balance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}cliente
        <div className="flex justify-end">
          <TooltipButton.Box className="mr-0">
            <TooltipButton
              onClick={handleEditProducts}
              className="text-violet-600 hover:text-violet-700"
              tooltip="Editar productos"
              icon={Package}
            />
            
            <TooltipButton
              onClick={handleAssignBalance}
              className="text-green-600 hover:text-green-700"
              tooltip="Asignar saldo"
              icon={DollarSign}
            />
          </TooltipButton.Box>
        </div>
      </div>
    </Card>
  )
}

/* ───────────────────────────────────── */
/*  COMPONENTE PRINCIPAL                */
/* ───────────────────────────────────── */

type ClientCardsEditProps = {
  /** Si no hay clientId => modo "nuevo cliente" */
  clientId?: string
}

type EditableFields = {
  creditLine?: number
  balance?: number
  billingDays?: number
  creditDays?: number
  installments?: number
  startDate?: string
  endDate?: string
}

export function ClientCardsEdit({ clientId }: ClientCardsEditProps) {
  /* ────────────────────────────── */
  /*  MODO NUEVO CLIENTE (sin id)  */
  /* ────────────────────────────── */

  if (!clientId) {
    return (
      <div className="space-y-4">
        {/* Header + filtros, igual que editar pero deshabilitado */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Tarjetas del cliente
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Gestiona las tarjetas vinculadas a las cuentas y vehículos del
              cliente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ComboBox
              label="Cuenta"
              placeholder="Selecciona una cuenta"
              className="min-w-[220px]"
              disabled
            />
            <Button type="button" size="default" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Agregar tarjeta
            </Button>
          </div>
        </div>

        <Card className="bg-sidebar/60 p-6">
          <div className="space-y-1 text-center text-sm text-muted-foreground">
            <p>Para gestionar tarjetas primero debes guardar el cliente.</p>
            <p className="text-xs text-muted-foreground/70">
              1. Completa las pestañas <strong>Mis datos</strong> y{" "}
              <strong>Cuentas</strong>. <br />
              2. Guarda el cliente. <br />
              3. Luego, desde la tabla de clientes, usa el botón{" "}
              <strong>Editar</strong> y ve a la pestaña{" "}
              <strong>Tarjetas</strong>.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  /* ────────────────────────────── */
  /*  MODO EDITAR (con clientId)   */
  /* ────────────────────────────── */

  const { data: cards, isLoading, isError } = useSearchPlateByClientId(clientId)
  const { data: accounts } = useGetAccountByClientId(clientId)
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount()

  const [openItem, setOpenItem] = useState<string | undefined>(undefined)
  const [editedAccounts, setEditedAccounts] = useState<
    Record<string, EditableFields>
  >({})

  const [selectedAccountId, setSelectedAccountId] = useState("")

  const accountOptions =
    accounts && accounts.length > 0
      ? accounts.map((acc) => ({
          label: `${acc.type?.description ?? "Cuenta"} - ${acc.documentNumber}`,
          value: acc.accountId,
        }))
      : []

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
      startDate:
        edited.startDate !== undefined ? edited.startDate : account.startDate,
      endDate: edited.endDate !== undefined ? edited.endDate : account.endDate,
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
    const isCredit = typeId === AccountTypeForClient.CREDIT

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

            {/* Aquí podrías poner botón eliminar cuenta si el backend lo soporta */}
          </div>

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
                <span className="text-foreground">{account.clientName}</span>
              </p>
              <p className="text-muted-foreground">
                Dirección:{" "}
                <span className="text-foreground">
                  {account.address || "-"}
                </span>
              </p>
            </div>

            {/* FORMULARIO SOLO PARA CRÉDITO */}
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

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => handleSaveAccount(account)}
                    disabled={isUpdating}
                    className="mt-4"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              // Resumen para otros tipos
              <div className="mt-2 grid gap-x-10 gap-y-1 text-sm md:grid-cols-2 md:text-right">
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
            )}
          </AccordionContent>
        </Card>
      </AccordionItem>
    )
  }

  const safeCards = cards ?? []

  return (
    <div className="space-y-4">
      {/* Header + filtros */}
      <div className="flex flex-wrap items-end justify-between gap-3">
  <div className="text-xl font-semibold text-foreground">
    <h2 className="text-xl font-semibold text-foreground">
      Tarjetas del cliente
    </h2>
  </div>

  <div className="flex flex-wrap items-end gap-2">
    <ComboBox
      label="Cuenta"
      placeholder="Selecciona una cuenta"
      value={selectedAccountId}
      options={accountOptions}
      onSelect={(value) => setSelectedAccountId(value)}
      className="min-w-[260px]"
    />

    <Button
      type="button"
      size="default"
      
      onClick={() => {
        if (!selectedAccountId) return
        useModalStore.getState().openModal(Modals.ADD_PLATE, selectedAccountId)
      }}
      disabled={!selectedAccountId}
    >
      <Plus className="mr-2 h-4 w-4" />
      Agregar tarjeta
    </Button>
  </div>
</div>

      {/* Lista de tarjetas */}
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Cargando tarjetas...
        </div>
      ) : isError ? (
        <div className="flex h-full items-center justify-center text-sm text-red-500">
          Ocurrió un error al cargar las tarjetas.
        </div>
      ) : safeCards.length === 0 ? (
        <Card className="bg-sidebar/60 p-6">
          <p className="text-center text-sm text-muted-foreground">
            Este cliente aún no tiene tarjetas registradas.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safeCards.map((card) => (
            <CardItem key={card.accountCardId} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
