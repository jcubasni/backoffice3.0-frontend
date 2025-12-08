"use client"

import { useEffect, useState } from "react"
import { PDFViewer } from "@react-pdf/renderer"
import { PdfShortageOverageReport } from "@/app/pdf/components/pdf-shortage-overage-report"
import Panel from "@/shared/components/ui/panel"
import { usePanelStore } from "@/shared/store/panel.store"
import { useGetShortageOverage } from "../../hooks/useDetailBoxesService"
import type { ShortageOverageData } from "@/app/pdf/types/shortage-overage-report.types"
import { ShortageOverageParams } from "../../types/detail-boxes.type"
import { PulseLoader } from "react-spinners"
import { Colors } from "@/shared/types/constans"

export const PanelShortageOverageReport = () => {
  const [pdfData, setPdfData] = useState<ShortageOverageData | null>(null)
  const [mode, setMode] = useState<"cashRegister" | "user">("cashRegister")

  const panelData = usePanelStore((state) =>
    state.openPanels.find((panel) => panel.id === "shortage-overage-report"),
  )?.prop as ShortageOverageParams | undefined

  const cashRegisters = panelData?.cashRegisters ?? []

  const report = useGetShortageOverage({
    cashRegisters,
    mode,
  })

  useEffect(() => {
    if (report.data && Array.isArray(report.data)) {
      const turnsMap: Record<string, any> = {}

      report.data.forEach((row: any) => {
        if (!turnsMap[row.shiftName]) {
          turnsMap[row.shiftName] = {
            name: row.shiftName,
            date: row.processDate.split("T")[0],
            boxes: [],
          }
        }

        // === CAMBIO PEDIDO: estructura diferente para usuario ===
      if (mode === "user") {
            turnsMap[row.shiftName].boxes.push({
              registerCode: row.cashRegisterCode.toString(),
              shiftName: row.shiftName,
              userName: row.cashierName,

              deposit: {
                cash: Number(row.depositCash),
                card: Number(row.depositCard),
              },
              sales: {
                cash: Number(row.salesCash),
                card: Number(row.salesCard),
              },
              balance: Number(row.shortageOverage),
            })
          }
          else {
          // === MODO ORIGINAL (NO CAMBIA NADA) ===
          turnsMap[row.shiftName].boxes.push({
            code: row.cashRegisterCode.toString(),
            responsible: row.cashierName,
            deposit: {
              cash: Number(row.depositCash),
              card: Number(row.depositCard),
            },
            sales: {
              cash: Number(row.salesCash),
              card: Number(row.salesCard),
            },
            balance: Number(row.shortageOverage),
          })
        }
      })

      const formattedData: ShortageOverageData = {
        company: "JADAL GLOBAL SERVICES S.A.C",
        ruc: "20611173432",
        address: "PASEO DE LA REPÚBLICA #314",
        startDate: panelData?.startDate ? panelData.startDate.split("T")[0] : "",
        endDate: panelData?.endDate ? panelData.endDate.split("T")[0] : "",
        mode,
        turns: Object.values(turnsMap),
      }

      setPdfData(formattedData)
    }
  }, [report.data, mode])

  if (!panelData) {
    return (
      <Panel
        panelId="shortage-overage-report"
        title="Reporte de Faltante y Sobrante"
        className="h-[90vh]"
        direction="bottom"
      >
        <div className="flex h-full w-full items-center justify-center">
          <PulseLoader size={8} color={Colors.extra} />
        </div>
      </Panel>
    )
  }

  return (
    <Panel
      panelId="shortage-overage-report"
      title="Reporte de Faltante y Sobrante"
      className="h-[90vh]"
      direction="bottom"
    >
      {/* === Selector de modo === */}
      <div className="flex items-center justify-end gap-3 p-2 border-b bg-gray-50">
        <button
          onClick={() =>
            setMode((prev) =>
              prev === "cashRegister" ? "user" : "cashRegister",
            )
          }
          className="
            rounded-lg px-3 py-1 text-white text-sm transition
            hover:opacity-90
          "
          style={{ backgroundColor: Colors.reportBlue }}
        >
          {mode === "cashRegister" ? "Quiebre por Usuario" : "Quiebre por Turno"}
        </button>
      </div>

      {/* === Contenido principal === */}
      <div className="flex h-full items-center justify-center">
        {report.isLoading && (
          <div className="h-full w-full flex items-center justify-center">
            <PulseLoader size={8} color={Colors.extra} />
          </div>
        )}

        {!report.isLoading && pdfData && (
          <PDFViewer width="100%" height="100%">
            <PdfShortageOverageReport data={pdfData} />
          </PDFViewer>
        )}

        {!report.isLoading && !pdfData && (
          <div className="h-full w-full flex items-center justify-center text-red-500">
            No se encontraron datos del reporte.
          </div>
        )}
      </div>
    </Panel>
  )
}
