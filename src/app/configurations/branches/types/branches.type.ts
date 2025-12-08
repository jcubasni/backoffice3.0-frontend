export type Branch = {
  idLocal: string
  name: string
  localCode: string | null
  telphoneNumber: string | null
  address: string
  ruc: string | null
  ubigeo: string | null
  province: string | null
  departament: string | null
  localName: string
  countryCode: string | null
  urbanizacion: string | null
  phoneNumber: string | null
  email: string | null
}

export type AddBranchDTO = Pick<
  Branch,
  "localCode" | "localName" | "address" | "email" | "name" | "telphoneNumber"
>
