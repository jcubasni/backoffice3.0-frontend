import { PlusCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  useGetProductsByAccount,
  useUpdateProductsByClient,
} from "@/app/accounts/hooks/useClientsService"
import { Modals } from "@/app/accounts/types/modals-name"
import { useGetProducts } from "@/app/products/hooks/useProductsService"
import { ProductResponse } from "@/app/products/types/product.type"
import { Button } from "@/components/ui/button"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { DataTable } from "@/shared/components/ui/data-table"
import Modal from "@/shared/components/ui/modal"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"
import { productsColumns } from "../../../lib/product-columns"

export default function ModalAddProducts() {
  const updateProducts = useUpdateProductsByClient()
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [tableProducts, setTableProducts] = useState<ProductResponse[]>([])

  const accoundId = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.ADD_PRODUCT),
  )?.prop as string

  const { data: clientProducts, isLoading: clientProductsLoading } =
    useGetProductsByAccount(accoundId)
  const { data: products, isLoading: productsLoading } = useGetProducts()

  useEffect(() => {
    if (clientProducts) {
      setTableProducts(clientProducts)
    }
  }, [clientProducts])

  const handleAddProduct = () => {
    setSelectedProduct("")
    const productTableExists = tableProducts.find(
      (p) => String(p.productId) === selectedProduct,
    )
    if (productTableExists) return toast.info("El producto ya está agregado")
    const product = products?.find(
      (p) => String(p.productId) === selectedProduct,
    )
    if (!product) return toast.error("Producto no encontrado")
    setTableProducts((prev) => [...prev, product])
  }

  const handleDeleteProduct = (productId: number) => {
    setTableProducts((prev) => prev.filter((p) => p.productId !== productId))
  }

  const handleSaveChanges = () => {
    const originalProductIds = clientProducts?.map((p) => p.productId) || []
    const currentProductIds = tableProducts.map((p) => p.productId)

    const addedIds = currentProductIds.filter(
      (id) => !originalProductIds.includes(id),
    )
    const removedIds = originalProductIds.filter(
      (id) => !currentProductIds.includes(id),
    )

    const changes = {
      add: addedIds.length > 0 ? addedIds : undefined,
      remove: removedIds.length > 0 ? removedIds : undefined,
    }

    if (!changes.add?.length && !changes.remove?.length)
      return useModalStore.getState().closeModal(Modals.ADD_PRODUCT)
    updateProducts.mutate({
      accountId: accoundId,
      body: changes,
    })
  }

  const table = useDataTable({
    data: tableProducts,
    columns: productsColumns({
      onDelete: handleDeleteProduct,
    }),
    isLoading: clientProductsLoading,
  })
  return (
    <Modal
      modalId={Modals.ADD_PRODUCT}
      title="Agregar Producto"
      className="min-h-100 overflow-y-auto sm:w-125"
    >
      <section className="flex items-end gap-2">
        <ComboSearch
          options={dataToCombo(products, "productId", "description")}
          label="Productos"
          placeholder="Buscar productos..."
          onSelect={(e) => setSelectedProduct(e)}
          value={selectedProduct}
          isLoading={productsLoading}
        />
        <Button onClick={handleAddProduct} className="size-9.5 shrink-0">
          <PlusCircleIcon />
        </Button>
      </section>
      <section className="flex-1">
        <DataTable table={table} />
      </section>
      <Modal.Footer>
        <Button onClick={handleSaveChanges}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  )
}
