import { Plus, Gift, X } from "lucide-react";
import { GiftGroup } from "../../../lib/promotion.types";

interface GiftGroupsSectionProps {
  giftGroups: GiftGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (id: string) => void;
}

export default function GiftGroupsSection({
  giftGroups,
  onAddGroup,
  onRemoveGroup,
}: GiftGroupsSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-4">
        <label className="text-sm font-semibold text-gray-700">
          Grupos de Regalos
        </label>
        <button
          type="button"
          onClick={onAddGroup}
          className="flex items-center gap-1 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Regalos
        </button>
      </div>

      {giftGroups.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Gift className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">
            No hay regalos configurados. Haz clic en "Agregar Regalos" para crear uno.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {giftGroups.map((group) => (
            <div
              key={group.id}
              className="border border-gray-200 rounded-md p-3 bg-green-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-600" />
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
              <p className="text-xs text-gray-600 mb-2">
                Por cada {group.minQuantity} productos
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                {group.gifts.map((gift, idx) => (
                  <div key={idx}>
                    • {gift.description}
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