// promotions/components/modal/create-gift-group-modal.tsx
import { useState } from "react";
import { X, Gift } from "lucide-react";
import { SalesProduct, PromotionBonus } from "../../lib/promotion.types";

interface CreateGiftGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, minQuantity: number, bonuses: PromotionBonus[]) => void;
  availableProducts: SalesProduct[];
}

interface SelectedGift extends SalesProduct {
  quantity: number;
}

export default function CreateGiftGroupModal({
  isOpen,
  onClose,
  onSave,
  availableProducts,
}: CreateGiftGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [minQuantity, setMinQuantity] = useState<number>(1);
  const [selectedGifts, setSelectedGifts] = useState<SelectedGift[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = availableProducts.filter((p) =>
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGiftToggle = (product: SalesProduct) => {
    setSelectedGifts((prev) => {
      const existing = prev.find((p) => p.productId === product.productId);
      if (existing) {
        return prev.filter((p) => p.productId !== product.productId);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedGifts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, quantity: quantity > 0 ? quantity : 1 }
          : p
      )
    );
  };

  const handleSave = () => {
    if (groupName.trim() && selectedGifts.length > 0 && minQuantity > 0) {
      const bonuses: PromotionBonus[] = selectedGifts.map((product) => ({
        productId: product.productId,
        description: `${product.description} GRATIS`,
        quantity: product.quantity,
      }));

      onSave(groupName, minQuantity, bonuses);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setGroupName("");
    setMinQuantity(1);
    setSelectedGifts([]);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Crear Grupo de Regalos
          </h3>
          <X
            className="w-6 h-6 cursor-pointer hover:text-gray-600"
            onClick={() => {
              handleReset();
              onClose();
            }}
          />
        </div>

        {/* Nombre del grupo */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Nombre del Grupo
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Ej: Regalo por 10 unidades"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Buscar productos */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Seleccionar Regalos
          </label>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm
                  ? "No se encontraron productos"
                  : "No hay productos disponibles"}
              </div>
            ) : (
              filteredProducts.map((product) => {
                const selected = selectedGifts.find(
                  (p) => p.productId === product.productId
                );
                return (
                  <div
                    key={product.productId}
                    className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                      selected ? "bg-green-50" : ""
                    }`}
                    onClick={() => handleGiftToggle(product)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => handleGiftToggle(product)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />

                      <div className="flex-1">
                        <span className="font-medium">{product.description}</span>
                        <div className="flex gap-3 text-sm text-gray-600 mt-1">
                          <span>S/ {product.price.toFixed(2)}</span>
                          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                            {product.measurementUnit}
                          </span>
                          <span className="text-xs">Stock: {product.stock}</span>
                        </div>
                      </div>

                      {selected && (
                        <input
                          type="number"
                          min={1}
                          value={selected.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.productId,
                              parseInt(e.target.value) || 1
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 px-2 py-1 rounded-full border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Regalos seleccionados */}
        {selectedGifts.length > 0 && (
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Regalos seleccionados: {selectedGifts.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedGifts.map((product) => (
                <span
                  key={product.productId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {product.description} x {product.quantity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            disabled={!groupName.trim() || selectedGifts.length === 0 || minQuantity < 1}
            className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Crear Grupo de Regalos
          </button>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
