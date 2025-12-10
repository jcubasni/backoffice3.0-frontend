"use client"

import { useEffect, useState } from "react"
import { PDFViewer } from "@react-pdf/renderer"
import { PdfShortageOverageReport } from "@/app/pdf/components/pdf-shortage-overage-report"
import Panel from "@/shared/components/ui/panel"
import { usePanelStore } from "@/shared/store/panel.store"
import { useGetShortageOverage } from "../../hooks/useDetailBoxesService"
import type {
  ShortageOverageData,
} from "@/app/pdf/types/shortage-overage-report.types"
import type {
  ShortageOverageParams,
  ShortageOverageResponse,
} from "../../types/detail-boxes.type"
import { PulseLoader } from "react-spinners"
import { Colors } from "@/shared/types/constans"

const PANEL_ID = "shortage-overage-report"

// Función segura para cortar fechas tipo "2025-12-10T10:00:00"
const normalizeDate = (value?: string | null): string => {
  if (!value) return ""
  const [date] = String(value).split("T")
  return date
}

export const PanelShortageOverageReport = () => {
  const [pdfData, setPdfData] = useState<ShortageOverageData | null>(null)
  const [mode, setMode] = useState<"cashRegister" | "user">("cashRegister")

  const panelData = usePanelStore((state) =>
    state.openPanels.find((panel) => panel.id === PANEL_ID),
  )?.prop as ShortageOverageParams | undefined

  const cashRegisters = panelData?.cashRegisters ?? []

  const report = useGetShortageOverage({
    cashRegisters,
    mode,
  })

  useEffect(() => {
    // Si no hay data o viene algo raro, limpiamos el PDF
    if (!report.data || !Array.isArray(report.data)) {
      setPdfData(null)
      return
    }

    const rows = report.data as ShortageOverageResponse[]
    const turnsMap: Record<string, ShortageOverageData["turns"][number]> = {}

    rows.forEach((row) => {
      const shiftName = row.shiftName ?? "SIN TURNO"
      const processDate = normalizeDate(row.processDate)

      if (!turnsMap[shiftName]) {
        turnsMap[shiftName] = {
          name: shiftName,
          date: processDate,
          boxes: [],
        }
      }

      if (mode === "user") {
        // Quiebre por usuario
        turnsMap[shiftName].boxes.push({
          registerCode: row.cashRegisterCode?.toString() ?? "",
          shiftName,
          userName: row.cashierName ?? "-",
          deposit: {
            cash: Number(row.depositCash ?? 0),
            card: Number(row.depositCard ?? 0),
          },
          sales: {
            cash: Number(row.salesCash ?? 0),
            card: Number(row.salesCard ?? 0),
          },
          balance: Number(row.shortageOverage ?? 0),
        })
      } else {
        // Quiebre por caja (modo original)
        turnsMap[shiftName].boxes.push({
          code: row.cashRegisterCode?.toString() ?? "",
          responsible: row.cashierName ?? "-",
          deposit: {
            cash: Number(row.depositCash ?? 0),
            card: Number(row.depositCard ?? 0),
          },
          sales: {
            cash: Number(row.salesCash ?? 0),
            card: Number(row.salesCard ?? 0),
          },
          balance: Number(row.shortageOverage ?? 0),
        })
      }
    })

    const formattedData: ShortageOverageData = {
      company: "JADAL GLOBAL SERVICES S.A.C",
      ruc: "20611173432",
      address: "PASEO DE LA REPÚBLICA #314",
      startDate: normalizeDate(panelData?.startDate),
      endDate: normalizeDate(panelData?.endDate),
      mode,
      turns: Object.values(turnsMap),
    }

    setPdfData(formattedData)
  }, [report.data, mode, panelData?.startDate, panelData?.endDate])

  if (!panelData) {
    return (
      <Panel
        panelId={PANEL_ID}
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
      panelId={PANEL_ID}
      title="Reporte de Faltante y Sobrante"
      className="h-[90vh]"
      direction="bottom"
    >
      {/* Selector de modo */}
      <div className="flex items-center justify-end gap-3 p-2 border-b bg-gray-50">
        <button
          onClick={() =>
            setMode((prev) =>
              prev === "cashRegister" ? "user" : "cashRegister",
            )
          }
          className="rounded-lg px-3 py-1 text-white text-sm transition hover:opacity-90"
          style={{ backgroundColor: Colors.reportBlue }}
        >
          {mode === "cashRegister" ? "Quiebre por Usuario" : "Quiebre por Turno"}
        </button>
      </div>

      {/* Contenido principal */}
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
