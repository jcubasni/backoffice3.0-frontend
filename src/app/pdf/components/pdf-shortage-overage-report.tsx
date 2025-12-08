import { Text, View } from "@react-pdf/renderer"
import { shortageOverageStyles as styles } from "../styles/shortage-overage-report"
import type { ShortageOverageData } from "../types/shortage-overage-report.types"
import { PdfBase } from "./pdf-base"

interface Props {
  data: ShortageOverageData
}

export const PdfShortageOverageReport = ({ data }: Props) => {
  return (
    <PdfBase orientation="portrait" size="A4">
      <View style={styles.page}>

        {/* === ENCABEZADO === */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{data.company}</Text>
          <Text style={styles.headerText}>RUC: {data.ruc}</Text>
          <Text style={styles.headerText}>{data.address}</Text>
        </View>

        {/* === TÍTULO PRINCIPAL === */}
        <Text style={styles.sectionTitle}>REPORTE DE FALTANTE Y SOBRANTE</Text>
        <Text style={styles.smallText}>
          Fecha desde: {data.startDate} | Fecha hasta: {data.endDate}
        </Text>

        {/* === TURNOS / USUARIOS === */}
        {data.turns.map((turn, tIndex) => {
          const totals = {
            depositCash: turn.boxes.reduce((a, b) => a + b.deposit.cash, 0),
            depositCard: turn.boxes.reduce((a, b) => a + b.deposit.card, 0),
            salesCash: turn.boxes.reduce((a, b) => a + b.sales.cash, 0),
            salesCard: turn.boxes.reduce((a, b) => a + b.sales.card, 0),
            balance: turn.boxes.reduce((a, b) => a + b.balance, 0),
          }

          return (
            <View key={tIndex} style={{ marginTop: 12 }}>

              {/* === ENCABEZADO POR MODO === */}
              {data.mode === "user" ? (
                <>
                  <Text style={[styles.sectionTitle, { fontSize: 10 }]}>
                    USUARIO: {turn.boxes[0]?.userName?.toUpperCase()}
                  </Text>
                  <Text style={styles.smallText}>Fecha proceso: {turn.date}</Text>
                </>
              ) : (
                <>
                  <Text style={[styles.sectionTitle, { fontSize: 10 }]}>
                    TURNO: {turn.name.toUpperCase()}
                  </Text>
                  <Text style={styles.smallText}>Fecha proceso: {turn.date}</Text>
                </>
              )}

              {/* === TABLA === */}
              <View style={[styles.table, { marginTop: 6 }]}>

                {/* CABECERA AZUL */}
                <View style={styles.tableHeaderBlue}>
                  <Text style={styles.tableTitle}>CAJAS</Text>
                </View>

                {/* === CABECERA SUPERIOR === */}
                <View style={styles.tableHeaderTwoRows}>
                  <View style={styles.headerTopRow}>

                    {/* === MODO USUARIO (sin columna Usuario) === */}
                    {data.mode === "user" ? (
                      <>
                        <Text style={[styles.colCaja, styles.bold]}>Caja</Text>
                        <Text style={[styles.colTurno, styles.bold]}>Turno</Text>
                      </>
                    ) : (
                      <>
                        <Text style={[styles.colCaja, styles.bold]}>Caja</Text>
                        <Text style={[styles.colResp, styles.bold]}>Responsable</Text>
                      </>
                    )}

                    {/* Depósito */}
                    <View style={styles.colGroup}>
                      <Text style={[styles.bold, { textAlign: "center" }]}>Depósito</Text>
                    </View>

                    {/* Ventas */}
                    <View style={styles.colGroup}>
                      <Text style={[styles.bold, { textAlign: "center" }]}>Ventas</Text>
                    </View>

                    <Text style={[styles.colBalance, styles.bold]}>
                      Faltante / Sobrante
                    </Text>
                  </View>

                  {/* === CABECERA INFERIOR === */}
                  <View style={styles.headerBottomRow}>
                    <Text style={styles.colCaja}></Text>

                    {data.mode === "user" ? (
                      <Text style={styles.colTurno}></Text>
                    ) : (
                      <Text style={styles.colResp}></Text>
                    )}

                    {/* Sub Depósito */}
                    <View style={styles.colGroup}>
                      <View style={styles.innerGroupHeader}>
                        <Text style={styles.subHeaderText}>Efectivo</Text>
                        <Text style={styles.subHeaderText}>Tarjeta</Text>
                        <Text style={styles.subHeaderText}>Total</Text>
                      </View>
                    </View>

                    {/* Sub Ventas */}
                    <View style={styles.colGroup}>
                      <View style={styles.innerGroupHeader}>
                        <Text style={styles.subHeaderText}>Efectivo</Text>
                        <Text style={styles.subHeaderText}>Tarjeta</Text>
                        <Text style={styles.subHeaderText}>Total</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* === FILAS === */}
                {turn.boxes.map((box, i) => (
                  <View
                    key={i}
                    style={[
                      styles.tableRow,
                      i % 2 === 1 ? styles.altRow : {},
                      styles.tableRowBorder
                    ]}
                  >

                    {/* === FILAS MODO USER (solo Caja + Turno) === */}
                    {data.mode === "user" ? (
                      <>
                        <Text style={styles.colCaja}>{box.registerCode}</Text>
                        <Text style={styles.colTurno}>{box.shiftName}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.colCaja}>{box.code}</Text>
                        <Text style={styles.colResp}>{box.responsible}</Text>
                      </>
                    )}

                    {/* Depósito */}
                    <View style={styles.colGroup}>
                      <View style={styles.innerGroup}>
                        <Text style={styles.valueText}>{box.deposit.cash.toFixed(2)}</Text>
                        <Text style={styles.valueText}>{box.deposit.card.toFixed(2)}</Text>
                        <Text style={[styles.valueText, styles.bold]}>
                          {(box.deposit.cash + box.deposit.card).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Ventas */}
                    <View style={styles.colGroup}>
                      <View style={styles.innerGroup}>
                        <Text style={styles.valueText}>{box.sales.cash.toFixed(2)}</Text>
                        <Text style={styles.valueText}>{box.sales.card.toFixed(2)}</Text>
                        <Text style={[styles.valueText, styles.bold]}>
                          {(box.sales.cash + box.sales.card).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Balance */}
                    <Text
                      style={[
                        styles.colBalance,
                        box.balance < 0 ? styles.negativeBalance : styles.positiveBalance
                      ]}
                    >
                      {box.balance.toFixed(2)}
                    </Text>
                  </View>
                ))}

                {/* === TOTALES === */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTALES</Text>

                  <View style={styles.totalGroup}>
                    <Text style={styles.totalValue}>{totals.depositCash.toFixed(2)}</Text>
                    <Text style={styles.totalValue}>{totals.depositCard.toFixed(2)}</Text>
                    <Text style={styles.totalValue}>
                      {(totals.depositCash + totals.depositCard).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.totalGroup}>
                    <Text style={styles.totalValue}>{totals.salesCash.toFixed(2)}</Text>
                    <Text style={styles.totalValue}>{totals.salesCard.toFixed(2)}</Text>
                    <Text style={styles.totalValue}>
                      {(totals.salesCash + totals.salesCard).toFixed(2)}
                    </Text>
                  </View>

                  <Text style={styles.totalBalance}>{totals.balance.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </PdfBase>
  )
}
