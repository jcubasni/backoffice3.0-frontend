import { Table, TR } from "@ag-media/react-pdf-table"
import { View } from "@react-pdf/renderer"
import { formatCurrency } from "@/shared/lib/number"
import { FuelAdjustments } from "../../types/daily-report.type"
import { TCell, TFooter, THead, THeader } from "../table"

interface TableOutputProps {
  data?: FuelAdjustments
}

export const TableOutput = ({ data }: TableOutputProps) => {
  return (
    <View style={{ width: "30%" }}>
      <Table weightings={[0.6, 0.4]}>
        <THeader>
          <THead weighting={1.0}>Salida Combustible (No afecta)</THead>
        </THeader>
        <TR>
          <TCell>Descuento/Aumento</TCell>
          <TCell>{formatCurrency(data?.discountIncrease || 0)}</TCell>
        </TR>
        <TR>
          <TCell>Consumo interno playa</TCell>
          <TCell>{formatCurrency(data?.internalConsumptionStation || 0)}</TCell>
        </TR>
        <TR>
          <TCell>Serafines</TCell>
          <TCell>{formatCurrency(data?.seraphines || 0)}</TCell>
        </TR>
        <TFooter>
          <TCell>Total</TCell>
          <TCell>{formatCurrency(data?.totalNonTaxableOutput || 0)}</TCell>
        </TFooter>
      </Table>
    </View>
  )
}
