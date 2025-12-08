import { useState } from "react"
import { getShortageOverageReport } from "../helpers/report.service"
import type { ShortageOverageData } from "../types/shortage-overage-report.types"

export function useShortageOverageReport() {
  const [data, setData] = useState<ShortageOverageData | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchReport(
    startDate: string,
    endDate: string,
    cashRegisters: number[],
  ) {
    setLoading(true)
    try {
      const apiData = await getShortageOverageReport(
        startDate,
        endDate,
        cashRegisters,
      )

      // Transformación a formato PDF esperado
      const turnsMap: Record<string, any> = {}

      apiData.forEach((row: any) => {
        if (!turnsMap[row.shiftName]) {
          turnsMap[row.shiftName] = {
            name: row.shiftName,
            date: row.processDate.split("T")[0],
            boxes: [],
          }
        }
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
      })

      const formattedData: ShortageOverageData = {
        company: "JADAL GLOBAL SERVICES S.A.C",
        ruc: "20611173432",
        address: "PASEO DE LA REPÚBLICA #314",
        startDate,
        endDate,
        turns: Object.values(turnsMap),
      }

      setData(formattedData)
    } catch (err) {
      console.error("Error obteniendo reporte de faltantes/sobrantes:", err)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, fetchReport }
}
