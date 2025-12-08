import { useState } from "react";
import { GiftGroup, PromotionBonus } from "../lib/promotion.types";

export const useGiftGroups = () => {
  const [giftGroups, setGiftGroups] = useState<GiftGroup[]>([]);

  const addGiftGroup = (name: string, minQuantity: number, gifts: PromotionBonus[]) => {
    const newGroup: GiftGroup = {
      id: Date.now().toString(),
      name,
      minQuantity,
      gifts,
    };
    setGiftGroups((prev) => [...prev, newGroup]);
  };

  const removeGiftGroup = (id: string) => {
    setGiftGroups((prev) => prev.filter((group) => group.id !== id));
  };

  return {
    giftGroups,
    addGiftGroup,
    removeGiftGroup,
  };
};