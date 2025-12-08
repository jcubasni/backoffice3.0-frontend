// src/app/pdf/components/daily-report/pdf-sales-report.tsx
import { PDFViewer, Document, Page, Text, View } from "@react-pdf/renderer"
import { SyncLoader } from "react-spinners"
import { useSalesReport } from "../hooks/useReports"
import { Table, TH, TR, TD } from "@ag-media/react-pdf-table"

import { styles as base } from "../styles/pdf-base"

interface PdfSalesReportProps {
  startDate: string
  endDate: string
  docTypes?: string[] // 👈 ahora acepta array
}

export const PdfSalesReport = ({
  startDate,
  endDate,
  docTypes = [], // 👈 valor por defecto vacío
}: PdfSalesReportProps) => {
  const { data, isLoading } = useSalesReport(startDate, endDate, docTypes)

  if (isLoading)
    return (
      <div className="flex size-full items-center justify-center">
        <SyncLoader />
      </div>
    )

  // 👉 Función para formatear fecha como YYYY-MM-DD
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toISOString().split("T")[0]
    } catch {
      return dateStr
    }
  }
  // 🔹 Estilos para la fecha/hora
  const dateTimeContainerStyle = {
    width: "100%",
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    marginBottom: 4,
  }

  const dateTimeStyle = {
    fontSize: 7, // 🔹 más pequeña
    textAlign: "right" as const,
    width: 150,
    fontWeight: "bold" as const,
  }

  // 🔹 Estilos para título centrado
  const titleStyle = {
    fontSize: 9,
    fontWeight: "bold" as const,
    textAlign: "center" as const,
    width: "100%",
  }

  // 🔹 Fecha y hora actual en formato DD/MM/YYYY HH:MM:SS
  const currentDateTime = new Date()
  const formattedDateTime = `FECHA Y HORA: ${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`

  return (
    <PDFViewer className="max-h-full min-h-[60rem] w-full flex-1">
      <Document>
        <Page size="A4" orientation="landscape" style={base.viewer}>
          {/* Fecha y hora arriba del título */}
          <View style={dateTimeContainerStyle}>
            <Text style={dateTimeStyle}>{formattedDateTime}</Text>
          </View>

          {/* Título centrado */}
          <View>
            <Text style={titleStyle}>
              {`REGISTRO DE VENTAS DEL PERIODO DEL ${formatDate(
                startDate,
              )} AL ${formatDate(endDate)}`}
            </Text>
          </View>

          {/* 🔹 Envolvemos la tabla en un View con borde redondeado */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#000000", // 🔹 negro
              borderRadius: 10,
              overflow: "hidden",
              marginTop: 10,
            }}
          >
            <Table
              tdStyle={{ padding: "2px", fontSize: 8 }}
              weightings={[
                0.06, // Periodo
                0.06, // Correlativo
                0.06, // Fecha
                0.25, // Comprobante
                0.35, // Cliente
                0.05, // Base (más angosto)
                0.12, // Exonerada + Inafecta (más ancho)
                0.03, // IGV
                0.03, // Total
              ]}
            >
              {/* Header principal */}
              <TH fixed style={{ fontSize: 9, backgroundColor: "#1e3a8a22" }}>
                <TD style={{ justifyContent: "center", fontSize: 6 }}>
                  PERIODO
                </TD>
                <TD style={{ justifyContent: "center", fontSize: 6 }}>
                  NÚMERO CORRELATIVO
                </TD>
                <TD style={{ justifyContent: "center", fontSize: 6 }}>
                  FECHA DE EMISIÓN DEL COMPROBANT
                </TD>
                {/* Grupo Comprobante */}
                <TD style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 6,
                      marginBottom: 2,
                    }}
                  >
                    COMPROBANTE DE PAGO
                  </Text>
                  <Table tdStyle={{ padding: "1px", fontSize: 6 }}>
                    <TR>
                      <TD
                        style={{
                          borderTopWidth: 1,
                          borderRightWidth: 1,
                          borderBottomWidth: 0,
                          borderLeftWidth: 0,
                          textAlign: "center",
                          minHeight: 31,
                          justifyContent: "center",
                        }}
                      >
                        TIPO
                      </TD>
                      <TD
                        style={{
                          borderTopWidth: 1,
                          borderRightWidth: 1,
                          borderBottomWidth: 0,
                          borderLeftWidth: 0,
                          textAlign: "center",
                          minHeight: 32,
                          justifyContent: "center",
                        }}
                      >
                        DENOMINACIÓN TIPO DOCUMENTO
                      </TD>
                      <TD
                        style={{
                          borderTopWidth: 1,
                          borderRightWidth: 1,
                          borderBottomWidth: 0,
                          borderLeftWidth: 0,
                          textAlign: "center",
                          minHeight: 31,
                          justifyContent: "center",
                        }}
                      >
                        NRO SERIE
                      </TD>
                      <TD
                        style={{
                          borderTopWidth: 1,
                          borderRightWidth: 0,
                          borderBottomWidth: 0,
                          borderLeftWidth: 0,
                          textAlign: "center",
                          minHeight: 31,
                          justifyContent: "center",
                        }}
                      >
                        NÚMERO INICIAL
                      </TD>
                    </TR>
                  </Table>
                </TD>

                {/* Grupo Cliente */}
                <TD style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 6,
                      marginBottom: 2,
                    }}
                  >
                    INFORMACIÓN DEL CLIENTE
                  </Text>
                  <Table
                    tdStyle={{ padding: "1px", fontSize: 8 }}
                    weightings={[0.4, 0.6]}
                  >
                    <TR>
                      {/* Subtabla Documento de Identidad */}
                      <TD style={{ padding: 0 }}>
                        <Table
                          tdStyle={{ padding: "1px", fontSize: 8 }}
                          weightings={[0.5, 0.5]}
                        >
                          <TR>
                            <TD
                              style={{
                                justifyContent: "center",
                                borderTopWidth: 1,
                                borderRightWidth: 0,
                                borderLeftColor: "#FFFFFF",
                                borderBottomWidth: 0,
                                fontSize: 6,
                              }}
                              weighting={2}
                            >
                              DOCUMENTO DE IDENTIDAD
                            </TD>
                          </TR>
                          <TH>
                            <TD
                              style={{
                                justifyContent: "center",
                                fontSize: 6,
                                borderBottomWidth: 1,
                                borderBottomColor: "#FFFFFF",
                                borderLeftWidth: 1,
                                borderLeftColor: "#FFFFFF",
                                minHeight: 23,
                              }}
                            >
                              TIPO
                            </TD>
                            <TD
                              style={{
                                justifyContent: "center",
                                fontSize: 6,
                                borderBottomWidth: 1,
                                borderBottomColor: "#FFFFFF",
                                borderLeftWidth: 1,
                              }}
                            >
                              NUMERO
                            </TD>
                          </TH>
                        </Table>
                      </TD>

                      {/* Columna Cliente */}
                      <TD
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                          fontSize: 6,
                          borderRightWidth: 0,
                          borderBottomWidth: 0,
                        }}
                      >
                        CLIENTE
                      </TD>
                    </TR>
                  </Table>
                </TD>
                {/* Columnas directas */}
                <TD style={{ justifyContent: "center", fontSize: 6 }}>
                  BASE IMPONILE DE LA OPERACIÓN GRAVADA
                </TD>

                {/* Grupo Montos: Exonerada + Inafecta */}
                <TD style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 6,
                      marginBottom: 2,
                    }}
                  >
                    IMPORTE TOTAL DE LA OPERACIÓN EXONERADA O INFECTA{" "}
                  </Text>
                  <Table tdStyle={{ padding: "1px", fontSize: 6 }}>
                    <TH>
                      <TD
                        style={{
                          justifyContent: "center",
                          borderBottomWidth: 0,
                          borderLeftWidth: 0,
                          minHeight: 19,
                        }}
                      >
                        EXONERADA
                      </TD>
                      <TD
                        style={{
                          justifyContent: "center",
                          borderBottomWidth: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                        }}
                      >
                        INAFECTA
                      </TD>
                    </TH>
                  </Table>
                </TD>

                <TD style={{ justifyContent: "center", fontSize: 6 }}>IGV</TD>
                <TD style={{ justifyContent: "center", fontSize: 6 }}>Total</TD>
              </TH>

              {/* Filas dinámicas */}
              {data?.map((sale, idx) => (
                <TR key={idx} style={{ fontSize: 8 }}>
                  <TD style={{ justifyContent: "center" }}>{sale.periodo}</TD>
                  <TD style={{ justifyContent: "center" }}>
                    {sale.correlativo}
                  </TD>
                  <TD style={{ justifyContent: "center" }}>
                    {formatDate(sale.fechaEmision)}
                  </TD>

                  {/* Comprobante */}
                  <TD>
                    <Table tdStyle={{ padding: "1px", fontSize: 8 }}>
                      <TR>
                        <TD
                          style={{
                            justifyContent: "center",
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 1,
                            borderTopWidth: 0,
                            minHeight: 13,
                          }}
                        >
                          {sale.tipoComprobante}
                        </TD>
                        <TD
                          style={{
                            justifyContent: "center",
                            borderBottomWidth: 0,
                            borderLeftWidth: 1,
                            borderRightWidth: 0,
                            borderTopWidth: 0,
                          }}
                        >
                          {sale.denominacionTipoDocumento}
                        </TD>
                        <TD
                          style={{
                            justifyContent: "center",
                            borderBottomWidth: 0,
                            borderLeftWidth: 1,
                            borderRightWidth: 0,
                            borderTopWidth: 0,
                          }}
                        >
                          {sale.serie}
                        </TD>
                        <TD
                          style={{
                            justifyContent: "center",
                            borderBottomWidth: 0,
                            borderLeftWidth: 1,
                            borderRightWidth: 0,
                            borderTopWidth: 0,
                          }}
                        >
                          {sale.numero}
                        </TD>
                      </TR>
                    </Table>
                  </TD>

                  {/* Cliente */}
                  <TD>
                    <Table
                      tdStyle={{
                        padding: "1px",
                        fontSize: 8,
                        justifyContent: "center",
                      }}
                      weightings={[0.4, 0.6]}
                    >
                      <TR>
                        {/* Subtabla Documento de Identidad */}
                        <TD style={{ borderRightWidth: 0, padding: 0 }}>
                          <Table
                            tdStyle={{ padding: "1px", fontSize: 8 }}
                            weightings={[0.5, 0.5]}
                          >
                            <TR>
                              <TD
                                style={{
                                  borderColor: "#FFFFFF",
                                  fontSize: 8,
                                  justifyContent: "center",
                                }}
                              >
                                {sale.clienteDocTipo}
                              </TD>

                              <TD
                                style={{
                                  borderTopColor: "#FFFFFF",
                                  borderBottomColor: "#FFFFFF",
                                  justifyContent: "center",
                                }}
                              >
                                {sale.clienteDocNumero}
                              </TD>
                            </TR>
                          </Table>
                        </TD>

                        {/* Columna Cliente */}
                        <TD
                          style={{
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            paddingLeft: 3,
                          }}
                        >
                          {sale.clienteNombre}
                        </TD>
                      </TR>
                    </Table>
                  </TD>

                  {/* Columna Base */}
                  <TD style={{ justifyContent: "center" }}>
                    {sale.baseGravada}
                  </TD>

                  {/* Grupo Montos: Exonerada + Inafecta */}
                  <TD>
                    <Table
                      tdStyle={{
                        padding: "1px",
                        fontSize: 8,
                        justifyContent: "center",
                      }}
                      weightings={[0.5, 0.5]}
                    >
                      <TR>
                        <TD
                          style={{
                            borderLeftWidth: 0,
                            borderRightWidth: 1,
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            minHeight: 13,
                          }}
                        >
                          {sale.exonerada}
                        </TD>
                        <TD
                          style={{
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                          }}
                        >
                          {sale.inafecto}
                        </TD>
                      </TR>
                    </Table>
                  </TD>

                  {/* Columna IGV */}
                  <TD style={{ justifyContent: "center" }}>{sale.igv}</TD>
                  {/* Columna Total */}
                  <TD style={{ justifyContent: "center" }}>
                    {sale.totalComprobante}
                  </TD>
                </TR>
              ))}
            </Table>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}
