import { useQuery } from "@tanstack/react-query"
import {
  getProducts,
  getProductsByGroupProduct,
} from "../services/products.service"

export function useGetProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    gcTime: 0,
  })
}

export function useGetFuelProducts() {
  return useQuery({
    queryKey: ["products-by-group"],
    queryFn: () => getProductsByGroupProduct(["00999"]),
    gcTime: 0,
  })
}
