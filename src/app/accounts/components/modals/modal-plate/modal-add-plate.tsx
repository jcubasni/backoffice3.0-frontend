"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DollarSign, Plus, QrCode, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

import { useGetProducts } from "@/app/products/hooks/useProductsService"
import { useAddPlates } from "@/app/accounts/hooks/usePlatesServicec"
import { generateCardNumber } from "@/app/accounts/lib/plates"
import {
  type PlateArrayData,
  plateArraySchema,
} from "@/app/accounts/schemas/plate.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import type { AddPlateDTO } from "@/app/accounts/types/plate.type"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

import { useGetVehicles } from "@/app/vehicles/hooks/useVehiclesService"

const EMPTY_ROW: PlateArrayData["plates"][number] = {
  plate: "",
  cardNumber: "",
  balance: 0,
  productIds: [],
}

export default function ModalAddPlate() {
  const accountId = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.ADD_PLATE),
  )?.prop as string | undefined

  const productsQuery = useGetProducts()
  const vehiclesQuery = useGetVehicles({ page: 1, limit: 1000 })

  const addPlates = useAddPlates(accountId)

  const form = useForm<PlateArrayData>({
    resolver: zodResolver(plateArraySchema),
    defaultValues: { plates: [EMPTY_ROW] },
    mode: "onChange",
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "plates",
  })

  const isLoadingCombos = productsQuery.isLoading || vehiclesQuery.isLoading
  const isSaving = addPlates.isPending

  const vehicleOptions = useMemo(
    () => dataToCombo(vehiclesQuery.data?.rows ?? [], "plate", "plate"),
    [vehiclesQuery.data],
  )

  const productOptions = useMemo(
    () => dataToCombo(productsQuery.data ?? [], "productId", "description"),
    [productsQuery.data],
  )

  // ✅ Mapa id -> nombre para chips
  const productNameById = useMemo(() => {
    const map = new Map<number, string>()
    ;(productsQuery.data ?? []).forEach((p: any) => {
      map.set(Number(p.productId), p.description)
    })
    return map
  }, [productsQuery.data])

  // ✅ IDs reales (sin TODOS = 0)
  const allRealProductIds = useMemo(() => {
    return (productsQuery.data ?? [])
      .map((p: any) => Number(p.productId))
      .filter((pid) => pid !== 0)
  }, [productsQuery.data])

  // Estado local para el combo "Agregar producto" por cada placa
  const [selectedToAdd, setSelectedToAdd] = useState<Record<number, string>>({})

  // ✅ Flag UI: mostrar un solo badge "TODOS" por placa
  const [allSelected, setAllSelected] = useState<Record<number, boolean>>({})

  // ✅ Cuando se abre el modal (accountId disponible), reset limpio
  useEffect(() => {
    if (!accountId) return
    replace([EMPTY_ROW])
    form.reset({ plates: [EMPTY_ROW] })
    setSelectedToAdd({})
    setAllSelected({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  const handleGenerateCardNumber = (index: number) => {
    const plateValue = form.getValues(`plates.${index}.plate`)
    if (!plateValue) return

    const cardNumber = generateCardNumber(plateValue)

    form.setValue(`plates.${index}.cardNumber`, cardNumber, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const clearAllProducts = (index: number) => {
    form.setValue(`plates.${index}.productIds`, [], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setAllSelected((prev) => ({ ...prev, [index]: false }))
  }

  const handleAddProduct = (index: number) => {
    const value = selectedToAdd[index] ?? ""
    if (!value) return

    const id = Number(value)

    // ✅ caso especial: TODOS viene como productId = 0
    if (id === 0) {
      const unique = Array.from(new Set(allRealProductIds))

      form.setValue(`plates.${index}.productIds`, unique, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })

      // ✅ UI: solo 1 badge "TODOS"
      setAllSelected((prev) => ({ ...prev, [index]: true }))

      setSelectedToAdd((prev) => ({ ...prev, [index]: "" }))
      return
    }

    // ✅ si está en modo TODOS, bloqueamos selección individual
    if (allSelected[index]) return

    // ✅ producto normal
    if (!id) return

    const currentIds = form.getValues(`plates.${index}.productIds`) ?? []
    if (currentIds.includes(id)) return

    form.setValue(`plates.${index}.productIds`, [...currentIds, id], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })

    setSelectedToAdd((prev) => ({ ...prev, [index]: "" }))
  }

  const handleRemoveProduct = (index: number, id: number) => {
    // si está en modo TODOS, no dejamos quitar uno a uno (para evitar inconsistencias)
    if (allSelected[index]) return

    const currentIds = form.getValues(`plates.${index}.productIds`) ?? []
    form.setValue(
      `plates.${index}.productIds`,
      currentIds.filter((x) => x !== id),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    )
  }

  const onSubmit = (data: PlateArrayData) => {
    if (!accountId) return

    const payload: AddPlateDTO = {
      cards: data.plates.map((p) => ({
        licensePlate: p.plate,
        cardNumber: p.cardNumber,
        balance: p.balance ?? 0,
        productIds: p.productIds ?? [],
      })),
    }

    addPlates.mutate(payload)
  }

  const canSubmit = !!accountId && !isLoadingCombos && !isSaving

  return (
    <Modal
      modalId={Modals.ADD_PLATE}
      title="Agregar placa"
      className="overflow-y-auto sm:w-[600px]"
      scrollable
      onClose={() => {
        replace([EMPTY_ROW])
        form.reset({ plates: [EMPTY_ROW] })
        setSelectedToAdd({})
        setAllSelected({})
      }}
    >
      <FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
        {fields.map((field, index) => {
          const plateSelected = !!form.watch(`plates.${index}.plate`)
          const selectedIds = form.watch(`plates.${index}.productIds`) ?? []
          const isAll = allSelected[index] === true

          return (
            <div key={field.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Placa {index + 1}</h4>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isSaving}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <section className="grid grid-cols-2 gap-4">
                <ComboBoxForm
                  name={`plates.${index}.plate` as const}
                  label="Placa"
                  classContainer="col-span-1"
                  className="w-full!"
                  searchable
                  disabled={isSaving}
                  options={vehicleOptions}
                />

                <InputForm
                  name={`plates.${index}.cardNumber` as const}
                  label="Tarjeta"
                  readOnly
                  icon={QrCode}
                  iconClick={() => handleGenerateCardNumber(index)}
                  disabled={isSaving || !plateSelected}
                />

                <InputForm
                  name={`plates.${index}.balance` as const}
                  label="Saldo inicial (S/)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  icon={DollarSign}
                  disabled={isSaving}
                />

                {/* ✅ Chips de productos seleccionados */}
                <div className="col-span-2 space-y-2">
                  <p className="text-sm font-medium">Productos seleccionados</p>

                  {selectedIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aún no seleccionaste productos.
                    </p>
                  ) : isAll ? (
                    <div className="flex flex-wrap gap-2">
                      <Badge className="flex items-center gap-2">
                        <span>TODOS ({selectedIds.length})</span>
                        <button
                          type="button"
                          title="Quitar TODOS"
                          onClick={() => clearAllProducts(index)}
                          disabled={isSaving}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedIds.map((id) => (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          <span>{productNameById.get(id) ?? `ID: ${id}`}</span>
                          <button
                            type="button"
                            title="Quitar"
                            onClick={() => handleRemoveProduct(index, id)}
                            disabled={isSaving}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  
                </div>

                {/* ✅ Agregar producto */}
                <div className="col-span-2 space-y-2">
                  <p className="text-sm font-medium">Agregar producto</p>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <ComboBox
                      label="Producto"
                      placeholder="Selecciona un producto"
                      value={selectedToAdd[index] ?? ""}
                      options={productOptions}
                      onSelect={(value) =>
                        setSelectedToAdd((prev) => ({ ...prev, [index]: value }))
                      }
                      className="w-full"
                      searchable
                      disabled={isAll}
                    />

                    <Button
                      type="button"
                      onClick={() => handleAddProduct(index)}
                      disabled={isSaving || !(selectedToAdd[index] ?? "") || isAll}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </section>

              {index !== fields.length - 1 && <Separator />}
            </div>
          )
        })}

        <Button
          type="button"
          className="ml-auto w-fit"
          onClick={() => append(EMPTY_ROW)}
          disabled={isSaving}
        >
          <Plus /> Agregar otra placa
        </Button>

        <Modal.Footer>
          <Button type="submit" variant="outline" disabled={!canSubmit}>
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
