// src/app/promotions/hooks/usePromotions.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPromotions, deletePromotion } from '../services/promotion.service';
import { GetPromotionsParams } from '../lib/list-promotions.type';
import { toast } from 'sonner';

export const usePromotions = (params?: GetPromotionsParams) => {
  return useQuery({
    queryKey: ['promotions', params],
    queryFn: () => getPromotions(params),
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promoción eliminada exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar la promoción');
    },
  });
};