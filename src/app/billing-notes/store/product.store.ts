import Big from "big.js"
import { create } from "zustand"
import { DECIMAL_PLACES } from "@/shared/lib/constans"
import { NotesProduct } from "../types/notes.type"

interface ProductStore {
  products: NotesProduct[]
  originalProducts: NotesProduct[]
  totals: {
    subtotal: number
    igv: number
    total: number
  }
  addProduct: (products: NotesProduct[]) => void
  updateProduct: (index: number, field: keyof NotesProduct, value: any) => void
  deleteProduct: (index: number) => void
  calculateTotals: () => void
  resetProducts: () => void
  addGlobalDiscountProduct: () => void
  restoreOriginalProducts: () => void
}

const calculateBillingTotals = (products: NotesProduct[]) => {
  const subtotal = products.reduce(
    (sum, product) => sum.plus(product.subtotal),
    new Big(0),
  )
  const igv = products.reduce(
    (sum, product) => sum.plus(new Big(product.total).minus(product.subtotal)),
    new Big(0),
  )
  const total = products.reduce(
    (sum, product) => sum.plus(product.total),
    new Big(0),
  )

  return {
    subtotal: Number(subtotal.toFixed(DECIMAL_PLACES)),
    igv: Number(igv.toFixed(DECIMAL_PLACES)),
    total: Number(total.toFixed(DECIMAL_PLACES)),
  }
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  originalProducts: [],
  totals: {
    subtotal: 0,
    igv: 0,
    total: 0,
  },
  addProduct: (products: NotesProduct[]) =>
    set(() => {
      const newProducts = [...products]
      return {
        products: newProducts,
        originalProducts: [...products], // Save original copy
        totals: calculateBillingTotals(newProducts),
      }
    }),

  updateProduct: (index: number, field: keyof NotesProduct, value: any) =>
    set((state) => {
      const newProducts = [...state.products]
      newProducts[index] = { ...newProducts[index], [field]: value }
      return {
        products: newProducts,
        totals: calculateBillingTotals(newProducts),
      }
    }),

  deleteProduct: (index: number) =>
    set((state) => {
      const newProducts = state.products.filter((_, i) => i !== index)
      return {
        products: newProducts,
        totals: calculateBillingTotals(newProducts),
      }
    }),

  calculateTotals: () =>
    set((state) => ({
      totals: calculateBillingTotals(state.products),
    })),

  resetProducts: () =>
    set({
      products: [],
      originalProducts: [],
      totals: {
        subtotal: 0,
        igv: 0,
        total: 0,
      },
    }),

  addGlobalDiscountProduct: () =>
    set((state) => {
      if (state.products.length === 0) return state

      const IGV = new Big(18) // 18%
      const totalOfAllProducts = state.originalProducts.reduce(
        (sum, product) => sum.plus(product.total),
        new Big(0),
      )

      const subtotal = totalOfAllProducts.div(new Big(1).plus(IGV.div(100)))

      const globalDiscountProduct: NotesProduct = {
        id: "0000",
        productCode: "9999",
        description: "Descuento Global",
        measurementUnit: "UND",
        quantity: 1,
        unitPrice: Number(totalOfAllProducts.toFixed(DECIMAL_PLACES)),
        subtotal: Number(subtotal.toFixed(DECIMAL_PLACES)),
        total: Number(totalOfAllProducts.toFixed(DECIMAL_PLACES)),
      }

      const newProducts = [globalDiscountProduct]
      return {
        products: newProducts,
        totals: calculateBillingTotals(newProducts),
      }
    }),

  restoreOriginalProducts: () =>
    set((state) => {
      const restoredProducts = [...state.originalProducts]
      return {
        products: restoredProducts,
        totals: calculateBillingTotals(restoredProducts),
      }
    }),
}))
