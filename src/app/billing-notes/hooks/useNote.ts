import { useFormContext, useWatch } from "react-hook-form"
import { useSearchClientBySaleDocument } from "@/app/accounts/hooks/useClientsService"
import useAuthStore from "@/app/auth/store/auth.store"
import { useGetSeriesByUser } from "@/app/configurations/series/hooks/useSeriesService"
import { PaymentType } from "@/app/sales/types/sale"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { generateCreditNoteDTO } from "../lib/generate-note"
import { BillingNoteSchema } from "../schemas/note.schema"
import { useSaleDocumentStore } from "../store/note.store"
import { useProductStore } from "../store/product.store"
import { CreditNoteReasonEnum } from "../types/notes.enum"
import { useAddNoteCredit, useGetBillingDocuments } from "./useNotesService"

export function useNote() {
  const form = useFormContext<BillingNoteSchema>()
  const [voucherSearchTerm, setVoucherSearchTerm] = useDebounce("", 500)
  const [clientSearchTerm, setClientSearchTerm] = useDebounce("", 500)

  const setSelectedSaleDocument = useSaleDocumentStore(
    (state) => state.setSelectedSaleDocument,
  )

  const [saleDocumentType, selectedReason, clientId, referencedSaleId] =
    useWatch({
      control: form.control,
      name: ["documentTypeId", "reason.id", "clientId", "referencedSaleId"],
    })

  const billingDocuments = useGetBillingDocuments({
    clientId: clientId,
    term: voucherSearchTerm,
    isCredit: selectedReason === CreditNoteReasonEnum.REPROGRAMACION_CUOTAS,
  })

  const filterClients = useSearchClientBySaleDocument({
    saleDocumentTypeId: 0,
    searchTerm: clientSearchTerm,
    paymentTypeId: PaymentType.CASH,
  })

  const clients = filterClients.data?.map((client) => ({
    label: `${client.documentNumber} - ${client.firstName} ${client.lastName ?? ""}`,
    value: client.id,
  }))

  const user = useAuthStore((state) => state.user)
  const { data: series, isLoading: seriesIsLoading } = useGetSeriesByUser(
    user?.user.userId,
    saleDocumentType,
  )

  const handleSelectVoucher = (voucherId: string) => {
    form.setValue("referencedSaleId", voucherId)
  }

  const handleAcceptForm = () => {
    if (referencedSaleId) {
      const selected = billingDocuments.data?.find(
        (doc) => doc.id === referencedSaleId,
      )
      setSelectedSaleDocument({
        id: selected?.id ?? "",
        documentNumber: selected?.documentNumber ?? "",
      })
    }
  }

  const handleSelectClient = (clientId: string) => {
    form.setValue("clientId", clientId)
  }

  const handleDeselectClient = () => {
    form.setValue("clientId", "")
    form.setValue("referencedSaleId", "")
    setClientSearchTerm("")
  }

  return {
    // Search terms
    setVoucherSearchTerm,
    setClientSearchTerm,
    // API data
    billingDocuments,
    clients,
    series,
    seriesIsLoading,
    // Form watches
    clientId,
    referencedSaleId,
    selectedReason,
    // Handlers
    handleSelectVoucher,
    handleAcceptForm,
    handleSelectClient,
    handleDeselectClient,
    // Loading states
    isLoadingClients: filterClients.isLoading,
    isLoadingBillingDocuments: billingDocuments.isLoading,
  }
}

export function useAddNote(onResetForm?: () => void) {
  const { resetForm } = useSaleDocumentStore()
  const { resetProducts } = useProductStore()
  const { mutate: createCreditNote, isPending } = useAddNoteCredit()
  const onSubmit = async (data: BillingNoteSchema) => {
    // Generate DTO based on reason type
    const createCreditNoteDTO = generateCreditNoteDTO(data)
    // Submit to API
    createCreditNote(createCreditNoteDTO, {
      onSuccess: () => {
        resetProducts()
        resetForm()
        onResetForm?.()
      },
    })
  }
  return {
    onSubmit,
    isPending,
  }
}
