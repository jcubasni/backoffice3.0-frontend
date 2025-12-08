export type ByPaymentType = {
  venta_id: string
  fecha_emision: string
  tipo_documento: string
  serie: string
  correlativo: string
  doc_identidad: string
  ruc_dni: string
  cliente: string
  total_venta: number
  moneda: string
  tipo_pago: string
  forma_pago: string
  placa_vehiculo: string
}

export type ByDeposit = {
  caja_id: string
  fecha: string
  responsable: string
  turno: string
  terminal: string
  depositado: number
  total_billetes: number
  total_monedas: number
  total: number
  por_depositar: number
}

