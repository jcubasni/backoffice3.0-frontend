// promotions/lib/promotion.types.ts
import { promotionFormSchema } from "./promotion.schema";

export enum PromotionType {
  DEFAULT = 330008,
  // Agregar más tipos aquí cuando los tengas
}

export interface PromotionItem {
  productId: number;
  description: string;
}

export interface PromotionBonus {
  productId: number;
  description: string;
  quantity: number;
}

export interface PromotionFormData {
  description: string;
  locals: string[];
  startDate: string;
  endDate: string;
  note: string;
  discountPercent: number;
  type: PromotionType;
  items: PromotionItem[];
  bonuses: PromotionBonus[];
}

export interface SalesProduct {
  productId: number;
  description: string;
  price: number;
  measurementUnit: string;
  stateAudit: string;
  productCode: string | null;
  stock: number;
  groupProduct: {
    id: number;
    description: string;
  };
  detractionType: {
    id: number;
    percentage: number;
    description: string;
    documentOperationType: {
      id: number;
      description: string;
    };
  } | null;
}

export interface ProductGroup {
  id: string;
  name: string;
  products: PromotionItem[];
}

export interface GiftGroup {
  id: string;
  name: string;
  minQuantity: number;
  gifts: PromotionBonus[];
}

export interface Branch {
  localId: string;
  localName: string;
  localCode: string;
}
