// promotions/components/modal/create-product-group-modal.tsx
import { useState } from "react";
import { X, Package } from "lucide-react";
import { SalesProduct, PromotionItem } from "../../lib/promotion.types";

interface CreateProductGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, items: PromotionItem[]) => void;
  availableProducts: SalesProduct[];
}

export default function CreateProductGroupModal({
  isOpen,
  onClose,
  onSave,
  availableProducts,
}: CreateProductGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SalesProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = availableProducts.filter((p) =>
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (productId: number) =>
    selectedProducts.some((p) => p.productId === productId);

  const handleProductToggle = (product: SalesProduct) => {
    setSelectedProducts((prev) => {
      const selected = prev.some((p) => p.productId === product.productId);
      if (selected) {
        return prev.filter((p) => p.productId !== product.productId);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleSave = () => {
    if (groupName.trim() && selectedProducts.length > 0) {
      const items: PromotionItem[] = selectedProducts.map((product) => ({
        productId: product.productId,
        description: product.description,

      }));

      onSave(groupName, items);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setGroupName("");
    setSelectedProducts([]);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Crear Grupo de Productos
          </h3>
          <X
            className="w-6 h-6 cursor-pointer hover:text-gray-600"
            onClick={() => {
              handleReset();
              onClose();
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nombre del Grupo
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ej: Promo 2x1 Bebidas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Seleccionar Productos
            </label>
            
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? "No se encontraron productos" : "No hay productos disponibles"}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.productId}
                    className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                      isSelected(product.productId) ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleProductToggle(product)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected(product.productId)}
                        onChange={() => handleProductToggle(product)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      
                      <div className="flex-1">
                        <span className="font-medium block">{product.description}</span>
                        <div className="flex gap-3 text-sm text-gray-600 mt-1">
                          <span>S/ {product.price.toFixed(2)}</span>
                          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                            {product.measurementUnit}
                          </span>
                          <span className="text-xs">Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Productos seleccionados: {selectedProducts.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((product) => (
                  <span
                    key={product.productId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {product.description}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              disabled={!groupName.trim() || selectedProducts.length === 0}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Crear Grupo
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
    </div>
  );
}