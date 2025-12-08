"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { PDFDepositDetailReport } from "@/app/pdf/components/sale-report/pdf-deposit-detail-report"
import type {
  ByDeposit,
} from "@/app/sale-report/types/sale-report.type"
import Panel from "@/shared/components/ui/panel"


interface PanelDepositDetailReportProps {
  data: ByDeposit[]
  date: string
  cashRegisterId: string
  shiftId: string
}


export const PanelDepositDetailReport = ({
  data,
  date,
  cashRegisterId,
  shiftId,
}: PanelDepositDetailReportProps) => {
  return (
    <Panel
      panelId="deposit-report-detail"
      title="Reporte PDF - Depósito por Cajas"
      direction="bottom"
      className="h-[90vh] w-[100vw]"
    >
      <div className="flex h-full items-center justify-center">
        <PDFViewer width="100%" height="100%">
          <PDFDepositDetailReport
            data={data}
            date={date}
            cashRegisterId={cashRegisterId}
            shiftId={shiftId}
          />
        </PDFViewer>
      </div>
    </Panel>
  )
}
