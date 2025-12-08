import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"
import { exportCanceledSalesToExcel } from "./export-canceled-sales-excel"
import type { CanceledSalesReport } from "../../services/report.service"

interface ButtonCanceledSalesExcelProps {
  data?: CanceledSalesReport[]
  startDate: string
  endDate: string
}

export const ButtonCanceledSalesExcel = ({
  data,
  startDate,
  endDate,
}: ButtonCanceledSalesExcelProps) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) return
    exportCanceledSalesToExcel(data, startDate, endDate)
  }

  return (
    <Button onClick={exportToExcel} disabled={!data || data.length === 0}>
      <FileSpreadsheet className="mr-2 h-5 w-5 text-green-600" />
      Exportar a Excel
    </Button>
  )
}
