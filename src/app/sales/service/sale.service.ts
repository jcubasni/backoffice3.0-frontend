import { ProductResponse } from "@/app/products/types/product.type"
import { fetchData } from "@/shared/lib/fetch-data"
import {
  AdvanceResponse,
  DateFilters,
  DocumentResponse,
  SaleDTO,
  SaleResponse,
  SaleType,
} from "../types/sale"

export const getSales = async (
  params: DateFilters,
): Promise<SaleResponse[]> => {
  return await fetchData<SaleResponse[]>({
    url: "/sales",
    params,
  })
}

export const getSaleTypes = async (
  saleDocumentType: number,
): Promise<SaleType[]> => {
  return await fetchData<SaleType[]>({
    url: `/sales/sale-types/${saleDocumentType}`,
  })
}

export const addSale = async (body: SaleDTO): Promise<void> => {
  return await fetchData<void>({
    method: "POST",
    url: "/sales",
    body,
  })
}

export const getProductsToSale = async (): Promise<ProductResponse[]> => {
  const response = await fetchData<ProductResponse[]>({
    url: "/products/sale",
  })
  return response
}

export const getAntipatesByClientId = async (
  clientId: string,
  term?: string,
): Promise<AdvanceResponse[]> => {
  const response = await fetchData<AdvanceResponse[]>({
    url: `/sales/invoice/anticipo/client/${clientId}`,
    params: { term },
  })
  return response
}

export const getDocumentByDocumentNumber = async (
  documentNumber: string,
): Promise<DocumentResponse> => {
  const response = await fetchData<DocumentResponse>({
    url: `/sales/document/${documentNumber}`,
  })
  return response
}
