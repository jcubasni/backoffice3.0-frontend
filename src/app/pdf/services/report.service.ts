// src/modules/reports/services/reports.service.ts
import { fetchData } from "@/shared/lib/fetch-data"

export interface SalesReport {
  periodo: string
  correlativo: number
  fechaEmision: string
  tipoComprobante: string
  denominacionTipoDocumento: string
  serie: string
  numero: string
  clienteDocTipo: number
  clienteDocNumero: string
  clienteNombre: string
  baseGravada: number
  exonerada: number
  inafecto: number
  igv: number
  totalComprobante: number
}

export interface CanceledSalesReport {
  localCodigo: string
  tipoDocumento: string
  nroDocumento: string
  fechaDocumento: string
  fechaSistema: string
  nroPunto: string
  usuario: string
  documentoCliente: string
  clienteNombre: string
  codigoArticulo: string | null
  articulo: string
  grupo: string
  unidadMedida: string
  cantidad: number
  precio: number
  moneda: string
  subtotal: number
  impuesto: number
  total: number
  dscto: number
  tipoCambio: number
  dsTipoDoc: string
  usuarioAnula: string
  fechaAnulacion: string
}

export interface ShortageOverageReport {
  fecha: string
  codigo: string
  nombre: string
  turno: string
  deposito: number
  ventas: number
  faltSobr: number
}

export const getSalesReport = async (
  startDate: string,
  endDate: string,
  docTypes: string[] = [],
): Promise<SalesReport[]> => {
  const res = await fetchData<SalesReport[]>({
    url: "/reports/sales",
    params: { startDate, endDate, docTypes },
  })
  return res
}

export const getCanceledSalesReport = async (
  startDate: string,
  endDate: string,
  docTypes: string[] = [],
): Promise<CanceledSalesReport[]> => {
  const res = await fetchData<CanceledSalesReport[]>({
    url: "/reports/canceled-sales",
    params: { startDate, endDate, docTypes },
  })
  return res
}

export const getShortageOverageReport = async (
  startDate: string,
  endDate: string,
): Promise<ShortageOverageReport[]> => {
  const res = await fetchData<ShortageOverageReport[]>({
    url: "/reports/shortage-overage",
    params: { startDate, endDate },
  })
  return res
}
