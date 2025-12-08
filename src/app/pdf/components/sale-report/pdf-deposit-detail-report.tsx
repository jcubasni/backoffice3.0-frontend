// src/app/pdf/components/sale-report/pdf-deposit-detail-report.tsx
import { Text, View } from "@react-pdf/renderer";
import { ByDeposit } from "../../../sale-report/types/sale-report.type";
import { PdfBase } from "../pdf-base";
import { depositStyles as styles } from "./deposit-report-style";

interface Props {
  data: ByDeposit[];
  date: string;
  cashRegisterId?: string;
  shiftName?: string;
  shiftId?: string;
}

export const PDFDepositDetailReport = ({
  data,
  date,
  shiftName,
  shiftId,
}: Props) => {
  const hasData = data.length > 0;

  // 🔹 Agrupar por turno
  const groupedByShift = data.reduce((acc, row) => {
    const turno = row.turno || "SIN TURNO";
    if (!acc[turno]) acc[turno] = [];
    acc[turno].push(row);
    return acc;
  }, {} as Record<string, ByDeposit[]>);

  return (
    <PdfBase orientation="portrait" size="A4">
      <View style={styles.page}>
        {/* ENCABEZADO */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>JADAL GLOBAL SERVICES S.A.C</Text>
          <Text style={styles.headerText}>20611173432</Text>
          <Text style={styles.headerText}>PASEO DE LA REPÚBLICA #314</Text>
          <Text style={styles.headerText}>
            Fecha: {date}{" "}
            {shiftName ? `| Turno: ${shiftName}` : shiftId ? `| Turno ID: ${shiftId}` : ""}
          </Text>
        </View>

        {hasData ? (
          Object.keys(groupedByShift).map((turno, shiftIndex) => {
            const rows = groupedByShift[turno];

            // 🔹 Dentro de cada turno, separar por tipo
            const groupedByType = {
              Billete: rows.filter(r => Number(r.total_billetes) >= 0),
              Moneda: rows.filter(r => Number(r.total_monedas) >= 0),
            };

            return (
              <View key={shiftIndex} style={{ marginTop: 15 }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
                  Turno: {turno}
                </Text>

                {Object.keys(groupedByType).map((tipo, typeIndex) => {
                  const typeRows = groupedByType[tipo as "Billete" | "Moneda"];
                  if (typeRows.length === 0) return null;

                  const totalDeposited = typeRows.reduce((acc, r) => acc + (r.depositado ?? 0), 0);

                  return (
                    <View key={typeIndex} style={{ marginTop: 10 }}>
                      <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
                        DEPÓSITO: {tipo.toUpperCase()}
                      </Text>

                      <View style={styles.tableContainer}>
                        {/* Header tabla */}
                        <View style={styles.tableHeader}>
                          <Text style={styles.col}>Fecha</Text>
                          <Text style={styles.col}>Responsable</Text>
                          <Text style={styles.col}>Terminal</Text>
                          <Text style={styles.col}>Turno</Text>
                          <Text style={styles.col}>Depositado</Text>
                          {tipo === "Billete" && <Text style={styles.col}>Billetes</Text>}
                          {tipo === "Moneda" && <Text style={styles.col}>Monedas</Text>}
                          <Text style={styles.col}>Total</Text>
                          <Text style={styles.col}>Por Depositar</Text>
                        </View>

                        {/* Filas de datos */}
                        {typeRows.map((row, i) => (
                          <View key={i} style={styles.tableRow}>
                            <Text style={styles.col}>
                              {row.fecha ? new Date(row.fecha).toLocaleDateString() : "-"}
                            </Text>
                            <Text style={styles.col}>{row.responsable || "-"}</Text>
                            <Text style={styles.col}>{row.terminal || "-"}</Text>
                            <Text style={styles.col}>{row.turno || "-"}</Text>
                            <Text style={styles.col}>{Number(row.depositado).toFixed(2)}</Text>
                            {tipo === "Billete" && <Text style={styles.col}>{Number(row.total_billetes).toFixed(2)}</Text>}
                            {tipo === "Moneda" && <Text style={styles.col}>{Number(row.total_monedas).toFixed(2)}</Text>}
                            <Text style={styles.col}>{Number(row.total).toFixed(2)}</Text>
                            <Text style={styles.col}>{Number(row.por_depositar).toFixed(2)}</Text>
                          </View>
                        ))}

                        {/* Total por tipo */}
                        <View style={styles.totalRow}>
                          <Text style={styles.totalLabel}>TOTAL {tipo.toUpperCase()}</Text>
                          <Text style={styles.totalValue}>{totalDeposited.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })
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
  );
};
