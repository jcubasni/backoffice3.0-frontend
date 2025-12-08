import { useGetSaleNotes } from "@sales/hooks/voucher/useVoucherService"
import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"
import { useSearchClientBySaleDocument } from "@/app/accounts/hooks/useClientsService"
import { useSearchPlateByClientId } from "@/app/accounts/hooks/usePlatesServicec"
import { PaymentType, SaleDocumentType } from "@/app/sales/types/sale/sale.enum"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { dataToCombo, dataToComboAdvanced } from "@/shared/lib/combo-box"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"
import { saleNotesColumns } from "../../lib/voucher/sale-notes-columns"
import { fromSaleNotesToProduct } from "../../lib/voucher/voucher.util"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import type { SalesProduct } from "../../types/product.type"

type LocalFilterParams = {
  clientId?: string
  plate?: string
  productId?: string
  startDate?: string
  endDate?: string
  maximumAmount?: string
}

export function useVoucher() {
  const navigate = useNavigate()
  const { addSaleNote } = useProductStore()
  const { setField } = useClientUtilStore(
    useShallow((state) => ({
      setField: state.setField,
    })),
  )

  const [debouncedSearchTerm, setSearchTerm] = useDebounce("", 400)
  const [selectedClient, setSelectedClient] = useState("")
  const [localParams, setLocalParams] = useState<LocalFilterParams>({
    clientId: undefined,
    plate: undefined,
    productId: undefined,
    startDate: undefined,
    endDate: undefined,
    maximumAmount: undefined,
  })
  const [appliedParams, setAppliedParams] = useState<LocalFilterParams>({
    clientId: undefined,
    plate: undefined,
    productId: undefined,
    startDate: undefined,
    endDate: undefined,
    maximumAmount: undefined,
  })

  const clients = useSearchClientBySaleDocument({
    saleDocumentTypeId: SaleDocumentType.NOTA_VENTA,
    searchTerm: debouncedSearchTerm,
    paymentTypeId: PaymentType.CREDIT,
  })

  const clientId = selectedClient || clients.data?.[0]?.id

  const plates = useSearchPlateByClientId(clientId || "")

  const saleNotes = useGetSaleNotes(
    {
      plate: appliedParams.plate,
      startDate: appliedParams.startDate,
      endDate: appliedParams.endDate,
      productId: appliedParams.productId,
      maximumAmount: appliedParams.maximumAmount,
    },
    appliedParams.clientId,
  )

  const handleLocalParamChange = (field: keyof LocalFilterParams, value: string | undefined) => {
    setLocalParams((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateChange = (field: "startDate" | "endDate", date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    handleLocalParamChange(field, formattedDate)
  }

  const handleClientSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm)
  }

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId)
    handleLocalParamChange("clientId", clientId)
  }

  const handleSaleNotesSearch = () => {
    if (!localParams.startDate) {
      return toast.error(
        "Se requiere mínimo la fecha inicial para consultar",
      )
    }

    const selectedClientData = clients.data?.find(
      (client) => client.id === selectedClient,
    )

    // Set client in store only when clicking "Consultar"
    if (selectedClientData && selectedClient) {
      setField("selectedClient", selectedClient)
      setField("selectedClientData", selectedClientData)
      setField("clientSearchTerm", selectedClientData.documentNumber)
    }

    // Aplicar los parámetros locales al estado que controla la query
    // Convertir "0" a undefined para plate y productId
    setAppliedParams({
      ...localParams,
      clientId: selectedClient,
      plate: localParams.plate === "0" ? undefined : localParams.plate,
      productId: localParams.productId === "0" ? undefined : localParams.productId,
    })
  }

  const platesOptions = useMemo(() => {
    const options = dataToComboAdvanced(
      plates.data,
      (plate) => plate.vehicle.plate,
      (plate) => plate.vehicle.plate,
    )
    return [{ label: "TODOS", value: "0" }, ...options]
  }, [plates.data])

  const products = useMemo(() => {
    if (!plates.data) return []
    const selectedPlate = plates.data.find((p) => p.vehicle.plate === localParams.plate)
    return selectedPlate ? [selectedPlate.product] : []
  }, [plates.data, localParams.plate])

  const productsOptions = useMemo(() => {
    const options = dataToCombo(products, "id", "name")
    return [{ label: "TODOS", value: "0" }, ...options]
  }, [products])

  const table = useDataTable({
    data: saleNotes.data,
    columns: saleNotesColumns,
    isLoading: saleNotes.isLoading,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  })

  // Client options for combo
  const clientOptions = useMemo(
    () =>
      clients.data?.map((client) => ({
        label: `${client.firstName} ${client.lastName || ""}`.trim(),
        value: client.id,
      })) || [],
    [clients.data],
  )

  const { openModal } = useModalStore()

  const handleConfirmProducts = (validatedProducts: SalesProduct[]) => {
    // Set additional fields for voucher (client already set in handleSaleNotesSearch)
    setField("selectedPlate", appliedParams.plate)
    setField("isVoucher", true)

    addSaleNote(validatedProducts)
    navigate({ to: Routes.NewSale })
  }

  // Handle row selection and navigation
  const handleRowSelect = () => {
    // Validar que no se hayan cambiado los filtros sin consultar de nuevo
    if (localParams.clientId !== appliedParams.clientId) {
      return toast.error("No puedes seleccionar vales de otro cliente")
    }

    const selected = table.getSelectedRowModel().rows.map((row) => row.original)
    const { salesProducts } = fromSaleNotesToProduct(selected)

    // Agrupar por productId para verificar si hay productos con precios diferentes
    const productGroups = salesProducts.reduce(
      (acc, product) => {
        const key = product.productId
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(product)
        return acc
      },
      {} as Record<number, SalesProduct[]>,
    )

    // Verificar si hay productos diferentes o productos con precios diferentes
    const hasMultipleProducts = Object.keys(productGroups).length > 1
    const hasMultiplePrices = Object.values(productGroups).some((group) => {
      const uniquePrices = new Set(group.map((item) => item.price))
      return uniquePrices.size > 1
    })

    // Si hay múltiples productos o precios diferentes, abrir modal
    if (hasMultipleProducts || hasMultiplePrices) {
      openModal("modal-validate-products", {
        products: salesProducts,
        onConfirm: handleConfirmProducts,
      })
    } else {
      // Si no hay diferencias, proceder directamente
      handleConfirmProducts(salesProducts)
    }
  }

  return {
    clientOptions,
    handleClientSearch,
    handleClientSelect,
    handleDateChange,
    handleLocalParamChange,
    handleRowSelect,
    handleSaleNotesSearch,
    isLoadingClients: clients.isLoading,
    isLoadingPlates: plates.isLoading,
    localParams,
    platesOptions,
    productsOptions,
    selectedClient,
    table,
  }
}
