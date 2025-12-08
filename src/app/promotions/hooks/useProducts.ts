
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product.service";

export const useProducts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    products: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
};