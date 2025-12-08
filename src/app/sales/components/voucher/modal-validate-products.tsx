import Big from "big.js"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { SalesProduct } from "../../types/product.type"

const MODAL_ID = "modal-validate-products"

interface ProductGroup {
  productId: number
  description: string
  items: SalesProduct[]
  hasMultiplePrices: boolean
}

interface ModalValidateProductsProps {
  products: SalesProduct[]
  onConfirm: (validatedProducts: SalesProduct[]) => void
}

export default function ModalValidateProducts() {
  const { openModals, closeModal } = useModalStore()
  const modalData = openModals.find((m) => m.id === MODAL_ID)?.prop as
    | ModalValidateProductsProps
    | undefined

  const products = modalData?.products || []
  const onConfirm = modalData?.onConfirm

  // Agrupar productos por productId
  const productGroups: ProductGroup[] = Object.values(
    products.reduce(
      (acc, product) => {
        const key = product.productId
        if (!acc[key]) {
          acc[key] = {
            productId: product.productId,
            description: product.description || "",
            items: [],
            hasMultiplePrices: false,
          }
        }
        acc[key].items.push(product)
        return acc
      },
      {} as Record<number, ProductGroup>,
    ),
  ).map((group) => {
    // Verificar si hay múltiples precios diferentes
    const uniquePrices = new Set(group.items.map((item) => item.price))
    return {
      ...group,
      hasMultiplePrices: uniquePrices.size > 1,
    }
  })

  const [editedPrices, setEditedPrices] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {}
      products.forEach((product) => {
        const key = `${product.productId}-${product.refDocumentNumbers?.[0]}`
        initial[key] = product.price
      })
      return initial
    },
  )

  const handlePriceChange = (
    productId: number,
    refDocumentNumber: string,
    newPrice: string,
  ) => {
    const key = `${productId}-${refDocumentNumber}`
    setEditedPrices((prev) => ({
      ...prev,
      [key]: newPrice,
    }))
  }

  const handleConfirm = () => {
    if (!onConfirm) return

    // Validar que productos con múltiples precios tengan precios iguales
    for (const group of productGroups) {
      if (group.hasMultiplePrices) {
        const prices = group.items.map((item) => {
          const key = `${item.productId}-${item.refDocumentNumbers?.[0]}`
          return editedPrices[key]
        })
        const uniquePrices = new Set(prices)
        if (uniquePrices.size > 1) {
          return toast.error(
            `El producto "${group.description}" tiene precios diferentes. Por favor, iguala todos los precios antes de continuar.`,
          )
        }
      }
    }

    // Agrupar productos con el mismo productId y precio
    const groupedProducts: Map<string, SalesProduct> = new Map()

    products.forEach((product) => {
      const key = `${product.productId}-${product.refDocumentNumbers?.[0]}`
      const price = editedPrices[key]
      const groupKey = `${product.productId}-${price}`

      if (groupedProducts.has(groupKey)) {
        const existing = groupedProducts.get(groupKey)!
        const quantityBig = new Big(existing.quantity).plus(product.quantity)
        const priceBig = new Big(price)
        const totalBig = quantityBig.times(priceBig)
        const subtotalBig = totalBig.div(new Big(1.18))

        groupedProducts.set(groupKey, {
          ...existing,
          quantity: Number(quantityBig.toFixed(2)),
          price,
          total: Number(totalBig.toFixed(2)),
          subtotal: Number(subtotalBig.toFixed(2)),
          refSaleIds: [
            ...(existing.refSaleIds || []),
            ...(product.refSaleIds || []),
          ],
          refDocumentNumbers: [
            ...(existing.refDocumentNumbers || []),
            ...(product.refDocumentNumbers || []),
          ],
        })
      } else {
        const priceBig = new Big(price)
        const quantityBig = new Big(product.quantity)
        const totalBig = priceBig.times(quantityBig)
        const subtotalBig = totalBig.div(new Big(1.18))

        groupedProducts.set(groupKey, {
          ...product,
          price,
          total: Number(totalBig.toFixed(2)),
          subtotal: Number(subtotalBig.toFixed(2)),
        })
      }
    })

    const validatedProducts = Array.from(groupedProducts.values())
    onConfirm(validatedProducts)
    closeModal(MODAL_ID)
  }

  return (
    <Modal
      modalId={MODAL_ID}
      title="Validar Productos"
      className="sm:max-w-4xl"
      scrollable={true}
    >
      <p className="mb-4 text-muted-foreground text-sm">
        Algunos productos tienen precios diferentes. Edita los precios para que
        sean iguales antes de continuar.
      </p>

      <div className="space-y-6">
        {productGroups.map((group) => (
          <div key={group.productId} className="space-y-2">
            <h3 className="font-semibold">
              {group.description}
              {group.hasMultiplePrices && (
                <span className="ml-2 text-red-500 text-sm">
                  (Precios diferentes - requiere ajuste)
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {group.items.map((item) => {
                const key = `${item.productId}-${item.refDocumentNumbers?.[0]}`
                return (
                  <div
                    key={key}
                    className="grid grid-cols-4 items-center gap-4 rounded-md border p-3"
                  >
                    <div>
                      <label className="text-muted-foreground text-xs">
                        Documento
                      </label>
                      <p className="text-sm">{item.refDocumentNumbers?.[0]}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs">
                        Cantidad
                      </label>
                      <p className="text-sm">{item.quantity}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs">
                        Total
                      </label>
                      <p className="text-sm">S/ {item.total?.toFixed(2)}</p>
                    </div>
                    <Input
                      id={key}
                      label="Precio Unitario"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editedPrices[key]}
                      onChange={(e) =>
                        handlePriceChange(
                          item.productId,
                          item.refDocumentNumbers?.[0] || "",
                          e.target.value,
                        )
                      }
                      className={
                        group.hasMultiplePrices ? "border-red-500" : ""
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Modal.Footer className="grid-cols-2">
        <Button variant="outline" onClick={() => closeModal(MODAL_ID)}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm}>Confirmar</Button>
      </Modal.Footer>
    </Modal>
  )
}
