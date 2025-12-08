// src/app/promotions/lib/list-promotions.type.ts

export interface PromotionItemType {
  id: number;
  name: string;
}

export interface PromotionUnitType {
  id: number | null;
  name: string;
}

export interface PromotionProduct {
  id: number;
  description: string;
}

export interface PromotionSummary {
  id: string;
  sequenceGroup: number;
  promotionGroupId: number;
  description: string;
  itemType: PromotionItemType;
  unitType: PromotionUnitType;
  quantity: number;
  cost: number;
  price: number;
  unitCost: number;
  unitPrice: number;
  status: number;
}

export interface PromotionItem {
  id: string;
  product: PromotionProduct;
  groupId: string | null;
  quantity: number;
  cost: number;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  listNumber: number | null;
  stock: number;
  minimumQuantity?: number;
  status: number;
  unitType: PromotionUnitType;
}

export interface PromotionBonus {
  id: string;
  product: PromotionProduct;
  groupId: string | null;
  quantity: number;
  cost: number;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  listNumber: number | null;
  stock: number;
  status: number;
  unitType: PromotionUnitType;
}

export interface Promotion {
  promotionId: string;
  description: string;
  localId: string;
  localName: string;
  promotionType: number;
  paymentType: number | null;
  status: number;
  itemCount: number;
  bonusCount: number;
  discountPercent: number;
  itemCost: number;
  bonusCost: number;
  itemPrice: number;
  bonusPrice: number;
  factor: number;
  salesLevel: string | null;
  controlledGiftFlag: boolean;
  managerialExchangeRate: number;
  note: string;
  startDate: string;
  endDate: string;
  newEndDate: string;
  previousPromotionId: string | null;
  bulkId: string | null;
  channelId: string | null;
  channelDetailId: string | null;
  summaries: PromotionSummary[];
  items: PromotionItem[];
  bonuses: PromotionBonus[];
}

export interface GetPromotionsParams {
  startDate?: string;
  endDate?: string;
}

export interface GetPromotionsResponse {
  success: boolean;
  message: string;
  data: Promotion[];
}