"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { MultiSelectForm } from "@/shared/components/form/multi-select-form";
import { ComboSearch } from "@/shared/components/ui/combo-search";
import { parseLocalDate } from "@/shared/lib/date";
import { useFormContext } from "react-hook-form";
import { useClientHelpers } from "@/app/sales/hooks/sale/client/useClient.helper";

interface FilterProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  selectedClient: string | null; // solo id
  setSelectedClient: (clientId: string | null) => void;
  onApply: () => void;
  onOpenPanel: () => void;
  hasData: boolean;
}

export function FiltersPaymentTypeReport({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  selectedClient,
  setSelectedClient,
  onApply,
  onOpenPanel,
  hasData,
}: FilterProps) {
  const { setValue, watch } = useFormContext();
  const docTypes = watch("docTypes");
  const paymentTypes = watch("tipoPago");

  const { handleSearch, clients, filterClients } =
    useClientHelpers();

  return (
    <Card className="rounded-lg bg-white p-6 shadow-md">
      <CardHeader>
        <CardTitle className="font-semibold text-lg">Filtros del reporte</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-4">
        {/* Fechas */}
        <div className="col-span-1 flex flex-row gap-15">
          <DatePicker
            label="Fecha inicio"
            defaultValue={startDate}
            max={new Date()}
            onSelect={(date) =>
              date && setStartDate(date.toISOString().split("T")[0])
            }
          />
          <DatePicker
            label="Fecha fin"
            defaultValue={endDate}
            min={parseLocalDate(startDate)}
            max={new Date()}
            onSelect={(date) =>
              date && setEndDate(date.toISOString().split("T")[0])
            }
          />
        </div>

        {/* Documentos */}
        <div className="col-span-1">
          <MultiSelectForm
            name="docTypes"
            label="Tipo de documento"
            options={[
              { value: "01", label: "Factura" },
              { value: "03", label: "Boleta" },
              { value: "07", label: "Nota de Crédito" },
              { value: "08", label: "Nota de Débito" },
            ]}
            defaultOptions={docTypes}
            onChange={(values) => setValue("docTypes", values)}
            className="w-full"
          />
        </div>

        {/* Tipos de pago */}
        <div className="col-span-1">
          <MultiSelectForm
            name="tipoPago"
            label="Tipo de pago"
            options={[
              { value: "1", label: "Contado" },
              { value: "2", label: "Crédito" },
            ]}
            defaultOptions={paymentTypes}
            onChange={(values) => setValue("tipoPago", values)}
            className="w-full"
          />
        </div>

        {/* Cliente */}
        <div className="col-span-2">
          <ComboSearch
            label="Cliente"
            placeholder="Buscar cliente..."
            options={clients} // { label, value }
            value={selectedClient || ""} // solo id
            onSearch={handleSearch}
            onSelect={(id) => setSelectedClient(id)} // id del cliente
            onDeselect={() => setSelectedClient(null)}
            isLoading={filterClients.isLoading}
            classContainer="w-full"
          />
        </div>

        {/* Botones */}
        <div className="col-span-1 flex items-end justify-end gap-3">
          <Button onClick={onApply}>Aplicar</Button>
          <Button onClick={onOpenPanel} disabled={!hasData}>
            Ver PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
