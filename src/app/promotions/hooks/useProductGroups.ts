import { useState } from "react";
import { ProductGroup, PromotionItem } from "../lib/promotion.types";

export const useProductGroups = () => {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);

  const addProductGroup = (name: string, products: PromotionItem[]) => {
    const newGroup: ProductGroup = {
      id: Date.now().toString(),
      name,
      products,
    };
    setProductGroups((prev) => [...prev, newGroup]);
  };

  const removeProductGroup = (id: string) => {
    setProductGroups((prev) => prev.filter((group) => group.id !== id));
  };

  return {
    productGroups,
    addProductGroup,
    removeProductGroup,
  };
};