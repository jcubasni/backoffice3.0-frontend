import { useState, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { CreditCard, DollarSign, Edit2, Plus, Trash2 } from "lucide-react"

import {
  type CardAssignment,
  createNewAssignment,
  getAllCardAssignments,
  getAvailableAccounts,
} from "@/app/accounts/lib/cards"
import type { CreateClientSchema } from "@/app/accounts/schemas/create-client.schema"
import { AccountTypeForClient } from "@/app/accounts/types/client.type"
import { Modals } from "@/app/accounts/types/modals-name"
import { useGetAccountTypes } from "@/app/common/hooks/useCommonService"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { dataToComboAdvanced } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

const accountTypeLabels: Record<AccountTypeForClient, string> = {
  [AccountTypeForClient.CREDIT]: "Crédito",
  [AccountTypeForClient.ANTICIPO]: "Anticipo",
  [AccountTypeForClient.CANJE]: "Canje",
}

export function Cards() {
  const form = useFormContext<CreateClientSchema>()

  const vehicles = form.watch("vehicles") ?? []
  const accounts = form.watch("accounts") ?? []

  const { openModal } = useModalStore()
  const accountTypesQuery = useGetAccountTypes()

  const [selectedPlacaCard, setSelectedPlacaCard] = useState("")
  const [selectedAccountCard, setSelectedAccountCard] = useState("")
  const [editingCardId, setEditingCardId] = useState<string | null>(null)

  // 📌 Memoizamos para no recalcular en cada render
  const cardAssignments = useMemo(
    () => getAllCardAssignments(vehicles),
    [vehicles],
  )

  const availableAccounts = useMemo(
    () =>
      getAvailableAccounts(
        accounts,
        selectedPlacaCard,
        vehicles,
        editingCardId,
      ),
    [accounts, selectedPlacaCard, vehicles, editingCardId],
  )

  const deleteCardAssignment = (assignmentId: string) => {
    const [licensePlate, , accountIndexStr] = assignmentId.split("__")
    const accountIndex = Number.parseInt(accountIndexStr, 10)

    const vehicleIndex = vehicles.findIndex(
      (v) => v.licensePlate === licensePlate,
    )
    if (vehicleIndex === -1) return

    const vehicle = vehicles[vehicleIndex]
    const updatedAccountsType = (vehicle.accountsType || []).filter(
      (_acc, index) => index !== accountIndex,
    )

    form.setValue(`vehicles.${vehicleIndex}.accountsType`, updatedAccountsType)
  }

  const addCardAssignment = () => {
    if (!selectedPlacaCard || !selectedAccountCard) return

    // Si estamos editando, primero eliminamos la asignación anterior
    if (editingCardId) {
      deleteCardAssignment(editingCardId)
    }

    const vehicleIndex = vehicles.findIndex(
      (v) => v.licensePlate === selectedPlacaCard,
    )
    if (vehicleIndex === -1) return

    const vehicle = vehicles[vehicleIndex]
    const currentAccountsType = vehicle.accountsType || []

    const accountTypeId = Number.parseInt(
      selectedAccountCard,
      10,
    ) as AccountTypeForClient

    // Obtener el código del tipo de cuenta
    const accountType = accountTypesQuery.data?.find(
      (type) => type.id === accountTypeId,
    )
    const accountTypeCode = accountType?.code ?? accountTypeId.toString()

    // Crear nueva asignación usando la función utilitaria
    const newAssignment = createNewAssignment(
      accountTypeId,
      accountTypeCode,
      vehicle.cardNumber,
    )

    // Verificar si ya existe una asignación con el mismo accountTypeId
    const existingIndex = currentAccountsType.findIndex(
      (acc) => acc.accountTypeId === accountTypeId,
    )

    if (existingIndex !== -1) {
      // Reemplazar la asignación existente
      const updatedAccountsType = [...currentAccountsType]
      updatedAccountsType[existingIndex] = newAssignment
      form.setValue(
        `vehicles.${vehicleIndex}.accountsType`,
        updatedAccountsType,
      )
    } else {
      // Agregar nueva asignación
      form.setValue(`vehicles.${vehicleIndex}.accountsType`, [
        ...currentAccountsType,
        newAssignment,
      ])
    }

    // Reset selección
    setSelectedPlacaCard("")
    setSelectedAccountCard("")
    setEditingCardId(null)
  }

  const editCardAssignment = (assignment: CardAssignment) => {
    setSelectedPlacaCard(assignment.licensePlate)
    setSelectedAccountCard(assignment.accountTypeId.toString())
    setEditingCardId(assignment.id)
  }

  const handleAssignBalance = (assignment: CardAssignment) => {
    openModal(Modals.UPDATE_BALANCE, {
      currentBalance: assignment.balance,
      onAssignBalance: (balance: number) => {
        const vehicle = vehicles[assignment.vehicleIndex]
        const updatedAccountsType = [...(vehicle.accountsType || [])]

        updatedAccountsType[assignment.accountIndex] = {
          ...updatedAccountsType[assignment.accountIndex],
          balance,
        }

        form.setValue(
          `vehicles.${assignment.vehicleIndex}.accountsType`,
          updatedAccountsType,
        )
      },
    })
  }

  const isAddDisabled = !selectedPlacaCard || !selectedAccountCard

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-foreground text-xl">Gestión de Tarjetas</h2>

      <Card className="bg-sidebar/60 p-4 md:p-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Asignar Placa a Cuenta
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ComboBox
              label="Seleccionar Placa"
              placeholder="-- Selecciona una placa --"
              value={selectedPlacaCard}
              options={dataToComboAdvanced(
                vehicles,
                (vehicle) => vehicle.licensePlate,
                (vehicle) =>
                  `${vehicle.licensePlate} (${vehicle.vehicleType})`,
              )}
              onSelect={(value) => {
                setSelectedPlacaCard(value)
                // Limpiar la cuenta seleccionada al cambiar de placa
                setSelectedAccountCard("")
              }}
            />

            <ComboBox
              label="Tipo de Cuenta"
              placeholder="-- Selecciona una cuenta --"
              value={selectedAccountCard}
              options={dataToComboAdvanced(
                availableAccounts,
                (account) => account.accountTypeId.toString(),
                (account) => accountTypeLabels[account.accountTypeId],
              )}
              onSelect={(value) => {
                setSelectedAccountCard(value)
              }}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={addCardAssignment}
              className="max-md:w-full"
              disabled={isAddDisabled}
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingCardId ? "Actualizar Asignación" : "Agregar Asignación"}
            </Button>
          </div>
        </div>
      </Card>

      {cardAssignments.length === 0 ? (
        <Card className="bg-sidebar/60 p-6">
          <p className="text-center">
            No hay tarjetas asignadas. Crea una nueva asignación de placa a
            cuenta.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cardAssignments.map((card) => {
            const isCreditAccount =
              card.accountTypeId === AccountTypeForClient.CREDIT

            return (
              <Card key={card.id} className="bg-sidebar/60 p-4">
                <div className="flex h-full flex-col justify-between gap-3">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{card.licensePlate}</h4>
                        <Badge className="inline-block rounded px-2 py-1 font-medium text-xs capitalize">
                          {accountTypeLabels[card.accountTypeId]}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-mono">{card.cardNumber}</span>
                      </div>

                      {isCreditAccount && (
                        <div className="flex items-center gap-2 text-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            Saldo: S/ {(card.balance ?? 0).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <TooltipButton.Box className="mr-0">
                    {isCreditAccount && (
                      <TooltipButton
                        onClick={() => handleAssignBalance(card)}
                        className="text-green-600 hover:text-green-700"
                        tooltip="Asignar saldo"
                        icon={DollarSign}
                      />
                    )}

                    <TooltipButton
                      onClick={() => editCardAssignment(card)}
                      className="text-blue-600 hover:text-blue-700"
                      tooltip="Editar asignación"
                      icon={Edit2}
                    />

                    <TooltipButton
                      tooltip="Eliminar asignación"
                      onClick={() => deleteCardAssignment(card.id)}
                      className="text-red-600 hover:text-red-700"
                      icon={Trash2}
                    />
                  </TooltipButton.Box>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
