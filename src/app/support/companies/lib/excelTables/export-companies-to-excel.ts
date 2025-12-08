import * as XLSX from "xlsx"

// Utilidad para convertir booleanos a texto
const formatBoolean = (value: boolean) => (value ? "Sí" : "No")

export const exportCompaniesToExcel = (companies: any[]) => {
  const data = companies.map((company) => ({
    ID: company.id,
    Host: company.host,
    RUC: company.ruc,
    Empresa: company.name,
    Correo: company.email,
    "Está inactivo (Baja)": formatBoolean(company.isInactive),
    "Está bloqueado": formatBoolean(company.isBlocked),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Empresas")

  const now = new Date()
  const timestamp = now
    .toLocaleDateString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-") // formato: dd-mm-yyyy

  const fileName = `ReporteEmpresas_${timestamp}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
