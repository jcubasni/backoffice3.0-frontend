import { useMemo, useState } from "react"
import { useSearchClientBySaleDocument } from "@/app/accounts/hooks/useClientsService"
import { PaymentType, SaleDocumentType } from "@/app/sales/types/sale"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { dataToComboAdvanced } from "@/shared/lib/combo-box"

export const useClientHelper = (initialSearch: string) => {
  // Estado local para el input (sin delay)
  const [inputValue, setInputValue] = useState(initialSearch ?? "")
  // Valor con debounce para la API
  const [debouncedSearch] = useDebounce(inputValue, 300)

  const filterClients = useSearchClientBySaleDocument({
    saleDocumentTypeId: SaleDocumentType.NOTA_VENTA,
    searchTerm: debouncedSearch,
    paymentTypeId: PaymentType.CREDIT,
  })

  const clients = useMemo(
    () =>
      dataToComboAdvanced(
        filterClients.data,
        (client) => client.id,
        (client) => `${client.documentNumber} - ${client.firstName}`,
      ),
    [filterClients.data],
  )

  const handleSearch = (searchTerm: string) => {
    // Actualiza el estado local inmediatamente (sin delay en el input)
    setInputValue(searchTerm)
  }

  return {
    clients,
    filterClients,
    handleSearch,
  }
}
