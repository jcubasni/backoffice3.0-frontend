// promotions/components/new-promotion/sections/dates.tsx
import { useState } from "react";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { useFormContext } from "react-hook-form";

export default function Dates() {
  const { setValue } = useFormContext();
  const [startDate, setStartDate] = useState("2025-11-01");
  const [endDate, setEndDate] = useState("2026-11-30");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex gap-4 w-full">
      <div className="">
        <DatePicker 
          className="w-full"
          label="Fecha inicio"
          defaultValue={startDate}
          min={today}
          onSelect={(date) => {
            if (date) {
              const isoDate = date.toISOString();
              setStartDate(date.toISOString().split("T")[0]);
              setValue("startDate", isoDate); // ✅ Guardar en el formulario
            }
          }}
        />
      </div>

      <div className="">
        <DatePicker 
          label="Fecha fin"
          defaultValue={endDate}
          min={new Date(startDate)}
          onSelect={(date) => {
            if (date) {
              const isoDate = date.toISOString();
              setEndDate(date.toISOString().split("T")[0]);
              setValue("endDate", isoDate); // ✅ Guardar en el formulario
            }
          }}
        />
      </div>
    </div>
  );
}