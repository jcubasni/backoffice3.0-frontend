import { Plus, Package, X } from "lucide-react";
import { ProductGroup } from "../../../lib/promotion.types";

interface ProductGroupsSectionProps {
  productGroups: ProductGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (id: string) => void;
}

export default function ProductGroupsSection({
  productGroups,
  onAddGroup,
  onRemoveGroup,
}: ProductGroupsSectionProps) {
  return (
    <div className="space-y-3 ">
      <div className="flex justify-between items-center px-4">
        <label className="text-sm font-semibold text-gray-700">
          Grupos de Productos
        </label>
        <button
          type="button"
          onClick={onAddGroup}
          className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Grupo
        </button>
      </div>

      {productGroups.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">
            No hay grupos de productos. Haz clic en "Agregar Grupo" para crear uno.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {productGroups.map((group) => (
            <div
              key={group.id}
              className="border border-gray-200 rounded-md p-3 bg-blue-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-sm">{group.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveGroup(group.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                {group.products.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}