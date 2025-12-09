// src/app/accounts/utils/clients-export.ts

export type ClientExport = {
  documentType?: string
  documentNumber?: string
  firstName?: string
  lastName?: string
  address?: string
  department?: string
  province?: string
  district?: string
  email?: string
  phone?: string
  isBlocked?: boolean
}

// 🔥 Mapea los datos reales del backend a un formato plano listo para CSV
export function mapClientsToExport(clients: any[]): ClientExport[] {
  return clients.map((c) => ({
    documentType: c.documentType?.name ?? "",
    documentNumber: c.documentNumber ?? "",
    firstName: c.firstName ?? "",
    lastName: c.lastName ?? "",
    address: c.address ?? "",
    department: c.department ?? "",
    province: c.province ?? "",
    district: c.district ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    isBlocked: c.accounts?.[0]?.status ?? false,
  }))
}

/**
 * Exporta clientes a CSV con formato profesional, igual que antes,
 * pero ahora con todas las columnas completas.
 */
export function exportClientsToCSV(clients: ClientExport[]) {
  if (!clients || clients.length === 0) return

  // --- ENCABEZADOS SUPERIORES (titulo, fecha, separador) ---
  const titleRow = ["************** CLIENTES **************"]
  const dateRow = [`Reporte generado: ${new Date().toLocaleString()}`]
  const separatorRow = ["----------------------------------------"]
  const emptyRow = [""]

  // --- ENCABEZADOS DE COLUMNA ---
  const headers = [
    "Tipo documento",
    "N° documento",
    "Cliente",
    "Dirección",
    "Departamento",
    "Provincia",
    "Distrito",
    "Correo",
    "Teléfono",
    "Bloqueado",
  ]

  // --- FILAS DE DATOS ---
  const rows = clients.map((c) => {
    const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim()

    return [
      c.documentType ?? "",
      "\t" + (c.documentNumber ?? ""), // evita formato científico en Excel
      fullName,
      c.address ?? "",
      c.department ?? "",
      c.province ?? "",
      c.district ?? "",
      c.email ?? "",
      c.phone ?? "",
      c.isBlocked ? "Sí" : "No",
    ]
  })

  // --- CONSTRUCTOR CSV ---
  const escapeCSV = (value: string) => String(value)

  const csvContent = [
    titleRow,
    dateRow,
    separatorRow,
    emptyRow,
    headers,
    ...rows,
  ]
    .map((row) => row.map(escapeCSV).join(";"))
    .join("\n")

  // --- BOM para acentos en Excel ---
  const BOM = "\uFEFF"

  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "clientes.csv"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
