import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"
import { exportSalesToExcel } from "./export-sales-excel"
import { SalesReport } from "../../services/report.service"

interface ButtonSalesExcelProps {
  data: SalesReport[] | undefined
}

export const ButtonSalesExcel = ({
  data,
  startDate,
  endDate,
}: {
  data: SalesReport[] | undefined
  startDate: string
  endDate: string
}) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) return
    exportSalesToExcel(data, startDate, endDate)
  }

  return (
    <Button onClick={exportToExcel} disabled={!data || data.length === 0}>
      <FileSpreadsheet className="mr-2 h-5 w-5 text-green-600" />
      Exportar a Excel
    </Button>
  )
}
