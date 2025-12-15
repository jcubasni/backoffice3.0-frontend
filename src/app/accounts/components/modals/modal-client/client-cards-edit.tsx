"use client"

import { useMemo, useState } from "react"
import { Car, CreditCard, DollarSign, Plus } from "lucide-react"

import { useSearchPlateByClientId } from "@/app/accounts/hooks/usePlatesServicec"
import { useGetAccountByClientId } from "@accounts/hooks/useClientsService"

import type { CardResponse } from "@accounts/types/plate.type"
import { CardStatus } from "@accounts/types/plate.type"
import { Modals } from "@accounts/types/modals-name"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { dataToComboAdvanced } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

type ClientCardsEditProps = {
  clientId: string
}

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

  return (
    <Card className="bg-sidebar/60 p-4">
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="space-y-3">
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{plate}</span>
              </div>
              <p className="text-muted-foreground text-xs">
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

        {/* Acciones */}
        <div className="flex justify-end">
          <TooltipButton.Box className="mr-0">
            <TooltipButton
              onClick={handleAssignBalance}
              className="text-green-600 hover:text-green-700"
              tooltip="Asignar saldo"
              icon={DollarSign}
            />
            {/* Más adelante se puede agregar Editar / Eliminar tarjeta */}
          </TooltipButton.Box>
        </div>
      </div>
    </Card>
  )
}

export function ClientCardsEdit({ clientId }: ClientCardsEditProps) {
  const { data: cards, isLoading, isError } = useSearchPlateByClientId(clientId)
  const { data: accounts } = useGetAccountByClientId(clientId)

  const { openModal } = useModalStore()
  const [selectedAccountId, setSelectedAccountId] = useState("")

  // Opciones del combo de cuentas
  const accountOptions = useMemo(
    () =>
      accounts && accounts.length > 0
        ? dataToComboAdvanced(
            accounts,
            (acc) => acc.accountId,
            (acc) =>
              `${acc.type?.description ?? "Cuenta"} - ${acc.documentNumber}`,
          )
        : [],
    [accounts],
  )

  // Tarjetas (por ahora las mostramos todas; si quisieras,
  // se pueden filtrar por cuenta seleccionada aquí)
  const safeCards: CardResponse[] = useMemo(
    () => (cards ?? []) as CardResponse[],
    [cards],
  )

  const handleOpenAddPlate = () => {
    if (!selectedAccountId) return
    // Abrimos el modal de placas con el accountId
    openModal(Modals.ADD_PLATE, selectedAccountId)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Cargando tarjetas...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        Ocurrió un error al cargar las tarjetas.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header + filtros */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-bold text-foreground text-xl">
            Tarjetas del cliente
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm">
            Gestiona las tarjetas vinculadas a las cuentas y vehículos del
            cliente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ComboBox
            label="Cuenta"
            placeholder="Selecciona una cuenta"
            value={selectedAccountId}
            options={accountOptions}
            onSelect={(value) => setSelectedAccountId(value)}
            className="min-w-[220px]"
          />

          <Button
            type="button"
            size="default"
            onClick={handleOpenAddPlate}
            disabled={!selectedAccountId}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar tarjeta
          </Button>
        </div>
      </div>

      {/* Lista de tarjetas */}
      {safeCards.length === 0 ? (
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
