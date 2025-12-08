import Big from "big.js"
import { format } from "date-fns"
import { DetailResponse } from "@/app/sales/types/sale"
import { InstallmentDTO, NotesProduct } from "../types/notes.type"

export function fromDetailsToProducts(
  details: DetailResponse[],
): NotesProduct[] {
  return details.map((detail) => {
    const quantity = new Big(detail.quantity)
    const price = new Big(detail.unitPrice)
    const total = quantity.times(price)
    const subtotal = total.div(new Big(1.18))

    return {
      id: detail.id,
      productCode: detail.productCode || "",
      description: detail.productForeignName || "",
      measurementUnit: detail.measurementUnit || "",
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      subtotal: Number(subtotal.toFixed(2)),
      total: Number(total.toFixed(2)),
    }
  })
}

export function fromDetailsToInstallments(
  installedCount: number,
  totalAmount: number,
  startDate?: Date,
  endDate?: Date,
): InstallmentDTO[] {
  if (!startDate || !endDate) return []
  const installments: InstallmentDTO[] = []

  const timeDifference = endDate.getTime() - startDate.getTime()
  const totalDays = Math.floor(timeDifference / (1000 * 3600 * 24))

  const intervalDays = Math.floor(totalDays / installedCount)

  const newAmount = totalAmount / installedCount

  for (let i = 0; i < installedCount; i++) {
    const newDueDate = new Date(startDate)
    newDueDate.setDate(startDate.getDate() + intervalDays * (i + 1))

    const newDueDateString = format(newDueDate, "yyyy-MM-dd")
    installments.push({
      newDueDate: newDueDateString,
      newAmount: newAmount,
    })
  }

  return installments
}
