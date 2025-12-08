import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"
import useAuthStore from "@/app/auth/store/auth.store"
import { useGetPaymentTypesBySaleDocumentType } from "@/app/common/hooks/useCommonService"
import { useGetCurrencies } from "@/app/configurations/currencies/hooks/useCurrenciesService"
import { useGetSeriesByUser } from "@/app/configurations/series/hooks/useSeriesService"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import { useGetRetentionByClientId } from "./client/useClientService"
import { useSaleHelpers } from "./useSale.helper"
import { useGetSaleTypes } from "./useSaleService"

export const useExtraInfoHelpers = () => {
  const {
    isFreeTransfer,
    setField,
    isVoucher,
    isAdvance,
    selectedClientData,
    selectedSaleType,
    documentTypeId: saleDocumentType,
  } = useClientUtilStore(
    useShallow((state) => ({
      isFreeTransfer: state.isFreeTransfer,
      setField: state.setField,
      isVoucher: state.isVoucher,
      isAdvance: state.isAdvance,
      selectedClientData: state.selectedClientData,
      selectedSaleType: state.selectedSaleType,
      documentTypeId: state.documentTypeId,
    })),
  )

  const setTotals = useProductStore((state) => state.setTotals)
  const form = useFormContext()
  const user = useAuthStore((state) => state.user)
  const { isSaleNote, isCreditInvoice } = useSaleHelpers()

  const { data: series, isLoading: seriesIsLoading } = useGetSeriesByUser(
    user?.user.userId,
    saleDocumentType,
  )
  const { data: paymentTypes, isLoading: paymentTypesIsLoading } =
    useGetPaymentTypesBySaleDocumentType(saleDocumentType)
  const { data: saleTypes, isLoading: saleTypesIsLoading } =
    useGetSaleTypes(saleDocumentType)
  const { data: currencies, isLoading: currenciesIsLoading } =
    useGetCurrencies()
  const retentionData = useGetRetentionByClientId(
    selectedClientData?.id,
    selectedClientData?.has_retention,
  )

  const handleFreeTransferChange = (state: boolean) => {
    setField("isFreeTransfer", state)
    setTotals()
  }

  const handlePaymentTypeSelect = (value: string) => {
    setField("paymentType", Number(value))
  }

  // Handle retention and free transfer changes
  useEffect(() => {
    // Set retention type when client has retention
    if (
      selectedClientData?.has_retention &&
      retentionData.isSuccess &&
      retentionData.data
    ) {
      form.setValue(
        "retentionInfo.retentionTypeId",
        retentionData.data.retentionType.id,
      )
    }

    // Disable free transfer for credit invoices
    if (isCreditInvoice() && isFreeTransfer) {
      setField("isFreeTransfer", false)
      setTotals()
    }
  }, [
    retentionData.isSuccess,
    retentionData.data,
    selectedClientData?.has_retention,
    form,
    isCreditInvoice,
    isFreeTransfer,
    setField,
    setTotals,
  ])

  // Set first payment type ONLY when document type changes
  useEffect(() => {
    if (paymentTypes?.length) {
      setField("paymentType", paymentTypes[0].id)
    }
  }, [saleDocumentType, paymentTypes, setField])

  return {
    isFreeTransfer,
    isVoucher,
    isAdvance,
    selectedSaleType,
    series,
    seriesIsLoading,
    paymentTypes,
    paymentTypesIsLoading,
    saleTypes,
    saleTypesIsLoading,
    currencies,
    currenciesIsLoading,
    isSaleNote: isSaleNote(),
    handleFreeTransferChange,
    handlePaymentTypeSelect,
  }
}
