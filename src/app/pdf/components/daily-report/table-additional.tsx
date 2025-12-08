import { Table, TR } from "@ag-media/react-pdf-table"
import { View } from "@react-pdf/renderer"
import { formatCurrency } from "@/shared/lib/number"
import { OtherProducts } from "../../types/daily-report.type"
import { TCell, TFooter, THead, THeader } from "../table"

interface TableAdditionalProps {
  data?: OtherProducts
}

export const TableAdditional = ({ data }: TableAdditionalProps) => {
  return (
    <View style={{ width: "30%" }}>
      <Table weightings={[0.6, 0.4]}>
        <THeader>
          <THead weighting={1.0}>Otros Productos</THead>
        </THeader>
        <TR>
          <TCell>Lubricantes</TCell>
          <TCell>{formatCurrency(data?.lubricants || 0)}</TCell>
        </TR>
        <TR>
          <TCell>Alquiler</TCell>
          <TCell>{formatCurrency(data?.rental || 0)}</TCell>
        </TR>
        <TR>
          <TCell>Servicios</TCell>
          <TCell>{formatCurrency(data?.services || 0)}</TCell>
        </TR>
        <TR>
          <TCell>Market</TCell>
          <TCell>{formatCurrency(data?.market || 0)}</TCell>
        </TR>
        <TFooter>
          <TCell>Total</TCell>
          <TCell>{formatCurrency(data?.totalOtherProducts || 0)}</TCell>
        </TFooter>
      </Table>
    </View>
  )
}
