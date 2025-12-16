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

  const productsOptions = useMemo(() => {
    const all = productsQuery.data ?? []

    // Evita ofrecer productos que ya están asignados (o que ya agregaste)
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

      // ✅ Refetch tarjetas del cliente
      // Ajusta la queryKey si tu hook usa otra (si me pasas useSearchPlateByClientId lo dejo exacto)
      await queryClient.invalidateQueries({
        queryKey: ["accounts", "cards", "by-client", props?.clientId],
      })
      await queryClient.invalidateQueries({ queryKey: ["cards"] })
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
            <p className="text-sm text-muted-foreground">Sin productos asignados.</p>
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
                      <button type="button" onClick={() => handleUndoRemove(p.id)} title="Deshacer">
                        <Plus className="h-3 w-3 rotate-45" />
                      </button>
                    ) : (
                      <button type="button" onClick={() => handleRemoveCurrent(p.id)} title="Quitar">
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
                    <span>ID: {id}</span>
                    <button type="button" onClick={() => setToAdd((p) => p.filter((x) => x !== id))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
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
            />
            <Button type="button" onClick={handleAdd} disabled={!selectedProductId}>
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
          <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
