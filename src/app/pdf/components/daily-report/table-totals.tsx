import { Table, TR } from "@ag-media/react-pdf-table"
import { View } from "@react-pdf/renderer"
import { formatCurrency } from "@/shared/lib/number"
import { MainTotals } from "../../types/daily-report.type"
import { TCell, THead, THeader } from "../table"

interface TableTotalsProps {
  data?: MainTotals
}

export const TableTotals = ({ data }: TableTotalsProps) => {
  return (
    <View style={{ width: "100%" }}>
      <Table>
        <THeader>
          <THead>Total Venta Bruta</THead>
          <THead>Total Salidas</THead>
          <THead>TVB - TS</THead>
          <THead>Total Otros</THead>
          <THead>TVB - TS + TO</THead>
        </THeader>
        <TR style={{ borderBottom: 0, borderTop: 0 }}>
          <TCell>{formatCurrency(data?.totalGrossSales || 0)}</TCell>
          <TCell>{formatCurrency(0)}</TCell>
          <TCell>{formatCurrency(data?.grossSalesMinusFuelOutput || 0)}</TCell>
          <TCell>{formatCurrency(0)}</TCell>
          <TCell>{formatCurrency(data?.totalDailySales || 0)}</TCell>
        </TR>
      </Table>
    </View>
  )
}
