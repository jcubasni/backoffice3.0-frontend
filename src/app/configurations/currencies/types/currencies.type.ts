export interface Currency {
  idCurrency: number
  currencyCode: string
  currencyType: string
  simpleDescription: string
  completeDescription: string
}

// Tipo usado al agregar/editar (DTO)
export interface AddMaintenanceCurrencyDTO {
  currencyCode: string
  currencyType: string
  simpleDescription: string
  completeDescription: string
}
