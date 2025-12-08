// promotions/hooks/useAddPromotion.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { promotionFormSchema, PromotionFormSchema } from "../lib/promotion.schema";
import { addPromotion } from "../services/promotion.service";
import { PromotionFormData } from "../lib/promotion.types";
import { toast } from "sonner";
import { Routes } from "@/shared/lib/routes";

export const useAddPromotion = () => {
  const navigate = useNavigate();
  
  const form = useForm<PromotionFormSchema>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      description: "",
      locals: [],
      startDate: "",
      endDate: "",
      note: "",
      amount: 0,
    },
  });

  const addPromotionMutation = useMutation({
    mutationFn: (data: PromotionFormData) => addPromotion(data),
    onSuccess: () => {
      toast.success("Promoción creada exitosamente");
      navigate({ to: Routes.Promotion }); //
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al crear la promoción");
    },
  });

  const handleSubmit = (data: PromotionFormData) => {
    addPromotionMutation.mutate(data);
  };

  return {
    form,
    handleSubmit,
    addPromotionMutation,
  };
};