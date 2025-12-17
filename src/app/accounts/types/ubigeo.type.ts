export type UbigeoItem = {
  id: string
  name: string
}

export type UbigeoDistrictSearchItem = {
  id: string
  name: string
  province: UbigeoItem
  department: UbigeoItem
}

export type UbigeoDistrictById = UbigeoDistrictSearchItem
