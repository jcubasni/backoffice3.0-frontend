import { create } from "zustand"
import type { InstallmentDTO, NotesProduct } from "../types/notes.type"

interface SaleDocument {
  id: string
  documentNumber: string
}

interface InstallmentData {
  startDate: Date | undefined
  endDate: Date | undefined
  newInstallmentsCount: number
  totalPending: number
  installments?: InstallmentDTO[]
}

interface SaleDocumentStore {
  selectedSaleDocument: SaleDocument
  productChanges: NotesProduct[]
  installmentData: InstallmentData
  setSelectedSaleDocument: (document: SaleDocument) => void
  resetSelectedSaleDocument: () => void
  setProductChanges: (changes: NotesProduct[]) => void
  setInstallmentData: (data: Partial<InstallmentData>) => void
  resetForm: () => void
}

const initialSaleDocument: SaleDocument = {
  id: "",
  documentNumber: "",
}

const initialInstallmentData: InstallmentData = {
  startDate: undefined,
  endDate: undefined,
  newInstallmentsCount: 0,
  totalPending: 0,
}

export const useSaleDocumentStore = create<SaleDocumentStore>((set) => ({
  selectedSaleDocument: initialSaleDocument,
  productChanges: [],
  installmentData: initialInstallmentData,

  setSelectedSaleDocument: (document: SaleDocument) =>
    set({ selectedSaleDocument: document }),

  resetSelectedSaleDocument: () =>
    set({ selectedSaleDocument: initialSaleDocument }),

  setProductChanges: (changes: NotesProduct[]) =>
    set({ productChanges: changes }),

  setInstallmentData: (data: Partial<InstallmentData>) =>
    set((state) => ({
      installmentData: { ...state.installmentData, ...data },
    })),

  resetForm: () =>
    set({
      selectedSaleDocument: initialSaleDocument,
      productChanges: [],
      installmentData: initialInstallmentData,
    }),
}))
