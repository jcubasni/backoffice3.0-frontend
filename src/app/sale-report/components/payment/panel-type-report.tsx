"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { PDFPaymentTypeReport } from "@/app/pdf/components/sale-report/pdf-payment-type-report";
import { ByPaymentType } from "@/app/sale-report/types/sale-report.type";
import Panel from "@/shared/components/ui/panel";

interface Props {
  data: ByPaymentType[];
  startDate: string;
  endDate: string;
}

export function PanelPaymentTypeReport({ data, startDate, endDate }: Props) {
  return (
    <Panel
      panelId="payment-type-report"
      title="Reporte PDF - Tipo de Pago"
      direction="bottom"
      className="h-[90vh] w-[100vw]"
    >
      <div className="flex h-full items-center justify-center">
        <PDFViewer width="100%" height="100%">
          <PDFPaymentTypeReport data={data} startDate={startDate} endDate={endDate} />
        </PDFViewer>
      </div>
    </Panel>
  );
}
