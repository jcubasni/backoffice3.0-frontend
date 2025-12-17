import { fetchData } from "@/shared/lib/fetch-data"
import type {
  UbigeoItem,
  UbigeoDistrictSearchItem,
  UbigeoDistrictById,
} from "../types/ubigeo.type"

/** ✅ 1) Listar departamentos */
export const getUbigeoDepartments = async (): Promise<UbigeoItem[]> => {
  return fetchData<UbigeoItem[]>({
    url: "/ubigeo/departments",
  })
}

/** ✅ 2) Listar provincias por departamento */
export const getUbigeoProvincesByDepartment = async (
  departmentId: string,
): Promise<UbigeoItem[]> => {
  return fetchData<UbigeoItem[]>({
    url: `/ubigeo/departments/${departmentId}/provinces`,
  })
}

/** ✅ 3) Listar distritos por provincia (requiere departmentId + provinceId) */
export const getUbigeoDistrictsByProvince = async (
  departmentId: string,
  provinceId: string,
): Promise<UbigeoItem[]> => {
  return fetchData<UbigeoItem[]>({
    url: `/ubigeo/departments/${departmentId}/provinces/${provinceId}/districts`,
  })
}

/** ✅ 4) Buscar distrito por nombre (q=...) */
export const searchUbigeoDistricts = async (
  q: string,
): Promise<UbigeoDistrictSearchItem[]> => {
  return fetchData<UbigeoDistrictSearchItem[]>({
    url: "/ubigeo/districts/search",
    params: { q },
  })
}

/** ✅ 5) Obtener distrito por id */
export const getUbigeoDistrictById = async (
  districtId: string,
): Promise<UbigeoDistrictById> => {
  return fetchData<UbigeoDistrictById>({
    url: `/ubigeo/districts/${districtId}`,
  })
}
