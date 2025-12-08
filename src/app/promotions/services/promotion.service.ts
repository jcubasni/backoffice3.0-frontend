// src/app/promotions/services/promotion.service.ts

import { fetchData } from "@/shared/lib/fetch-data";
import { PromotionFormData } from "../lib/promotion.types";
import { GetPromotionsParams, GetPromotionsResponse } from "../lib/list-promotions.type";

// Crear promoción
export const addPromotion = async (body: PromotionFormData): Promise<any> => {
  const response = await fetchData<any>({
    url: "/promotions", 
    method: "POST",
    body,
  });
  
  return response;
};

export const getPromotions = async (params?: GetPromotionsParams): Promise<GetPromotionsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params?.endDate) {
    queryParams.append('endDate', params.endDate);
  }

  const url = `/promotions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetchData<GetPromotionsResponse>({
    url,
    method: "GET",
  });
  
  return response;
};

export const deletePromotion = async (promotionId: string): Promise<any> => {
  const response = await fetchData<any>({
    url: `/promotions/${promotionId}`,
    method: "DELETE",
  });
  
  return response;
};