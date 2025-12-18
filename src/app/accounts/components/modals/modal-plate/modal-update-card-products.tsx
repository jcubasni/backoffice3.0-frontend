"use client"

import { useMemo, useState } from "react"
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
  const [toAdd, setToAdd] = useState<number[]>([])
  const [toRemove, setToRemove] = useState<number[]>([])

  const current = props?.currentProducts ?? []
  const currentIds = useMemo(() => new Set(current.map((p) => p.id)), [current])

  // ✅ Mapa: productId -> description (para pintar nombres)
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

  // ✅ ids reales del catálogo (sin TODOS=0)
  const allRealProductIds = useMemo(() => {
    return (productsQuery.data ?? [])
      .map((p: any) => Number(p.productId))
      .filter((id) => id !== 0)
  }, [productsQuery.data])

  // ✅ ids reales actuales (por si el backend mete TODOS=0)
  const currentRealIds = useMemo(() => {
    return current.map((p) => p.id).filter((id) => id !== 0)
  }, [current])

  // ✅ Detecta si esta tarjeta equivale a "TODOS"
  const isAll = useMemo(() => {
    if (allRealProductIds.length === 0) return false
    if (currentRealIds.length === 0) return false

    const allSet = new Set(allRealProductIds)
    const curSet = new Set(currentRealIds)

    if (allSet.size !== curSet.size) return false
    for (const id of allSet) {
      if (!curSet.has(id)) return false
    }
    return true
  }, [allRealProductIds, currentRealIds])

  // ✅ true si toRemove contiene *todos* los currentRealIds
  const isRemovingAll = useMemo(() => {
    if (!currentRealIds.length) return false
    const r = new Set(toRemove)
    return currentRealIds.every((id) => r.has(id))
  }, [currentRealIds, toRemove])

  // Opciones del combo (bloquea ya asignados y los que ya agregaste)
  const productsOptions = useMemo(() => {
    const all = productsQuery.data ?? []
    const blocked = new Set<number>([...Array.from(currentIds), ...toAdd])

    return dataToCombo(
      all.filter((p: any) => !blocked.has(Number(p.productId))),
      "productId",
      "description",
    )
  }, [productsQuery.data, currentIds, toAdd])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!props) throw new Error("No props")

      return updateCard(props.accountCardId, {
        products: {
          remove: toRemove,
          add: toAdd,
        },
      })
    },
    onSuccess: async () => {
      toast.success("Productos actualizados correctamente")
      closeModal(Modals.UPDATE_CARD_PRODUCTS)

      await queryClient.invalidateQueries({
        queryKey: ["plates", "by-client", props?.clientId],
      })
    },
    onError: () => {
      toast.error("No se pudo actualizar los productos")
    },
  })

  const handleAdd = () => {
    const id = Number(selectedProductId)
    if (!id) return

    // Si lo habías marcado para remover, lo desmarcas
    setToRemove((prev) => prev.filter((x) => x !== id))

    // Si ya está en current, no agregar
    if (currentIds.has(id)) return

    setToAdd((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setSelectedProductId("")
  }

  const handleRemoveCurrent = (id: number) => {
    // si estaba en "add", solo lo quitamos de add
    setToAdd((prev) => prev.filter((x) => x !== id))

    // si estaba en current => marcar para remove
    if (currentIds.has(id)) {
      setToRemove((prev) => (prev.includes(id) ? prev : [...prev, id]))
    }
  }

  const handleUndoRemove = (id: number) => {
    setToRemove((prev) => prev.filter((x) => x !== id))
  }

  // ✅ Marcar todos para remover con 1 click (mantiene PATCH real)
  const handleRemoveAll = () => {
    setToAdd([])
    setToRemove(currentRealIds)
  }

  if (!isOpen || !props) return null

  return (
    <Modal
      modalId={Modals.UPDATE_CARD_PRODUCTS}
      title="Editar productos de tarjeta"
      className="h-fit max-w-xl rounded-lg"
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
          <p className="text-sm font-semibold">Productos actuales</p>

          {current.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sin productos asignados.
            </p>
          ) : isAll ? (
            <div className="flex flex-wrap gap-2">
              <Badge className="flex items-center gap-2">
                <span>TODOS ({currentRealIds.length})</span>

                <button
                  type="button"
                  title={isRemovingAll ? "Ya marcado para remover" : "Quitar TODOS"}
                  onClick={handleRemoveAll}
                  disabled={isRemovingAll}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>

              {isRemovingAll && (
                <p className="w-full text-xs text-muted-foreground">
                  Todos los productos fueron marcados para remover. Presiona{" "}
                  <strong>Guardar</strong> para confirmar.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {current.map((p) => {
                const marked = toRemove.includes(p.id)
                return (
                  <Badge
                    key={p.id}
                    variant={marked ? "destructive" : "secondary"}
                    className="flex items-center gap-2"
                  >
                    <span>{p.name}</span>

                    {marked ? (
                      <button
                        type="button"
                        onClick={() => handleUndoRemove(p.id)}
                        title="Deshacer"
                      >
                        <Plus className="h-3 w-3 rotate-45" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemoveCurrent(p.id)}
                        title="Quitar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                )
              })}
            </div>
          )}

          {toAdd.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-sm font-semibold">Productos a agregar</p>
              <div className="flex flex-wrap gap-2">
                {toAdd.map((id) => (
                  <Badge key={id} className="flex items-center gap-2">
                    <span>{getProductName(id)}</span>
                    <button
                      type="button"
                      title="Quitar"
                      onClick={() =>
                        setToAdd((prev) => prev.filter((x) => x !== id))
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ✅ Aquí el cambio: si está removiendo TODOS, solo 1 badge */}
        {toRemove.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-sm font-semibold">Productos a remover</p>

            {isAll && isRemovingAll ? (
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <span>QUITAR TODOS ({currentRealIds.length})</span>

                  <button
                    type="button"
                    title="Deshacer"
                    onClick={() => setToRemove([])}
                  >
                    <Plus className="h-3 w-3 rotate-45" />
                  </button>
                </Badge>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {toRemove.map((id) => (
                  <Badge
                    key={id}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <span>{getProductName(id)}</span>

                    <button
                      type="button"
                      title="Deshacer"
                      onClick={() => handleUndoRemove(id)}
                    >
                      <Plus className="h-3 w-3 rotate-45" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

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
              disabled={isAll && !isRemovingAll}
            />
            <Button
              type="button"
              onClick={handleAdd}
              disabled={!selectedProductId || (isAll && !isRemovingAll)}
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
            disabled={mutation.isPending}
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
