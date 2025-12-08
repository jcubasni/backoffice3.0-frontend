// src/app/pdf/components/Excel/export-shortage-overage-excel.ts
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { ShortageOverageReport } from "../../services/report.service"
import { formatDate } from "../pdf-base"

export async function exportShortageOverageToExcel(
  data: ShortageOverageReport[],
  startDate: string,
  endDate: string,
) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Faltantes-Sobrantes")

  // 🔹 Fecha y hora actual
  const currentDateTime = new Date()
  const formattedDateTime = `FECHA Y HORA: ${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`

  // 🔹 Fila de fecha/hora
  const dateRow = sheet.addRow([formattedDateTime])
  dateRow.font = { bold: true, size: 9, name: "Calibri" }
  dateRow.alignment = { horizontal: "right" }
  sheet.mergeCells(`A${dateRow.number}:G${dateRow.number}`) // Ajustar según número de columnas

  // 🔹 Fila vacía
  sheet.addRow([])

  // 🔹 Fila de título centrado
  const titleRow = sheet.addRow([
    `REPORTE DE FALTANTES Y SOBRANTES DEL PERIODO DEL ${formatDate(
      startDate,
    )} AL ${formatDate(endDate)}`,
  ])
  sheet.mergeCells(`A${titleRow.number}:G${titleRow.number}`)
  titleRow.font = { bold: true, size: 11, name: "Calibri" }
  titleRow.alignment = { horizontal: "center", vertical: "middle" }

  // 🔹 Fila vacía antes de los encabezados
  sheet.addRow([])

  // 🔹 Cabeceras
  const headers = [
    "FECHA",
    "CÓDIGO",
    "NOMBRE",
    "TURNO",
    "DEPÓSITO",
    "VENTAS",
    "FALT/SOBR",
  ]
  const headerRow = sheet.addRow(headers)

  // 🔹 Anchos de columnas
  sheet.columns = [
    { width: 15 }, // FECHA
    { width: 12 }, // CÓDIGO
    { width: 25 }, // NOMBRE
    { width: 12 }, // TURNO
    { width: 15 }, // DEPÓSITO
    { width: 15 }, // VENTAS
    { width: 15 }, // FALT/SOBR
  ]

  // 🔹 Estilos para cabecera
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, name: "Calibri", size: 11 }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDCE6F1" }, // azul claro
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
      formatDate(row.fecha),
      row.codigo,
      row.nombre,
      row.turno,
      row.deposito,
      row.ventas,
      row.faltSobr,
    ])
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
  saveAs(new Blob([buffer]), "faltantes-sobrantes.xlsx")
}
