import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AccountResponse, ClientSearch } from "@/app/accounts/types/client.type"
import { PaymentType, SaleDocumentType, SaleTypeE } from "../types/sale"

// Estado inicial como constante
const initialState = {
  documentTypeId: SaleDocumentType.BOLETA,
  clientSearchTerm: "",
  selectedClient: undefined as string | undefined,
  selectedClientData: undefined as ClientSearch | undefined,
  selectedProduct: "",
  selectedPlate: undefined as string | undefined,
  isFreeTransfer: false,
  paymentType: PaymentType.CASH,
  isVoucher: false,
  isAdvance: false,
  advanceSearchTerm: "",
  selectedSaleType: SaleTypeE.VENTA_INTERNA,
  cashRegisterId: "",
  creditInfo: undefined as AccountResponse | undefined,
  accountBalance: 0 as number | undefined,
}

// Tipo inferido automáticamente
type ClientUtilState = typeof initialState & {
  setField: <K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K],
  ) => void
  resetClientUtil: () => void
}

export const useClientUtilStore = create<ClientUtilState>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),
      resetClientUtil: () =>
        set((state) => ({
          ...initialState,
          cashRegisterId: state.cashRegisterId,
        })),
    }),
    {
      name: "client-util-store",
      partialize: (state) => ({
        selectedClientData: state.selectedClientData,
        clientSearchTerm: state.clientSearchTerm,
        cashRegisterId: state.cashRegisterId,
      }),
    },
  ),
)
