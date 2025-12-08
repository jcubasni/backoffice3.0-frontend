import { fetchData } from "@/shared/lib/fetch-data"
import { ProductByGroupProduct, ProductResponse } from "../types/product.type"

export const getProducts = async (): Promise<ProductResponse[]> => {
  const response = await fetchData<ProductResponse[]>({
    url: "/products",
  })
  return response
}

export const getProductsByGroupProduct = async (
  groupProductId: string[],
): Promise<ProductByGroupProduct[]> => {
  const response = await fetchData<ProductByGroupProduct[]>({
    url: "/products/by-group",
    params: { groupProductId },
  })
  return response
}
