import { Text, View } from "@react-pdf/renderer"
import { cx } from "../helpers/style-utils"
import { liquidationStyles as s } from "../styles/liquidation-report"
import type { ReportData } from "../types/liquidation-report.types"
import { PdfBase } from "./pdf-base"

interface Props {
  data: ReportData
}

export const LiquidationReport = ({ data }: Props) => {
  const getSectionItems = (title: string) => {
    const startIndex = data.items.findIndex((i) => i.description === title)
    if (startIndex === -1) return []
    const rest = data.items.slice(startIndex + 1)
    const endIndex = rest.findIndex(
      (i) =>
        i.description === "VENTAS POR CARA" ||
        i.description === "VENTAS POR PRODUCTO" ||
        i.description === "VENTAS POR DEPARTAMENTO",
    )
    if (endIndex === -1) return rest
    return rest.slice(0, endIndex)
  }

  const ventasDepto = getSectionItems("VENTAS POR DEPARTAMENTO")
  const ventasProducto = getSectionItems("VENTAS POR PRODUCTO")

  return (
    <PdfBase orientation="portrait" size="A4">
      <View style={s.page}>
        {/* === CABECERA === */}
        <View style={s.headerContainer}>
          <Text style={cx(s.headerTitle, { fontSize: 12 })}>SUC URSAL</Text>
          <Text style={cx(s.headerText, { marginTop: 3 })}>
            {data.header[0].label}
          </Text>
          <Text style={cx(s.headerText, { marginTop: 2 })}>
            DIR.SUC.: {data.header[1].label} - {data.header[2].label}
          </Text>
        </View>

        {/* === INFORMACIÓN DEL DOCUMENTO === */}
        <Text style={cx(s.sectionTitle, { marginTop: 5 })}>
          CIERRE DE CAJA #{data.document[1].value}
        </Text>
        <Text style={s.smallText}>
          Fecha: {data.document[2].value} | Caja: {data.document[3].value} |
          Usuario: {data.document[4].value} | Impreso: {data.document[5].value}
        </Text>

        {/* === TOTALES PRINCIPALES === */}
        <View
          style={cx(s.grid, { marginTop: 8, justifyContent: "space-between" })}
        >
                {[
            {
              title: "Ventas Totales",
              value:
                data.totals?.find(t => t.label === "TOTAL VTA BRUTA")?.value ??
                "0.00",
            },
            {
              title: "Venta Neta",
              value:
                data.totals?.find(t => t.label === "TOTAL VTA NETA")?.value ??
                "0.00",
            },
           {
              title: "Total Tarjetas",
              value:
                data.rendicion.find(r => r.label === "DEPOSITO")?.value ??
                "0.00",
            },
            {
              title: "Efectivo",
              value:
                data.rendicion.find(r => r.label === "EFECTIVO SOLES")?.value ??
                "0.00",
            },
          ].map((card, i) => (
            <View
              key={i}
              style={cx(s.card, {
                width: "23%",
                paddingVertical: 6,
                paddingHorizontal: 6,
              })}
            >
              <Text style={cx(s.cardTitle, { fontSize: 9 })}>{card.title}</Text>
              <Text style={cx(s.blueAmount, { fontSize: 10 })}>S/ {card.value}</Text>
            </View>
          ))}

        </View>

        {/* === TOTAL DE VENTAS Y DEPÓSITO === */}
        <View style={s.twoColumn}>
          {/* TOTAL DE VENTAS */}
          <View style={s.col}>
            <View style={s.table}>
              <View style={s.tableHeaderBlue}>
                <Text style={s.tableTitle}>TOTAL DE VENTAS</Text>
              </View>
              {data.totals.map((t, i) => (
                <View
                  key={i}
                  style={cx(
                    s.row2Cols,
                    i % 2 === 1 && s.altRow,
                    t.format === "DOUBLE" && s.totalRowGray,
                  )}
                >
                  <Text
                    style={cx(
                      s.colLabel,
                      t.format === "DOUBLE" && s.totalTextBlue,
                    )}
                  >
                    {t.label}
                  </Text>
                  <Text
                    style={cx(
                      s.colValue,
                      s.amount,
                      t.format === "DOUBLE" && s.totalTextBlue,
                    )}
                  >
                    {t.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
      {/* DEPÓSITO Y EFECTIVO */}
      <View style={s.col}>
        <View style={s.table}>
          <View style={s.tableHeaderBlue}>
            <Text style={s.tableTitle}>RENDICIÓN DE CAJA</Text>
          </View>

          <View style={s.tableSubHeader}>
            <Text style={cx(s.colLabel, s.bold)}>Tipo</Text>
            <Text style={cx(s.colValue, s.bold)}>Monto</Text>
          </View>

          {data.rendicion.map((t, i) => (
            <View
              key={i}
              style={cx(
                s.row2Cols,
                i % 2 === 1 && s.altRow,
                (t.label.startsWith("DEPOSITO") || t.label.startsWith("DIF.")) &&
                  s.totalRowGray
              )}
            >
              <Text
                style={cx(
                  s.colLabel,
                  (t.label.startsWith("DEPOSITO") || t.label.startsWith("DIF.")) &&
                    s.totalTextBlue
                )}
              >
                {t.label}
              </Text>

              <Text
                style={cx(
                  s.colValue,
                  s.amount,
                  (t.label.startsWith("DEPOSITO") || t.label.startsWith("DIF.")) &&
                    s.totalTextBlue
                )}
              >
                S/ {t.value}
              </Text>
            </View>
          ))}
          </View>
        </View>
      </View>
        {/* === VENTAS POR DEPARTAMENTO Y PRODUCTO === */}
        <View style={s.twoColumn}>
          <View style={s.col}>
            <View style={s.table}>
              <View style={s.tableHeaderBlue}>
                <Text style={s.tableTitle}>VENTAS POR DEPARTAMENTO</Text>
              </View>
              <View style={s.tableSubHeader}>
                <Text style={cx(s.colDesc, s.bold)}>Departamento</Text>
                <Text style={cx(s.colCode, s.bold)}>Cód</Text>
                <Text style={cx(s.colAmount, s.bold)}>Monto</Text>
              </View>
              {ventasDepto.map((item, i) => (
                <View
                  key={i}
                  style={cx(
                    s.row3Cols,
                    i % 2 === 1 && s.altRow,
                    item.description === "TOTAL" && s.totalRowGray,
                  )}
                >
                  <Text
                    style={cx(
                      s.colDesc,
                      item.description === "TOTAL" && s.totalTextBlue,
                    )}
                  >
                    {item.description}
                  </Text>
                  <Text
                    style={cx(
                      s.colCode,
                      item.description === "TOTAL" && s.totalTextBlue,
                    )}
                  >
                    {item.code || ""}
                  </Text>
                  <Text
                    style={cx(
                      s.colAmount,
                      s.amount,
                      item.description === "TOTAL" && s.totalTextBlue,
                    )}
                  >
                    S/ {item.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.col}>
            <View style={s.table}>
              <View style={s.tableHeaderBlue}>
                <Text style={s.tableTitle}>VENTAS POR PRODUCTO</Text>
              </View>
              <View style={s.tableSubHeader}>
                <Text style={cx(s.colDesc, s.bold)}>Producto</Text>
                <Text style={cx(s.colCode, s.bold)}>Cant.</Text>
                <Text style={cx(s.colAmount, s.bold)}>Monto</Text>
              </View>
              {ventasProducto.map((item, i) => (
                <View
                  key={i}
                  style={cx(
                    s.row3Cols,
                    i % 2 === 1 && s.altRow,
                    item.description === "TOTAL" && s.totalRowGray,
                  )}
                >
                  <Text
                    style={cx(
                      s.colDesc,
                      item.description === "TOTAL" && s.totalTextBlue,
                    )}
                  >
                    {item.description}
                  </Text>
                  <Text
                    style={cx(
                      s.colCode,
                      item.description === "TOTAL" && s.totalTextBlue,
                    )}
                  >
                    {item.qty?.toFixed(2) || ""}
                  </Text>
                  <Text
                    style={cx(
                      s.colAmount,
                      s.amount,
                      item.description === "TOTAL" && s.totalTextBlue,
                    )}
                  >
                    S/ {item.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* === DETALLE DE CONTÓMETROS POR LADOS DE SURTIDOR === */}
      <View style={{ marginTop: 20 }}>
        <View style={s.table}>
          <View style={s.tableHeaderBlue}>
            <Text style={s.tableTitle}>DETALLE DE CONTÓMETROS POR LADOS DE SURTIDOR</Text>
          </View>

          <View style={s.contometrosSubHeader}>
            <Text style={[s.bold, s.colLado]}>Lado</Text>
            <Text style={[s.bold, s.colProducto]}>Manguera - Producto</Text>
            <Text style={[s.bold, s.colContometro]}>Cont. Inicial</Text>
            <Text style={[s.bold, s.colContometro]}>Cont. Final</Text>
            <Text style={[s.bold, s.colContometro]}>Vol. (Contómetro)</Text>
            <Text style={[s.bold, s.colVenta]}>Vol. (Venta)</Text>
            <Text style={[s.bold, s.colDiferencia]}>Diferencia</Text>
          </View>

          {data.contometros?.map((item, i) => (
            <View
              key={i}
              style={cx(s.contometrosRow, i % 2 === 1 && s.altRow)}
            >
              <Text style={s.colLado}>{item.lado}</Text>
              <Text style={s.colProducto}>{item.producto}</Text>
                <Text style={s.colContometro}>{item.contInicial}</Text>
                <Text style={s.colContometro}>{item.contFinal}</Text>
                <Text style={s.colContometro}>{item.volContometro}</Text>
                <Text style={s.colVenta}>{item.volVenta}</Text>
              <Text style={[s.amount, s.colDiferencia]}>{item.diferencia}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* === VENTAS POR MANGUERA === */}
      {data.ventas_hose && data.ventas_hose.length > 0 && (
         <View style={{ marginTop: 20 }} break>
          <View style={s.table}>
            {/* HEADER AZUL */}
            <View style={s.tableHeaderBlue}>
              <Text style={s.tableTitle}>VENTAS POR MANGUERA</Text>
            </View>

            {/* SUBHEADER */}
            <View style={s.ventasHoseSubHeader}>
              <Text style={[s.bold, s.colHoseLado]}>Lado</Text>
              <Text style={[s.bold, s.colHoseProducto]}>Manguera - Producto</Text>
              <Text style={[s.bold, s.colHosePrecio]}>Precio</Text>
              <Text style={[s.bold, s.colHoseCantidad]}>Cant.</Text>
              <Text style={[s.bold, s.colHoseTotal]}>Total</Text>
            </View>

            {/* FILAS */}
            {data.ventas_hose.map((item, i) => (
              <View
                key={i}
                style={cx(s.ventasHoseRow, i % 2 === 1 && s.altRow)}
              >
                <Text style={s.colHoseLado}>{item.lado}</Text>
                <Text style={s.colHoseProducto}>{item.manguera_producto}</Text>
                <Text style={s.colHosePrecio}>
                  {Number(item.precio).toFixed(2)}
                </Text>
                <Text style={s.colHoseCantidad}>
                  {Number(item.cantidad).toFixed(2)}
                </Text>
                <Text style={[s.colHoseTotal, s.amount]}>
                  S/ {Number(item.total).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* === CLIENTES CON DESCUENTO === */}
    <View style={{ marginTop: 20 }}>
        <View style={s.table}>
          <View style={s.tableHeaderBlue}>
            <Text style={s.tableTitle}>CLIENTES CON DESCUENTO</Text>
          </View>
          <View style={s.tableSubHeader}>
            <Text style={cx(s.col4_1, s.bold)}>RUC</Text>
            <Text style={cx(s.col4_2, s.bold)}>Gal.</Text>
            <Text style={cx(s.col4_3, s.bold)}>Prod.</Text>
            <Text style={cx(s.col4_4, s.bold)}>Total</Text>
          </View>
          {data.discountClients.map((c, i) => {
            const [gal = "", prod = "", total = "0.00"] = c.value.split(",")
            return (
              <View key={`disc-${i}`} style={cx(s.row4Cols, i % 2 === 1 && s.altRow)}>
                <Text style={s.col4_1}>{c.label}</Text>
                <Text style={s.col4_2}>{gal}</Text>
                <Text style={s.col4_3}>{prod}</Text>
                <Text style={cx(s.col4_4, s.amount)}>S/ {total}</Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* === CLIENTES CRÉDITO / ADELANTO / C.I. / CANJE (segunda hoja) === */}
      <View style={s.pageFullWidth} break>
        <View style={{ width: "100%", marginHorizontal: "auto" }}>
          {/* === CLIENTES CRÉDITO === */}
          <View style={[s.table, { width: "100%" }]}>
            <View style={s.tableHeaderBlue}>
              <Text style={s.tableTitle}>CLIENTES CRÉDITO / ADELANTO / C.I. / CANJE</Text>
            </View>
            <View style={s.tableSubHeader}>
              <Text style={cx(s.col4_1, s.bold)}>RUC</Text>
              <Text style={cx(s.col4_2, s.bold)}>Gal.</Text>
              <Text style={cx(s.col4_3, s.bold)}>Prod.</Text>
              <Text style={cx(s.col4_4, s.bold)}>Total</Text>
            </View>
            {data.creditClients.map((c, i) => {
              const [gal = "", prod = "", total = "0.00"] = c.value.split(",")
              return (
                <View key={`cred-${i}`} style={cx(s.row4Cols, i % 2 === 1 && s.altRow)}>
                  <Text style={s.col4_1}>{c.label}</Text>
                  <Text style={s.col4_2}>{gal}</Text>
                  <Text style={s.col4_3}>{prod}</Text>
                  <Text style={cx(s.col4_4, s.amount)}>S/ {total}</Text>
                </View>
              )
            })}
          </View>

          {/* === TARJETAS DE CRÉDITO (última sección) === */}
          <View style={[s.table, { width: "100%", marginTop: 20 }]}>
            <View style={s.tableHeaderBlue}>
              <Text style={s.tableTitle}>TARJETAS DE CRÉDITO</Text>
            </View>
            <View style={s.tableSubHeader}>
              <Text style={cx(s.col4_1, s.bold)}>Tarjeta</Text>
              <Text style={cx(s.col4_2, s.bold)}>Ref.</Text>
              <Text style={cx(s.col4_3, s.bold)}>Tipo</Text>
              <Text style={cx(s.col4_4, s.bold)}>Monto</Text>
            </View>
            {data.cardDetails.map((c, i) => {
              const [ref, monto] = c.value.split(",")
              return (
                <View key={`card-${i}`} style={cx(s.row4Cols, i % 2 === 1 && s.altRow)}>
                  <Text style={s.col4_1}>{c.label}</Text>
                  <Text style={s.col4_2}>{ref}</Text>
                  <Text style={s.col4_3}>CRÉDITO</Text>
                  <Text style={cx(s.col4_4, s.amount)}>S/ {monto}</Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
      </View>
    </PdfBase>
  )
}
