import { TaxDetailDTO } from "./sale.dto"

export enum SaleDocumentType {
  BOLETA = 2,
  FACTURA = 1,
  NOTA_VENTA = 3,
}

export enum OperationType {
  CASH = 1,
  CREDIT = 2,
  INTERNO = 3,
  SERAFIN = 4,
  TRANSFERENCIA_GRATUITA = 5,
  CANJE = 6,
  ANTICIPO = 7,
}

export enum ClientCardType {
  INTERNO = "INTERNO",
  SERAFIN = "SERAFIN",
  EXTERNO = "EXTERNO",
}

export enum PaymentType {
  CASH = 1,
  CREDIT = 2,
}

export enum SalePaymentMethodCode {
  CREDIT = "00000",
  CASH = "00001",
  CARD = "00002",
  CREDIT_NOTE = "00003",
  VOUCHER = "00004",
  WALLET = "00005",
  SERAFIN = "00009",
  CONSUMO_INTERNO = "00008",
  TRANSFERENCIA_GRATUITA = "00010",
  CANJE = "00011",
  ADVANCE = "00012",
}

export const idAdvanceProduct = 9999
export const IGV = 18
export const RetentionPercentage = 3

export const TaxDefault: TaxDetailDTO = {
  type: "IGV",
  amount: IGV,
}

export enum SaleTypeE {
  VENTA_INTERNA = 11,
  RETENCION = 12,
  DETRACCION = 13,
}
