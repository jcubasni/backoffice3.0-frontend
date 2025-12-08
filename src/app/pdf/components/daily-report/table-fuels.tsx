import { Table, TD, TR } from "@ag-media/react-pdf-table"
import { View } from "@react-pdf/renderer"
import { formatCurrency } from "@/shared/lib/number"
import { Colors } from "@/shared/types/constans"
import { styles } from "../../styles/daily-report/table"
import { FuelSummary } from "../../types/daily-report.type"
import { TableHeaderDoubleLine, THead, THeader } from "../table"

interface TableFuelsProps {
  data: FuelSummary[]
}

export const TableFuels = ({ data }: TableFuelsProps) => {
  return (
    <View style={{ marginTop: 10, marginBottom: 20 }}>
      <Table weightings={[0.2]}>
        <THeader>
          <THead>Productos</THead>
          <TableHeaderDoubleLine
            firstLine="Stock Inicial"
            secondLine="Ventas (Gal.)"
          />
          <TableHeaderDoubleLine firstLine="Ingreso" secondLine="Galones" />
          <TableHeaderDoubleLine firstLine="Consumo" secondLine="Interno" />
          <TableHeaderDoubleLine firstLine="Ventas" secondLine="Galones" />
          <TableHeaderDoubleLine
            firstLine="Stock Final"
            secondLine="Ventas (Gal.)"
          />
          <TableHeaderDoubleLine firstLine="Diferencia del" secondLine="Dia" />
          <TableHeaderDoubleLine firstLine="Direrencia de" secondLine="Mes" />
          <TableHeaderDoubleLine firstLine="Total" secondLine="Salida" />
        </THeader>
        {data.map((fuel, index) => (
          <TR
            key={fuel.productName}
            style={{
              backgroundColor: index % 2 !== 0 ? Colors.bg : Colors.white,
            }}
          >
            <TD style={styles.contentCell}>{fuel.productName}</TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.initialSalesStock ?? 0)}
            </TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.inputGallons ?? 0)}
            </TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.internalConsumption ?? 0)}
            </TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.salesGallons ?? 0)}
            </TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.finalSalesStock ?? 0)}
            </TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.dailyDifference ?? 0)}
            </TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.monthlyDifference ?? 0)}
            </TD>
            <TD style={styles.contentCell}>
              {formatCurrency(fuel.totalOutputAmount ?? 0)}
            </TD>
          </TR>
        ))}
        <TR style={styles.footerCell}>
          {[...Array(8)].map((_, i) => (
            <TD key={i} style={styles.contentCell} />
          ))}
          <TD style={styles.contentCell}>{formatCurrency(0)}</TD>
        </TR>
      </Table>
    </View>
  )
}
