// promotions/components/form-promotion.tsx
import { useState } from "react";
import { FormWrapper } from "@/shared/components/form/form-wrapper";
import { useAddPromotion } from "../hooks/useAddPromotion";
import { useProductGroups } from "../hooks/useProductGroups";
import { useGiftGroups } from "../hooks/useGiftGroups";
import { useProducts } from "../hooks/useProducts";
import Dates from "./new-promotion/sections/dates";
import Info from "./new-promotion/sections/info";
import Amount from "./new-promotion/sections/amount";
import Locals from "./new-promotion/sections/locals";
import ProductGroupsSection from "./new-promotion/sections/product-groups";
import GiftGroupsSection from "./new-promotion/sections/gift-groups";
import CreateProductGroupModal from "./modal/create-product-group-modal";
import CreateGiftGroupModal from "./modal/create-gift-group-modal";
import { PromotionFormSchema } from "../lib/promotion.schema";
import { PromotionType } from "../lib/promotion.types";
import { Loader2 } from "lucide-react";

export default function FormPromotion() {
  const { form, handleSubmit, addPromotionMutation } = useAddPromotion();
  const { products, isLoading: isLoadingProducts } = useProducts();

  const { productGroups, addProductGroup, removeProductGroup } =
    useProductGroups();

  const { giftGroups, addGiftGroup, removeGiftGroup } = useGiftGroups();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  const onSubmit = (data: PromotionFormSchema) => {
    const allItems = productGroups.flatMap((group) => group.products);
    const allBonuses = giftGroups.flatMap((group) => group.gifts);

    // Validar que haya productos, regalos y locales
    if (allItems.length === 0 || allBonuses.length === 0 || data.locals.length === 0) {
      return; // El botón ya está deshabilitado
    }

    const promotionData = {
      description: data.description,
      locals: data.locals,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note,
      discountPercent: data.amount,
      type: PromotionType.DEFAULT,
      items: allItems,
      bonuses: allBonuses,
    };

    handleSubmit(promotionData);
  };

  // Mostrar loader mientras cargan los productos
  if (isLoadingProducts) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <FormWrapper
        form={form}
        className="flex-1 gap-4 overflow-auto rounded-md border bg-card text-card-foreground p-4 flex-col"
        onSubmit={onSubmit}
      >
        <div className="flex box-border h-full overflow-auto flex-col">
          <h2 className="font-semibold">Promoción</h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-center flex-col gap-2">
              <Info />
              
              <Locals />

              <div className="flex gap-4 justify-center">
                <Dates />
                <Amount />
              </div>
            </div>

            <div className="flex justify-around gap-2">
              <div className="flex-1">
                <ProductGroupsSection
                  productGroups={productGroups}
                  onAddGroup={() => setIsProductModalOpen(true)}
                  onRemoveGroup={removeProductGroup}
                />
              </div>

              <div className="flex-1">
                <GiftGroupsSection
                  giftGroups={giftGroups}
                  onAddGroup={() => setIsGiftModalOpen(true)}
                  onRemoveGroup={removeGiftGroup}
                />
              </div>
            </div>
            <div className="justify-center h-full items-end flex">
              <button
                className="items-end flex p-2 bg-blue-500 text-white rounded-md hover:cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="submit"
                disabled={
                  addPromotionMutation.isPending ||
                  productGroups.length === 0 ||
                  giftGroups.length === 0 ||
                  (form.watch("locals")?.length || 0) === 0
                }
              >
                {addPromotionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar promoción"
                )}
              </button>
            </div>
          </div>
        </div>
      </FormWrapper>

      {/* Modales - Solo se abren cuando hay productos cargados */}
      <CreateProductGroupModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={addProductGroup}
        availableProducts={products}
      />

      <CreateGiftGroupModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        onSave={addGiftGroup}
        availableProducts={products}
      />
    </div>
  );
}