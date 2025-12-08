// src/app/pdf/components/sale-report/pdf-payment-type-report.tsx
import { Text, View } from "@react-pdf/renderer"
import { ByPaymentType } from "../../../sale-report/types/sale-report.type"
import { PdfBase } from "../pdf-base"
import { paymentTypeStyles as styles } from "./sale-repot-style"

interface Props {
  data: ByPaymentType[]
  startDate: string
  endDate: string
}

export const PDFPaymentTypeReport = ({ data, startDate, endDate }: Props) => {
  const totalVentas = data.reduce((acc, d) => acc + (d.total_venta ?? 0), 0)
  const hasData =
    data.length > 0 && !(data.length === 1 && data[0].total_venta === 0)

  return (
    <PdfBase orientation="portrait" size="A4">
      <View style={styles.page}>
        {/* === ENCABEZADO === */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>JADAL GLOBAL SERVICES S.A.C</Text>
          <Text style={styles.headerText}>20611173432</Text>
          <Text style={styles.headerText}>PASEO DE LA REPÚBLICA #314</Text>
          <Text style={styles.headerText}>
            Desde: {startDate} | Hasta: {endDate}
          </Text>
        </View>

        {hasData ? (
          <View style={styles.tableContainer}>
            {/* Header tabla */}
            <View style={styles.tableHeader}>
              <Text style={styles.col}>Fecha</Text>
              <Text style={styles.col}>Serie</Text>
              <Text style={styles.col}>Correlativo</Text>
              <Text style={styles.col}>Doc</Text>
              <Text style={styles.col}>Cliente</Text>
              <Text style={styles.col}>Total</Text>
              <Text style={styles.col}>Moneda</Text>
              <Text style={styles.col}>Tipo Pago</Text>
              <Text style={styles.col}>Forma Pago</Text>
            </View>

            {/* Filas */}
            {data.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.col}>
                  {row.fecha_emision?.split("T")[0] || "-"}
                </Text>
                <Text style={styles.col}>{row.serie || "-"}</Text>
                <Text style={styles.col}>{row.correlativo || "-"}</Text>
                <Text style={styles.col}>{row.doc_identidad || "-"}</Text>
                <Text style={styles.col}>{row.cliente || "-"}</Text>
                <Text style={styles.col}>
                  {row.total_venta?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.col}>{row.moneda ?? "-"}</Text>
                <Text style={styles.col}>{row.tipo_pago || "-"}</Text>
                <Text style={styles.col}>{row.forma_pago || "-"}</Text>
              </View>
            ))}

            {/* Total general */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL GENERAL</Text>
              <Text style={styles.totalValue}>{totalVentas.toFixed(2)}</Text>
            </View>
          </View>
        ) : (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 10,
              fontStyle: "italic",
            }}
          >
            No se encontraron resultados para los filtros aplicados.
          </Text>
        )}
      </View>
    </PdfBase>
  )
}
