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
  // 👇 Si no viene nada del backend, mostramos una fila “dummy”
  const rows: FuelSummary[] =
    data && data.length > 0
      ? data
      : [
          {
            // Estos campos dependen de tu tipo FuelSummary,
            // usa los nombres reales que tengas
            productName: "SIN DATOS",
            initialSalesStock: 0,
            inputGallons: 0,
            internalConsumption: 0,
            salesGallons: 0,
            finalSalesStock: 0,
            dailyDifference: 0,
            monthlyDifference: 0,
            totalOutputAmount: 0,
            // si tu tipo tiene más campos obligatorios, ponlos en 0 o null
          } as FuelSummary,
        ]

  // 👇 Total de la última columna (si hay datos, suma; si no, será 0)
  const totalSalida = rows.reduce(
    (acc, fuel) => acc + (fuel.totalOutputAmount ?? 0),
    0,
  )

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

        {rows.map((fuel, index) => (
          <TR
            key={fuel.productName ?? index}
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

        {/* Fila de totales */}
        <TR style={styles.footerCell}>
          {[...Array(8)].map((_, i) => (
            <TD key={i} style={styles.contentCell} />
          ))}
          <TD style={styles.contentCell}>{formatCurrency(totalSalida)}</TD>
        </TR>
      </Table>
    </View>
  )
}
