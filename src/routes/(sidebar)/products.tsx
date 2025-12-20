import { createFileRoute } from "@tanstack/react-router"
import { BadgePlus } from "lucide-react"
import { ModalsProduct } from "@/app/products/components/modal/modals-product"
import { useGetProducts } from "@/app/products/hooks/useProductsService"
import { Modals } from "@/app/products/lib/product-modals-name"
import { productsColumns } from "@/app/products/lib/products-columns"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"

export const Route = createFileRoute("/(sidebar)/products")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Lista de Productos",
    
  },
})

function RouteComponent() {
  const [search, setSearch] = useDebounce("")
  const products = useGetProducts()

  const filteredProducts = useSearch(products.data ?? [], search, [
    "description",
    "productCode",
  ])

  const table = useDataTable({
    data: filteredProducts,
    columns: productsColumns,
    isLoading: false,
  })

  return (
    <>
      <HeaderContent className="mb-2">
        <HeaderContent.Left>
          <Input
            label="Buscar producto"
            onChange={(e) => setSearch(e.target.value)}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button
            size="header"
            onClick={() =>
              useModalStore.getState().openModal(Modals.ADD_PRODUCT)
            }
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo ingreso producto
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsProduct />
    </>
  )
}
