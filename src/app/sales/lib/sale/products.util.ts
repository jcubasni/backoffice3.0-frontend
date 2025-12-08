import Big from "big.js"
import { toast } from "sonner"
import { ProductResponse } from "@/app/products/types/product.type"
import { SalesProduct, Totals } from "@/app/sales/types/product.type"
import { DECIMAL_PLACES } from "@/shared/lib/constans"
import { saleDetailsSchema } from "../../schemas/sale-detail.schema"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import {
  IGV,
  idAdvanceProduct,
  SaleDetailDTO,
  TaxDefault,
} from "../../types/sale"
import { AdvanceDataDTO, DetractionDataDTO } from "../../types/sale/sale.dto"

export const calculateDetractionAmount = (product: SalesProduct): number => {
  if (!product.detractionType?.percentage) return 0

  const total = new Big(product.total || 0)
  const percentage = new Big(product.detractionType.percentage)
  const detractionAmount = total.times(percentage).div(100)

  return Number(detractionAmount.toFixed(DECIMAL_PLACES))
}

export const toSalesProduct = (product: ProductResponse): SalesProduct => {
  const quantity = new Big(1)
  const price = new Big(product.price)
  const subtotal = price
    .div(new Big(1).plus(new Big(IGV).div(100)))
    .times(quantity)
  const igv = price.times(quantity).minus(subtotal)
  const total = subtotal.plus(igv)

  const salesProduct: SalesProduct = {
    ...product,
    quantity: 1,
    total: Number(total.toFixed(DECIMAL_PLACES)),
    subtotal: Number(subtotal.toFixed(DECIMAL_PLACES)),
  }

  salesProduct.detractionAmount = calculateDetractionAmount(salesProduct)

  return salesProduct
}

export const fromProductsToSaleDetails = (
  products: SalesProduct[],
): SaleDetailDTO[] => {
  return products.map((product) => {
    const quantity = new Big(product.quantity)
    const unitPriceWithIGV = new Big(product.price)
    const unitPrice = unitPriceWithIGV.div(
      new Big(1).plus(new Big(IGV).div(100)),
    )
    const subtotal = unitPrice.times(quantity)
    const tax = unitPriceWithIGV.times(quantity).minus(subtotal)
    const grandTotal = subtotal.plus(tax)
    const saleDetail: SaleDetailDTO = {
      taxDetail: TaxDefault,
      productId: Number(product.productId),
      quantity: Number(quantity),
      unitPrice: Number(unitPrice.toFixed(DECIMAL_PLACES)),
      taxAmount: Number(tax.toFixed(DECIMAL_PLACES)),
      grandTotal: Number(grandTotal.toFixed(DECIMAL_PLACES)),
    }

    if (product.detractionType) {
      const baseAmount = Number(grandTotal)
      const percentage = Number(product.detractionType.percentage)
      const detractionAmount = new Big(baseAmount)
        .times(new Big(percentage))
        .div(100)

      saleDetail.detractionData = {
        detractionTypeId: product.detractionType.id,
        baseAmount,
        percentage,
        detractionAmount: Number(detractionAmount.toFixed(DECIMAL_PLACES)),
        accountNumber: "0",
      }
    }

    return saleDetail
  })
}

export const calculateTotals = (products: SalesProduct[]): Totals => {
  const isFreeTransfer = useClientUtilStore.getState().isFreeTransfer
  const filteredProducts = products.filter(
    (product) => product.productId !== idAdvanceProduct,
  )

  if (isFreeTransfer) {
    const totals = filteredProducts.reduce(
      (acc, product) => {
        const quantity = new Big(product.quantity || 1)
        const price = new Big(product.price || 0)
        const productTotal = quantity.times(price)

        const subTotal = productTotal.div(new Big(1.18))
        const igv = productTotal.minus(subTotal)
        const detractionAmount = new Big(product.detractionAmount || 0)

        acc.subtotal = acc.subtotal.plus(subTotal)
        acc.igv = acc.igv.plus(igv)
        acc.total = acc.total.plus(productTotal)
        acc.freeTransfer = acc.freeTransfer.plus(productTotal)
        acc.detraction = acc.detraction.plus(detractionAmount)

        return acc
      },
      {
        subtotal: new Big(0),
        igv: new Big(0),
        total: new Big(0),
        freeTransfer: new Big(0),
        detraction: new Big(0),
      },
    )

    return {
      retentionAmount: 0,
      totalToPay: 0,
      subtotal: Number(totals.subtotal.toFixed(DECIMAL_PLACES)),
      igv: Number(totals.igv.toFixed(DECIMAL_PLACES)),
      total: Number(totals.total.toFixed(DECIMAL_PLACES)),
      freeTransfer: Number(totals.freeTransfer.toFixed(DECIMAL_PLACES)),
      detraction: Number(totals.detraction.toFixed(DECIMAL_PLACES)),
    }
  }

  const totals = filteredProducts.reduce(
    (acc, product) => {
      const quantity = new Big(product.quantity || 1)
      const price = new Big(product.price || 0)
      const productTotal = quantity.times(price)

      const subTotal = productTotal.div(new Big(1.18))
      const igv = productTotal.minus(subTotal)
      const detractionAmount = new Big(product.detractionAmount || 0)

      acc.subtotal = acc.subtotal.plus(subTotal)
      acc.igv = acc.igv.plus(igv)
      acc.total = acc.total.plus(productTotal)
      acc.detraction = acc.detraction.plus(detractionAmount)

      return acc
    },
    {
      subtotal: new Big(0),
      igv: new Big(0),
      total: new Big(0),
      freeTransfer: new Big(0),
      detraction: new Big(0),
    } as {
      subtotal: Big
      igv: Big
      total: Big
      freeTransfer: Big
      detraction: Big
    },
  )

  return {
    retentionAmount: 0,
    totalToPay: 0,
    subtotal: Number(totals.subtotal.toFixed(DECIMAL_PLACES)),
    igv: Number(totals.igv.toFixed(DECIMAL_PLACES)),
    total: Number(totals.total.toFixed(DECIMAL_PLACES)),
    freeTransfer: 0,
    detraction: Number(totals.detraction.toFixed(DECIMAL_PLACES)),
  }
}

export const calculateAdvanceDataAndAmount = (
  products: SalesProduct[],
): { advanceData: AdvanceDataDTO[]; totalUsedAmount: number } => {
  const referenceDocument = useProductStore.getState().referenceDocument
  const { totals } = useProductStore.getState()
  const advanceProducts = products.filter(
    (product) => product.productId === idAdvanceProduct,
  )

  // Use the total from store instead of data.grandTotal
  const grandTotal = totals.total
  const advanceData: AdvanceDataDTO[] = []
  let remainingToPay = grandTotal
  let totalUsedAmount = 0

  for (const product of advanceProducts) {
    if (remainingToPay <= 0) break

    // Ensure productAmount is a valid number
    const productAmount = Number(product.total) || 0
    const appliedAmount = Math.min(productAmount, remainingToPay)

    // Only add to advanceData if appliedAmount is greater than 0
    if (appliedAmount > 0) {
      advanceData.push({
        referenceDocument,
        appliedAmount,
      })
    }

    totalUsedAmount += appliedAmount
    remainingToPay -= appliedAmount
  }

  return { advanceData, totalUsedAmount }
}

export const validateProducts = (products: SalesProduct[]): boolean => {
  const regularProducts = products.filter(
    (product) => product.productId !== idAdvanceProduct,
  )
  const saleDetails = fromProductsToSaleDetails(regularProducts)
  const validation = saleDetailsSchema.safeParse(saleDetails)
  if (!validation.success) {
    toast.error(
      validation.error.errors[0]?.message ||
        "Error en la validación de productos",
    )
    return false
  }

  return true
}

export const calculateRootDetractionData = (
  products: SalesProduct[],
): DetractionDataDTO | undefined => {
  const regularProducts = products.filter(
    (product) => product.productId !== idAdvanceProduct,
  )

  // Filter products that have detraction data
  const productsWithDetraction = regularProducts.filter(
    (product) => product.detractionType,
  )

  // If no products have detraction, return undefined
  if (productsWithDetraction.length === 0) {
    return undefined
  }

  // Use the first product's detraction type as the base
  const firstDetractionType = productsWithDetraction[0].detractionType!

  // Calculate total base amount (sum of all product totals with detraction)
  const totalBaseAmount = productsWithDetraction.reduce((sum, product) => {
    const quantity = new Big(product.quantity)
    const unitPriceWithIGV = new Big(product.price)
    const unitPrice = unitPriceWithIGV.div(
      new Big(1).plus(new Big(IGV).div(100)),
    )
    const subtotal = unitPrice.times(quantity)
    const tax = unitPriceWithIGV.times(quantity).minus(subtotal)
    const grandTotal = subtotal.plus(tax)
    return sum.plus(grandTotal)
  }, new Big(0))

  // Calculate total detraction amount
  const percentage = new Big(firstDetractionType.percentage)
  const totalDetractionAmount = totalBaseAmount.times(percentage).div(100)

  return {
    detractionTypeId: firstDetractionType.id,
    baseAmount: Number(totalBaseAmount.toFixed(DECIMAL_PLACES)),
    percentage: Number(percentage),
    detractionAmount: Number(totalDetractionAmount.toFixed(DECIMAL_PLACES)),
    accountNumber: "0",
  }
}
