"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Package, X } from "lucide-react"
import { toast } from "sonner"

import Modal from "@/shared/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { useModalStore } from "@/shared/store/modal.store"
import { Modals } from "@/app/accounts/types/modals-name"
import { dataToCombo } from "@/shared/lib/combo-box"

import { useGetProducts } from "@/app/products/hooks/useProductsService"
import { updateCard } from "@/app/accounts/services/clients.service"

type CurrentProduct = { id: number; name: string }

type ModalProps = {
  clientId: string
  accountCardId: string
  cardNumber?: string
  plate?: string
  currentProducts: CurrentProduct[]
}

export default function ModalUpdateCardProducts() {
  const queryClient = useQueryClient()

  const modal = useModalStore((s) =>
    s.openModals.find((m) => m.id === Modals.UPDATE_CARD_PRODUCTS),
  )
  const closeModal = useModalStore((s) => s.closeModal)

  const props = modal?.prop as ModalProps | undefined
  const isOpen = Boolean(modal)

  const productsQuery = useGetProducts()

  const [selectedProductId, setSelectedProductId] = useState("")
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const current = props?.currentProducts ?? []
  const currentRealIds = useMemo(
    () => current.map((p) => p.id).filter((id) => id !== 0),
    [current],
  )

  const productNameById = useMemo(() => {
    const map = new Map<number, string>()
    ;(productsQuery.data ?? []).forEach((p: any) => {
      map.set(Number(p.productId), p.description)
    })
    return map
  }, [productsQuery.data])

  const getProductName = (id: number) => {
    const fromCurrent = current.find((p) => p.id === id)?.name
    if (fromCurrent) return fromCurrent
    return productNameById.get(id) ?? `ID: ${id}`
  }

  const allRealProductIds = useMemo(() => {
    return (productsQuery.data ?? [])
      .map((p: any) => Number(p.productId))
      .filter((id) => id !== 0)
  }, [productsQuery.data])

  const isAllSelected = useMemo(() => {
    if (!allRealProductIds.length) return false
    const a = new Set(allRealProductIds)
    const b = new Set(selectedIds)
    if (a.size !== b.size) return false
    for (const id of a) if (!b.has(id)) return false
    return true
  }, [allRealProductIds, selectedIds])

  const finalCount = useMemo(() => selectedIds.length, [selectedIds])
  const canSave = finalCount > 0

  const productsOptions = useMemo(() => {
    const all = productsQuery.data ?? []
    const blocked = new Set<number>(selectedIds)
    return dataToCombo(
      all.filter((p: any) => !blocked.has(Number(p.productId))),
      "productId",
      "description",
    )
  }, [productsQuery.data, selectedIds])

  useEffect(() => {
    if (!isOpen || !props) return

    // Estado final inicial = lo que vino del backend.
    // Si vino "TODOS" como lista completa, igual queda seleccionado todo.
    setSelectedIds(currentRealIds)
    setSelectedProductId("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, props?.accountCardId])

  const handleSelectAll = () => {
    const ids = Array.from(new Set(allRealProductIds))
    setSelectedIds(ids)
    setSelectedProductId("")
  }

  const handleClearAll = () => {
    setSelectedIds([])
    setSelectedProductId("")
  }

  const handleAddOne = () => {
    const id = Number(selectedProductId)
    if (!id) return

    if (id === 0) {
      handleSelectAll()
      return
    }

    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setSelectedProductId("")
  }

  const handleRemoveSelected = (id: number) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id))
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!props) throw new Error("No props")
      if (selectedIds.length === 0) {
        toast.error("La tarjeta debe tener al menos 1 producto.")
        throw new Error("EMPTY_PRODUCTS_NOT_ALLOWED")
      }

      const before = new Set(currentRealIds)
      const after = new Set(selectedIds)

      const remove = Array.from(before).filter((id) => !after.has(id))
      const add = Array.from(after).filter((id) => !before.has(id))

      return updateCard(props.accountCardId, {
        products: { remove, add },
      })
    },
    onSuccess: async () => {
      toast.success("Productos actualizados correctamente")

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["plates", "by-client", props!.clientId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["accounts", "by-client", props!.clientId],
        }),
        queryClient.invalidateQueries({ queryKey: ["client", props!.clientId] }),
      ])

      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["plates", "by-client", props!.clientId],
        }),
        queryClient.refetchQueries({
          queryKey: ["accounts", "by-client", props!.clientId],
        }),
        queryClient.refetchQueries({ queryKey: ["client", props!.clientId] }),
      ])

      closeModal(Modals.UPDATE_CARD_PRODUCTS)
    },
    onError: (err: any) => {
      if (err?.message === "EMPTY_PRODUCTS_NOT_ALLOWED") return
      toast.error("No se pudo actualizar los productos")
    },
  })

  if (!isOpen || !props) return null

  return (
    <Modal
      modalId={Modals.UPDATE_CARD_PRODUCTS}
      title="Editar productos de tarjeta"
      className="h-fit max-w-xl rounded-lg"
      scrollable
      onClose={() => {
        setSelectedIds([])
        setSelectedProductId("")
      }}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-sidebar/60 p-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-medium">
              {props.plate ?? "Sin placa"}{" "}
              <span className="text-muted-foreground">·</span>{" "}
              <span className="font-mono">{props.cardNumber ?? ""}</span>
            </div>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Productos seleccionados</p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                
                onClick={handleSelectAll}
                disabled={!allRealProductIds.length || mutation.isPending}
              >
                Seleccionar TODOS
              </Button>

              <Button
                type="button"
                variant="outline"
                
                onClick={handleClearAll}
                disabled={selectedIds.length === 0 || mutation.isPending}
              >
                Limpiar
              </Button>
            </div>
          </div>

          {selectedIds.length === 0 ? (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">No hay productos.</p>
              <p className="text-xs text-red-500">
                Debes seleccionar al menos 1 producto para poder guardar.
              </p>
            </div>
          ) : isAllSelected ? (
            <div className="flex flex-wrap gap-2">
              <Badge className="flex items-center gap-2">
                <span>TODOS ({selectedIds.length})</span>
                <button
                  type="button"
                  title="Quitar TODOS"
                  onClick={handleClearAll}
                  disabled={mutation.isPending}
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
                  <span>{getProductName(id)}</span>
                  <button
                    type="button"
                    title="Quitar"
                    onClick={() => handleRemoveSelected(id)}
                    disabled={mutation.isPending}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Agregar producto</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <ComboBox
              label="Producto"
              placeholder="Selecciona un producto"
              value={selectedProductId}
              options={productsOptions}
              onSelect={setSelectedProductId}
              className="w-full"
              searchable
              disabled={mutation.isPending}
            />

            <Button
              type="button"
              onClick={handleAddOne}
              disabled={!selectedProductId || mutation.isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>

          
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal(Modals.UPDATE_CARD_PRODUCTS)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !canSave}
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
