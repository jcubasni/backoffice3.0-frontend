export interface ReportData {
  printerName: string
  header: { label: string; value: string; format: string }[]
  document: { label: string; value: string; format: string }[]
  items: {
    description: string
    code?: string
    qty?: number
    price?: number
    total: number
  }[]
  totals: { label: string; value: string; format: string }[]
  rendicion: { label: string; value: string }[]
  discountClients: { label: string; value: string }[]
  creditClients: { label: string; value: string }[]
  creditSummary: { label: string; value: string }[]
  cardDetails: { label: string; value: string }[]
  contometros?: {
    lado: string
    producto: string
    contInicial: string
    contFinal: string
    volContometro: string
    volVenta: string
    diferencia: string
  }[]
  ventas_hose?: {
  lado: string
  manguera_producto: string
  precio: number
  cantidad: number
  total: number
}[]

}
