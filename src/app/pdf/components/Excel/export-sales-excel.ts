import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { SalesReport } from "../../services/report.service"
import { formatDate } from "../pdf-base"

export async function exportSalesToExcel(
  data: SalesReport[],
  startDate: string,
  endDate: string,
) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Reporte Ventas")

  // 🔹 Fecha y hora actual
  const currentDateTime = new Date()
  const formattedDateTime = `FECHA Y HORA: ${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`
  const dateRow = sheet.addRow([formattedDateTime])
  sheet.mergeCells(`A${dateRow.number}:O${dateRow.number}`)
  dateRow.getCell(1).font = { bold: true, name: "Calibri", size: 9 }
  dateRow.getCell(1).alignment = { horizontal: "right" }
  // No borde ni color de fondo para la fecha

  // 🔹 Título del reporte centrado en columnas F a J
  const titleRow = sheet.addRow([]) // fila vacía primero

  // 🔹 Fusionar solo las celdas de la F a la J
  sheet.mergeCells(`E${titleRow.number}:J${titleRow.number}`)

  // 🔹 Asignar el valor a la primera celda de la fusión
  const titleCell = sheet.getCell(`F${titleRow.number}`)
  titleCell.value = `REGISTRO DE VENTAS DEL PERIODO DEL ${formatDate(startDate)} AL ${formatDate(endDate)}`

  // 🔹 Aplicar estilo centrado y en negrita
  titleCell.font = { bold: true, name: "Calibri", size: 11 }
  titleCell.alignment = { horizontal: "center", vertical: "middle" }

  // No borde ni color de fondo para el título

  // 🔹 Fila vacía antes de los headers
  sheet.addRow([])

  // 🔹 Definir cabeceras
  const headers = [
    "PERIODO",
    "NÚMERO CORRELATIVO",
    "FECHA DE EMISIÓN",
    "TIPO",
    "DENOMINACIÓN TIPO DOCUMENTO",
    "NRO SERIE",
    "NÚMERO INICIAL",
    "DOC TIPO",
    "DOC NÚMERO",
    "CLIENTE",
    "BASE GRAVADA",
    "EXONERADA",
    "INAFECTA",
    "IGV",
    "TOTAL",
  ]

  const headerRow = sheet.addRow(headers)

  // 🔹 Estilos de los headers con color y bordes
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

  // 🔹 Ancho fijo de columnas
  sheet.columns = [
    { width: 12 },
    { width: 22 },
    { width: 17 },
    { width: 10 },
    { width: 35 },
    { width: 12 },
    { width: 15 },
    { width: 12 },
    { width: 18 },
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 12 },
    { width: 15 },
  ]

  // 🔹 Filas de datos con bordes
  data.forEach((sale) => {
    const row = sheet.addRow([
      sale.periodo,
      sale.correlativo,
      formatDate(sale.fechaEmision),
      sale.tipoComprobante,
      sale.denominacionTipoDocumento,
      sale.serie,
      sale.numero,
      sale.clienteDocTipo,
      sale.clienteDocNumero,
      sale.clienteNombre,
      sale.baseGravada,
      sale.exonerada,
      sale.inafecto,
      sale.igv,
      sale.totalComprobante,
    ])

    row.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 11 }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      // 🔹 Bordes igual que los headers
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })
    row.height = 18
  })

  // 🔹 Exportar archivo
  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), "reporte-ventas.xlsx")
}
