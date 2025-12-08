import { fetchData } from "@/shared/lib/fetch-data";
import { SalesProduct } from "../lib/promotion.types";

interface ProductResponse {
  success: boolean;
  message: string;
  data: SalesProduct[];
}

export const getProducts = async (): Promise<SalesProduct[]> => {
  try {
    const response = await fetchData<ProductResponse>({
      url: "/products",
    });
    

    
    if (Array.isArray(response)) {

      return response as SalesProduct[];
    }
    
    // Si es un objeto con data
    if (response && response.data && Array.isArray(response.data)) {

      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};