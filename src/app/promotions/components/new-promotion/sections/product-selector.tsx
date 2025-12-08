// promotions/components/new-promotion/sections/product-selector.tsx
import { useState } from "react";
import { SalesProduct } from "../../../lib/promotion.types";
import { X } from "lucide-react";

interface ProductSelectorProps {
  availableProducts: SalesProduct[];
  selectedProducts: SalesProduct[];
  onProductToggle: (product: SalesProduct) => void;
  label: string;
  showQuantity?: boolean;
  onQuantityChange?: (productId: number, quantity: number) => void;
  quantities?: Record<number, number>;
}

export default function ProductSelector({
  availableProducts,
  selectedProducts,
  onProductToggle,
  label,
  showQuantity = false,
  onQuantityChange,
  quantities = {},
}: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = availableProducts.filter((p) =>
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("filteredProducts:", filteredProducts);
  console.log("filteredProducts.length:", filteredProducts.length);

  const isSelected = (productId: number) =>
    selectedProducts.some((p) => p.productId === productId);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
        {filteredProducts.map((product) => (
          <div
            key={product.productId}
            className={`p-3 border-b last:border-b-0 ${
              isSelected(product.productId) ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div
                onClick={() => onProductToggle(product)}
                className="flex-1 cursor-pointer"
              >
                <span className="font-medium">{product.description}</span>
                <div className="flex gap-2 items-center text-sm text-gray-600">
                  <span>S/ {product.price.toFixed(2)}</span>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                    {product.measurementUnit}
                  </span>
                  <span className="text-xs">Stock: {product.stock}</span>
                </div>
              </div>

              {showQuantity &&
                isSelected(product.productId) &&
                onQuantityChange && (
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.productId] || 1}
                    onChange={(e) =>
                      onQuantityChange(
                        product.productId,
                        Number(e.target.value)
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                )}

              {isSelected(product.productId) && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ml-2">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <span
              key={product.productId}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {product.description}
              {showQuantity && quantities[product.productId] && (
                <span className="text-xs font-semibold">
                  x{quantities[product.productId]}
                </span>
              )}
              <X
                className="w-4 h-4 cursor-pointer hover:text-blue-600"
                onClick={() => onProductToggle(product)}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
