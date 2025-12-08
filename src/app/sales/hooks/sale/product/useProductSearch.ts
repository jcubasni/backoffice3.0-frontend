import { useClientUtilStore } from "@sales/store/client-util.store"
import { useProductStore } from "@sales/store/product.store"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"
import { useGetProductsByAccount } from "@/app/accounts/hooks/useClientsService"
import { useGetPlates } from "@/app/accounts/hooks/usePlatesServicec"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { dataToCombo } from "@/shared/lib/combo-box"
import { Routes } from "@/shared/lib/routes"
import { useSaleHelpers } from "../useSale.helper"
import { useGetProductsToSale } from "../useSaleService"

export const useProductSearch = () => {
  const { isSaleNote } = useSaleHelpers()
  const navigate = useNavigate()
  const { addProduct, resetProduct } = useProductStore()
  const { control } = useFormContext<SaleSchema>()
  const { selectedProduct, setField } = useClientUtilStore(
    useShallow((state) => ({
      selectedProduct: state.selectedProduct,
      setField: state.setField,
    })),
  )

  const [accountCardId, selectedPlate] = useWatch({
    control,
    name: ["accountCardId", "vehicleInfo.plate"],
  })

  // Track previous plate to detect changes
  const prevPlateRef = useRef<string | undefined>(selectedPlate)

  // Clear products and deselect product when plate changes in sale note mode
  useEffect(() => {
    if (isSaleNote() && prevPlateRef.current !== selectedPlate) {
      // Only reset if there was a previous plate (not initial mount)
      if (prevPlateRef.current !== undefined) {
        resetProduct()
        setField("selectedProduct", "")
      }
      prevPlateRef.current = selectedPlate
    }
  }, [selectedPlate, isSaleNote, resetProduct, setField])

  // Conditional data fetching based on payment type
  const { data: generalProducts, isLoading: generalProductsLoading } =
    useGetProductsToSale()
  const { data: accountProducts, isLoading: accountProductsLoading } =
    useGetProductsByAccount(isSaleNote() ? accountCardId : undefined)
  const { data: vehicles } = useGetPlates(accountCardId)

  // Filter products by selected vehicle plate if applicable
  const filteredAccountProducts = useMemo(() => {
    if (!selectedPlate || !vehicles?.length || !accountProducts?.length) {
      return accountProducts
    }

    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.vehicle.plate === selectedPlate,
    )

    if (!selectedVehicle?.product?.id) {
      return accountProducts
    }

    return accountProducts.filter(
      (product) => product.productId === selectedVehicle.product.id,
    )
  }, [selectedPlate, vehicles, accountProducts])

  // Determine which data source to use
  const data = isSaleNote() ? filteredAccountProducts : generalProducts
  const isLoading = isSaleNote()
    ? accountProductsLoading
    : generalProductsLoading

  const handleSelectProduct = (productId: string) => {
    setField("selectedProduct", productId)
  }

  const handleAddProduct = () => {
    const product = data?.find((p) => p.productId === Number(selectedProduct))
    if (!product) return
    addProduct(product)
    setField("selectedProduct", "")
  }

  const redirectVoucher = () => {
    navigate({
      to: Routes.Voucher,
    })
  }

  const options = dataToCombo(data, "productId", "description")

  return {
    selectedProduct,
    isLoading,
    options,
    handleSelectProduct,
    handleAddProduct,
    redirectVoucher,
    selectedPlate,
  }
}
