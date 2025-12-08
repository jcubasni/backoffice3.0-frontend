// src/app/pdf/components/hooks/types.ts

export interface SaleReportRow {
  periodo: string
  correlativo: string
  fechaEmision: string
  tipoComprobante: string
  serie: string
  numero: string
  clienteDocTipo: string
  clienteDocNumero: string
  clienteNombre: string
  baseGravada: number
  exonerada: number
  inafecto: number
  igv: number
  totalComprobante: number
}

export interface CanceledSaleRow {
  localCodigo: string
  tipoDocumento: string
  nroDocumento: string
  fechaDocumento: string
  fechaSistema: string
  usuario: string
  clienteNombre: string
  articulo: string
  grupo: string
  cantidad: number
  precio: number
  subtotal: number
  impuesto: number
  total: number
  usuarioAnula: string
  fechaAnulacion: string
}

export interface ShortageOverageRow {
  fecha: string
  codigo: string
  nombre: string
  turno: string
  deposito: number
  ventas: number
  faltSobr: number
}
