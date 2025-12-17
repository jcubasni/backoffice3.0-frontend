// src/app/accounts/hooks/useUbigeoService.ts
import { useQuery } from "@tanstack/react-query"
import {
  getUbigeoDepartments,
  getUbigeoProvincesByDepartment,
  getUbigeoDistrictsByProvince,
  getUbigeoDistrictById,
} from "../services/ubigeo.service"

export const ubigeoKeys = {
  departments: ["ubigeo", "departments"] as const,
  provinces: (departmentId: string) => ["ubigeo", "provinces", departmentId] as const,
  districts: (departmentId: string, provinceId: string) =>
    ["ubigeo", "districts", departmentId, provinceId] as const,
  districtById: (districtId: string) =>
    ["ubigeo", "districtById", districtId] as const,
}

export const useGetDepartments = () =>
  useQuery({ queryKey: ubigeoKeys.departments, queryFn: getUbigeoDepartments })

export const useGetProvinces = (departmentId?: string) =>
  useQuery({
    queryKey: ubigeoKeys.provinces(departmentId ?? ""),
    queryFn: () => getUbigeoProvincesByDepartment(departmentId!),
    enabled: !!departmentId,
  })

export const useGetDistricts = (departmentId?: string, provinceId?: string) =>
  useQuery({
    queryKey: ubigeoKeys.districts(departmentId ?? "", provinceId ?? ""),
    queryFn: () => getUbigeoDistrictsByProvince(departmentId!, provinceId!),
    enabled: !!departmentId && !!provinceId,
  })

export const useGetDistrictById = (districtId?: string) =>
  useQuery({
    queryKey: ubigeoKeys.districtById(districtId ?? ""),
    queryFn: () => getUbigeoDistrictById(districtId!),
    enabled: !!districtId,
  })
