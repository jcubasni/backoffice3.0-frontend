// src/app/pdf/components/Excel/ButtonShortageOverageExcel.tsx
import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"
import { ShortageOverageReport } from "../../services/report.service"
import { exportShortageOverageToExcel } from "./export-shortage-overage-excel"

interface ButtonShortageOverageExcelProps {
  data?: ShortageOverageReport[]
  startDate: string
  endDate: string
}

export const ButtonShortageOverageExcel = ({
  data,
  startDate,
  endDate,
}: ButtonShortageOverageExcelProps) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) return
    exportShortageOverageToExcel(data, startDate, endDate)
  }

  return (
    <Button onClick={exportToExcel} disabled={!data || data.length === 0}>
      <FileSpreadsheet className="mr-2 h-5 w-5 text-green-600" />
      Exportar a Excel
    </Button>
  )
}
