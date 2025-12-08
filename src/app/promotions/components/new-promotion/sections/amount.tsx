
import { InputForm } from "@/shared/components/form/input-form";

export default function Amount() {
  return (
    <div className="w-100">
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Monto Total + IGV (18%)
        </label>
        
        <div className="relative">
          {/* Icono de dinero a la izquierda */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold">
              <span>S/</span>
            </div>
          </div>

          <InputForm //MONTO
            name="amount"
            placeholder="0.00"
            type="number"
            step="0.01"
            min={0}
            className="
              pl-14 pr-4 py-3 
              text-2xl font-bold 
              text-green-900 
              bg-gradient-to-br from-green-50 to-emerald-50
              border-2 border-green-400
              rounded-xl
              shadow-sm
              focus:border-green-600 
              focus:ring-4 
              focus:ring-green-200
              transition-all
              duration-200
            "
            classContainer="w-full"
          />
        </div>

        {/* Texto de ayuda debajo */}
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          Monto mínimo de compra para aplicar la promoción
        </p>
      </div>
    </div>
  );
}