import { subMonths } from "date-fns"

export const Dates = {
  DetailBoxesStart: subMonths(new Date(), 1),
  DetailBoxesEnd: new Date(),
  SaleStart: subMonths(new Date(), 2),
  SaleEnd: new Date(),
} as const
