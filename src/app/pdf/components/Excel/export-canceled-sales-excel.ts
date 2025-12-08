// src/app/pdf/components/Excel/export-canceled-sales-excel.ts
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { CanceledSalesReport } from "../../services/report.service"
import { formatDate } from "../pdf-base"

export async function exportCanceledSalesToExcel(
  data: CanceledSalesReport[],
  startDate: string,
  endDate: string,
) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Ventas Anuladas")

  // 🔹 Fecha y hora actual
  const currentDateTime = new Date()
  const formattedDateTime = `FECHA Y HORA: ${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`

  // 🔹 Fila de fecha/hora
  const dateRow = sheet.addRow([formattedDateTime])
  dateRow.font = { bold: true, size: 9, name: "Calibri" }
  dateRow.alignment = { horizontal: "right" }
  sheet.mergeCells(`A${dateRow.number}:X${dateRow.number}`) // Ajustar según número de columnas

  // 🔹 Fila vacía
  sheet.addRow([])

  // 🔹 Fila de título centrado
  const titleRow = sheet.addRow([
    `REPORTE DE VENTAS ANULADAS DEL PERIODO DEL ${formatDate(
      startDate,
    )} AL ${formatDate(endDate)}`,
  ])
  sheet.mergeCells(`A${titleRow.number}:X${titleRow.number}`)
  titleRow.font = { bold: true, size: 11, name: "Calibri" }
  titleRow.alignment = { horizontal: "center", vertical: "middle" }

  // 🔹 Fila vacía antes de los encabezados
  sheet.addRow([])

  // 🔹 Cabeceras
  const headers = [
    "LOCAL",
    "TIPO DOCUMENTO",
    "NRO DOCUMENTO",
    "FECHA DOCUMENTO",
    "FECHA DE SISTEMA",
    "NRO PUNTO",
    "USUARIO",
    "DOCUMENTO CLIENTE",
    "CLIENTE",
    "CÓDIGO ARTICULO",
    "ARTICULO",
    "GRUPO",
    "UNIDAD MEDIDA",
    "CANTIDAD",
    "PRECIO",
    "MONEDA",
    "SUBTOTAL",
    "IMPUESTO",
    "TOTAL",
    "DSCTO",
    "TIPO CAMBIO",
    "DS TIPO DOC",
    "USUARIO ANULA",
    "FECHA ANULACIÓN",
  ]
  const headerRow = sheet.addRow(headers)

  // 🔹 Anchos de columnas
  // 🔹 Anchos de columnas personalizados
  sheet.columns = [
    { width: 12 }, // LOCAL
    { width: 16 }, // TIPO DOCUMENTO
    { width: 18 }, // NRO DOCUMENTO
    { width: 17 }, // FECHA DOCUMENTO
    { width: 17 }, // FECHA DE SISTEMA
    { width: 12 }, // NRO PUNTO
    { width: 15 }, // USUARIO
    { width: 20 }, // DOCUMENTO CLIENTE
    { width: 55 }, // CLIENTE
    { width: 17 }, // CÓDIGO ARTICULO
    { width: 25 }, // ARTICULO
    { width: 12 }, // GRUPO
    { width: 15 }, // UNIDAD MEDIDA
    { width: 12 }, // CANTIDAD
    { width: 12 }, // PRECIO
    { width: 10 }, // MONEDA
    { width: 15 }, // SUBTOTAL
    { width: 12 }, // IMPUESTO
    { width: 15 }, // TOTAL
    { width: 12 }, // DSCTO
    { width: 12 }, // TIPO CAMBIO
    { width: 12 }, // DS TIPO DOC
    { width: 16 }, // USUARIO ANULA
    { width: 18 }, // FECHA ANULACIÓN
  ]

  // 🔹 Estilos para cabecera (color azul claro, negrita, bordes)
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, name: "Calibri", size: 11 }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDCE6F1" },
    }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })

  // 🔹 Filas de datos
  data.forEach((row) => {
    const dataRow = sheet.addRow([
      row.localCodigo,
      row.tipoDocumento,
      row.nroDocumento,
      formatDate(row.fechaDocumento),
      formatDate(row.fechaSistema),
      row.nroPunto,
      row.usuario,
      row.documentoCliente,
      row.clienteNombre,
      row.codigoArticulo,
      row.articulo,
      row.grupo,
      row.unidadMedida,
      row.cantidad,
      row.precio,
      row.moneda,
      row.subtotal,
      row.impuesto,
      row.total,
      row.dscto,
      row.tipoCambio,
      row.dsTipoDoc,
      row.usuarioAnula,
      formatDate(row.fechaAnulacion),
    ])

    // 🔹 Estilo y bordes para cada celda
    dataRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 11 }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })
    dataRow.height = 18
  })

  // 🔹 Exportar archivo
  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), "ventas-anuladas.xlsx")
}
