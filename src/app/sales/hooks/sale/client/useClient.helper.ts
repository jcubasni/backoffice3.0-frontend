import { useClientUtilStore } from "@sales/store/client-util.store"
import { useCallback, useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"
import {
  useGetAccountByClientId,
  useSearchClientBySaleDocument,
} from "@/app/accounts/hooks/useClientsService"

export const useClientHelpers = () => {
  const { setValue, control, resetField } = useFormContext()
  const { clientSearchTerm, selectedClient, setField } = useClientUtilStore(
    useShallow((state) => ({
      clientSearchTerm: state.clientSearchTerm,
      selectedClient: state.selectedClient,
      setField: state.setField,
      resetClientUtil: state.resetClientUtil,
    })),
  )

  const selectedType = useClientUtilStore((state) => state.documentTypeId)
  const paymentTypeId = useClientUtilStore((state) => state.paymentType)
  const [clientId, isCredit] = useWatch({
    control: control,
    name: ["clientInfo.id", "clientInfo.isCredit"],
  })

  const handleSearch = (debouncedSearchTerm: string) => {
    setField("clientSearchTerm", debouncedSearchTerm)
  }

  const filterClients = useSearchClientBySaleDocument({
    saleDocumentTypeId: selectedType,
    searchTerm: clientSearchTerm,
    paymentTypeId,
  })

  const clients = useMemo(
    () =>
      filterClients.data?.map((client) => ({
        label: `${client.documentNumber} - ${client.firstName} ${client.lastName ?? ""}`,
        value: client.id,
      })) ?? [],
    [filterClients.data],
  )

  const handleDeselect = () => {
    resetField("clientInfo")
    resetField("vehicleInfo")
  }

  const handleSelect = useCallback(
    (value: string) => {
      setField("selectedClient", value)
      const selectedClientData = filterClients.data?.find(
        (client) => client.id === value,
      )
      if (selectedClientData) {
        setValue("clientInfo", selectedClientData)
        setField("selectedClientData", selectedClientData)
      }
    },
    [filterClients.data, setValue],
  )

  const account = useGetAccountByClientId(clientId, isCredit)

  useEffect(() => {
    if (account.data) {
      setValue("accountCardId", account.data?.accountId)
      setField("creditInfo", account.data)
    }
  }, [account.data])

  return {
    handleDeselect,
    clients,
    handleSelect,
    handleSearch,
    selectedClient,
    selectedType,
    filterClients,
    setValue,
    paymentTypeId,
  }
}
