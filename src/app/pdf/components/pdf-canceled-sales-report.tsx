// src/app/pdf/components/daily-report/pdf-canceled-sales-report.tsx
import { PDFViewer, Text, View } from "@react-pdf/renderer"
import { SyncLoader } from "react-spinners"
import { useCanceledSalesReport } from "../hooks/useReports"

import { PdfBase } from "./pdf-base"
import { styles as table } from "../styles/daily-report/table"

interface PdfCanceledSalesReportProps {
  startDate: string
  endDate: string
  docTypes?: string[] // ahora es array
}

export const PdfCanceledSalesReport = ({
  startDate,
  endDate,
  docTypes = [], // ahora es array
}: PdfCanceledSalesReportProps) => {
  const { data, isLoading } = useCanceledSalesReport(
    startDate,
    endDate,
    docTypes,
  )
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
    marginBottom: 5,
  }

  // 🔹 Fecha y hora actual en formato DD/MM/YYYY HH:MM:SS
  const currentDateTime = new Date()
  const formattedDateTime = `FECHA Y HORA: ${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`

  return (
    <PDFViewer className="max-h-full min-h-[60rem] w-full flex-1">
      <PdfBase size="A4" orientation="landscape">
        {/* 🔹 Fecha y hora arriba del título */}
        <View style={dateTimeContainerStyle}>
          <Text style={dateTimeStyle}>{formattedDateTime}</Text>
        </View>

        {/* 🔹 Título centrado con rango de fechas */}
        <View>
          <Text style={titleStyle}>
            {`REPORTE DE VENTAS ANULADAS DEL PERIODO DEL ${formatDate(
              startDate,
            )} AL ${formatDate(endDate)}`}
          </Text>
        </View>
        {/* Tabla */}
        <View style={{ marginTop: 10 }}>
          {/* Header */}
          <View style={[table.tableHeader, { flexDirection: "row" }]}>
            <Text style={[table.headerCell, { flex: 1 }]}>TIPO DOCUMENTO</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>NRO DOCUMENTO</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>FECHA DOCUMENTO</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>NRO PUNTO</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>
              DOCUMENTO CLIENTE
            </Text>
            <Text style={[table.headerCell, { flex: 1 }]}>CLIENTE</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>CÓDIGO ARTICULO</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>ARTICULO</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>TOTAL</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>USUARIO ANULA</Text>
            <Text style={[table.headerCell, { flex: 1 }]}>FECHA ANULACIÓN</Text>
          </View>

          {/* Rows */}
          {data?.map((row, idx) => (
            <View key={idx} style={{ flexDirection: "row" }}>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.tipoDocumento}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.nroDocumento}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {formatDate(row.fechaDocumento)}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.nroPunto}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.documentoCliente}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.clienteNombre}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.codigoArticulo}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.articulo}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>{row.total}</Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {row.usuarioAnula}
              </Text>
              <Text style={[table.contentCell, { flex: 1 }]}>
                {formatDate(row.fechaAnulacion)}
              </Text>
            </View>
          ))}
        </View>
      </PdfBase>
    </PDFViewer>
  )
}
