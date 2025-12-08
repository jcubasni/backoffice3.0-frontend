import Big from "big.js"
import { create } from "zustand"
import { ProductResponse } from "@/app/products/types/product.type"
import {
  calculateDetractionAmount,
  calculateTotals,
  toSalesProduct,
} from "@/app/sales/lib/sale/products.util"
import { SalesProduct, Totals } from "@/app/sales/types/product.type"
import { idAdvanceProduct } from "../types/sale"

interface ProductStore {
  products: SalesProduct[]
  totals: Totals
  referenceDocument: string
  isValidAdvancePayment: boolean
  addProduct: (product: ProductResponse) => void
  addSaleNote: (products: SalesProduct[]) => void
  addAdvance: (product: SalesProduct[], referenceDocument: string) => void
  deleteProduct: (productId: number, refDocumentNumber?: string) => void
  updateProductQuantity: (productId: number, quantity: number) => void
  updateProductPrice: (productId: number, price: number) => void
  updateProductTotal: (productId: number, total: number) => void
  setTotals: () => void
  setDerivedTotals: (retentionAmount: number, totalToPay: number) => void
  resetProduct: () => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  totals: {
    subtotal: 0,
    igv: 0,
    total: 0,
    freeTransfer: 0,
    detraction: 0,
    retentionAmount: 0,
    totalToPay: 0,
  },
  referenceDocument: "",
  isValidAdvancePayment: true,
  addProduct: (product: ProductResponse) =>
    set((state) => {
      const existingProduct = state.products.find(
        (p) => p.productId === product.productId,
      )
      if (existingProduct) {
        return state
      }
      const salesProduct = toSalesProduct(product)
      const newProducts = [...state.products, salesProduct]
      return {
        products: newProducts,
        totals: calculateTotals(newProducts),
      }
    }),
  addSaleNote: (products: SalesProduct[]) =>
    set((state) => {
      // Get all existing refDocumentNumbers
      const existingDocNumbers = new Set(
        state.products.flatMap((p) => p.refDocumentNumbers || []),
      )

      // Filter out products that have all their documents already in the store
      const newProducts = products
        .map((product) => {
          // Filter out document numbers that are already in the store
          const newRefDocNumbers = (product.refDocumentNumbers || []).filter(
            (docNum) => !existingDocNumbers.has(docNum),
          )

          // If no new documents for this product, skip it
          if (newRefDocNumbers.length === 0) {
            return null
          }

          // Get the indices of the new documents
          const newIndices = (product.refDocumentNumbers || [])
            .map((docNum, index) =>
              newRefDocNumbers.includes(docNum) ? index : -1,
            )
            .filter((index) => index !== -1)

          // Filter the refSaleIds to match the new documents
          const newRefSaleIds = newIndices.map(
            (index) => (product.refSaleIds || [])[index],
          )

          return {
            ...product,
            refSaleIds: newRefSaleIds,
            refDocumentNumbers: newRefDocNumbers,
          }
        })
        .filter((product): product is SalesProduct => product !== null)

      // If no new products, don't add anything
      if (newProducts.length === 0) {
        return state
      }

      const updatedProducts = [...state.products, ...newProducts]
      return {
        products: updatedProducts,
        totals: calculateTotals(updatedProducts),
      }
    }),
  addAdvance: (products: SalesProduct[], referenceDocument: string) =>
    set((state) => {
      const hasAdvanceProduct = state.products.some(
        (p) => p.productId === idAdvanceProduct,
      )
      if (hasAdvanceProduct) {
        return state
      }
      const newProducts = [...state.products, ...products]
      return {
        products: newProducts,
        totals: calculateTotals(newProducts),
        referenceDocument,
      }
    }),
  deleteProduct: (productId: number, refDocumentNumber?: string) =>
    set((state) => {
      let newProducts: SalesProduct[]

      if (refDocumentNumber) {
        // If refDocumentNumber is provided, find the specific product instance
        const productIndex = state.products.findIndex(
          (p) =>
            p.productId === productId &&
            p.refDocumentNumbers?.includes(refDocumentNumber),
        )

        if (productIndex === -1) {
          return state
        }

        const product = state.products[productIndex]
        const refDocNumbers = product.refDocumentNumbers || []

        // If the product has only one document, remove the entire product
        if (refDocNumbers.length === 1) {
          newProducts = state.products.filter(
            (_, index) => index !== productIndex,
          )
        } else {
          // If the product has multiple documents, remove only the specified one
          const docIndex = refDocNumbers.indexOf(refDocumentNumber)
          const newRefDocNumbers = refDocNumbers.filter(
            (_, index) => index !== docIndex,
          )
          const newRefSaleIds = (product.refSaleIds || []).filter(
            (_, index) => index !== docIndex,
          )

          newProducts = state.products.map((p, index) =>
            index === productIndex
              ? {
                  ...p,
                  refSaleIds: newRefSaleIds,
                  refDocumentNumbers: newRefDocNumbers,
                }
              : p,
          )
        }
      } else {
        // If no refDocumentNumber, remove all instances of the product
        newProducts = state.products.filter((p) => p.productId !== productId)
      }

      return {
        products: newProducts,
        totals: calculateTotals(newProducts),
      }
    }),
  updateProductQuantity: (productId: number, quantity: number) =>
    set((state) => {
      const newProducts = state.products.map((p) => {
        if (p.productId === productId) {
          const quantityBig = new Big(quantity)
          const price = new Big(p.price)
          const total = quantityBig.times(price)
          const subtotal = total.div(new Big(1.18))
          const updatedProduct = {
            ...p,
            quantity,
            total: Number(total.toFixed(2)),
            subtotal: Number(subtotal.toFixed(2)),
          }
          updatedProduct.detractionAmount =
            calculateDetractionAmount(updatedProduct)
          return updatedProduct
        }
        return p
      })
      return {
        products: newProducts,
        totals: calculateTotals(newProducts),
      }
    }),
  updateProductPrice: (productId: number, price: number) =>
    set((state) => {
      const newProducts = state.products.map((p) => {
        if (p.productId === productId) {
          const priceBig = new Big(price)
          const quantity = new Big(p.quantity)
          const total = priceBig.times(quantity)
          const subtotal = total.div(new Big(1.18))
          const updatedProduct = {
            ...p,
            price: price.toString(),
            total: Number(total.toFixed(2)),
            subtotal: Number(subtotal.toFixed(2)),
          }
          updatedProduct.detractionAmount =
            calculateDetractionAmount(updatedProduct)
          return updatedProduct
        }
        return p
      })
      return {
        products: newProducts,
        totals: calculateTotals(newProducts),
      }
    }),
  updateProductTotal: (productId: number, total: number) =>
    set((state) => {
      const newProducts = state.products.map((p) => {
        if (p.productId === productId) {
          if (total === 0) {
            const updatedProduct = {
              ...p,
              quantity: 0,
              total: 0,
              subtotal: 0,
            }
            updatedProduct.detractionAmount =
              calculateDetractionAmount(updatedProduct)
            return updatedProduct
          }

          const totalBig = new Big(total)
          const price = new Big(p.price)

          // Si el precio es 0, no podemos calcular la cantidad
          if (price.eq(0)) {
            return p
          }

          const quantity = totalBig.div(price)
          const subtotal = totalBig.div(new Big(1.18))
          const updatedProduct = {
            ...p,
            quantity: Number.parseFloat(quantity.toFixed(6)),
            total: Number.parseFloat(totalBig.toFixed(2)),
            subtotal: Number.parseFloat(subtotal.toFixed(2)),
          }
          updatedProduct.detractionAmount =
            calculateDetractionAmount(updatedProduct)
          return updatedProduct
        }
        return p
      })
      return {
        products: newProducts,
        totals: calculateTotals(newProducts),
      }
    }),
  setTotals: () =>
    set((state) => ({
      totals: calculateTotals(state.products),
    })),
  setDerivedTotals: (retentionAmount: number, totalToPay: number) =>
    set((state) => ({
      totals: {
        ...state.totals,
        retentionAmount,
        totalToPay,
      },
    })),
  resetProduct: () =>
    set({
      products: [],
      totals: {
        subtotal: 0,
        igv: 0,
        total: 0,
        freeTransfer: 0,
        detraction: 0,
        retentionAmount: 0,
        totalToPay: 0,
      },
      referenceDocument: "",
      isValidAdvancePayment: true,
    }),
}))
