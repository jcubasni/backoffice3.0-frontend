"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTitleHeaderStore } from "@/shared/store/title-header.store";
import { FormProvider, useForm } from "react-hook-form";
import { usePanelStore } from "@/shared/store/panel.store";
import { SyncLoader } from "react-spinners";
import { useSaleByPaymentType } from "@/app/sale-report/hooks/useSaleReportService";
import { FiltersPaymentTypeReport } from "@/app/sale-report/components/payment/filter-payment-type-report";
import { PanelPaymentTypeReport } from "@/app/sale-report/components/payment/panel-type-report";
import { TablePaymentTypeReport } from "@/app/sale-report/components/payment/table-payment-type-report";

interface FormValues {
  docTypes: string[];
  tipoPago: string[];
  clientId: string;
}

export const Route = createFileRoute("/(sidebar)/pdf/payment-type-report")({
  component: RouteComponent,
  beforeLoad: () => {
    useTitleHeaderStore.setState({ title: "Reporte - Tipo de Pago" });
  },
});

function RouteComponent() {
  const [startDate, setStartDate] = useState("2025-09-01");
  const [endDate, setEndDate] = useState("2025-11-10");
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null); // solo id

  const { openPanel } = usePanelStore();

  const methods = useForm<FormValues>({
    defaultValues: { docTypes: ["03"], tipoPago: ["1"], clientId: "" },
  });
  const { setValue, getValues } = methods;

  const { data = [], isFetching } = useSaleByPaymentType(
    appliedFilters?.startDate || "",
    appliedFilters?.endDate || "",
    appliedFilters?.clientId || "",
    appliedFilters?.docTypes || [],
    appliedFilters?.paymentTypes || [],
    { enabled: appliedFilters !== null }
  );

  const handleApplyFilters = () => {
    // Guardar id del cliente
    setValue("clientId", selectedClient || "");

    const values = getValues();

    setAppliedFilters({
      startDate,
      endDate,
      docTypes: values.docTypes,
      paymentTypes: values.tipoPago,
      clientId: values.clientId, // solo el id
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex h-full w-full flex-col gap-6">
        <FiltersPaymentTypeReport
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          onApply={handleApplyFilters}
          onOpenPanel={() => openPanel("payment-type-report")}
          hasData={data.length > 0}
        />

        {isFetching && (
          <div className="mt-4 flex h-full items-center justify-center">
            <SyncLoader color="#410a88ff" />
          </div>
        )}

        {!isFetching && appliedFilters && <TablePaymentTypeReport data={data} />}

        <PanelPaymentTypeReport
          data={data}
          startDate={appliedFilters?.startDate || ""}
          endDate={appliedFilters?.endDate || ""}
        />
      </div>
    </FormProvider>
  );
}
