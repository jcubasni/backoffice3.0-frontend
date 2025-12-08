// promotions/components/new-promotion/sections/info.tsx
import { InputForm } from "@/shared/components/form/input-form";

export default function Info() {
  return (
    <>
      <div>
        <section className="flex gap-2 justify-center">
          <InputForm 
            name="description" // ✅ Cambiado de "DescriptionPromotion" a "description"
            label="Descripción de la promoción"
            placeholder="Descripción..."
            required
            className="flex-1"
            classContainer="flex-1"
          />
          <InputForm 
            name="note" // ✅ Cambiado de "observationsPromotion" a "note"
            label="Observaciones"
            placeholder="Escribe detalladamente..."
            className="flex-2"
            classContainer="flex-2"
          />
        </section>
      </div>
    </>
  );
}