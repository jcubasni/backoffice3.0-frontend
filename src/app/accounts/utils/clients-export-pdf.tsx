import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer"
import type { ClientExport } from "./clients-export"

// Colores corporativos
const COLORS = {
  primary: "#004B91",
  primaryLight: "#E8F1FC",
  textDark: "#333333",
  textLight: "#666",
  border: "#D0D7E2",
  titleColor: "#1A4378",
}

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: "Helvetica",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.titleColor,
  },

  headerSubtitle: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },

  metaBlock: {
    marginTop: 8,
    marginBottom: 15,
  },

  metaText: {
    fontSize: 9,
    color: COLORS.textLight,
    marginBottom: 2,
  },

  tableContainer: {
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderBottomWidth: 0.6,
    borderBottomColor: COLORS.border,
  },

  zebraRow: {
    backgroundColor: "#FAFAFA",
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    fontSize: 9,
    textAlign: "center",
    color: COLORS.textLight,
  },

  // Columnas
  colTipo: { width: "10%" },
  colDoc: { width: "13%" },
  colCliente: { width: "15%" },
  colDireccion: { width: "18%" },
  colUbicacion: { width: "18%" },
  colEmail: { width: "13%" },
  colPhone: { width: "8%" },
  colBlock: { width: "5%", textAlign: "center" },
})

// Documento PDF (siempre muestra todas las columnas)
function ClientsPdfDocument({ clients }: { clients: ClientExport[] }) {
  const total = clients.length
  const bloqueados = clients.filter((c) => c.isBlocked).length
  const activos = total - bloqueados
  const now = new Date().toLocaleString()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image src="/img/isi logo new.png" style={styles.logo} />
          <View>
            <Text style={styles.headerTitle}>Reporte de Clientes</Text>
            <Text style={styles.headerSubtitle}>Sistema Backoffice POS</Text>
            <Text style={styles.headerSubtitle}>Generado: {now}</Text>
          </View>
        </View>

        {/* Metadatos */}
        <View style={styles.metaBlock}>
          <Text style={styles.metaText}>Total: {total}</Text>
          <Text style={styles.metaText}>
            Activos: {activos} | Bloqueados: {bloqueados}
          </Text>
        </View>

        {/* Tabla */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.colTipo}>Tipo</Text>
            <Text style={styles.colDoc}>Documento</Text>
            <Text style={styles.colCliente}>Cliente</Text>
            <Text style={styles.colDireccion}>Dirección</Text>
            <Text style={styles.colUbicacion}>Dep / Prov / Dist</Text>
            <Text style={styles.colEmail}>Correo</Text>
            <Text style={styles.colPhone}>Tel</Text>
            <Text style={styles.colBlock}>B</Text>
          </View>

          {clients.map((c, i) => {
            const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim()

            return (
              <View
                key={i}
                style={[styles.row, i % 2 === 0 ? styles.zebraRow : {}]}
              >
                <Text style={styles.colTipo}>{c.documentType}</Text>
                <Text style={styles.colDoc}>{c.documentNumber}</Text>
                <Text style={styles.colCliente}>{fullName}</Text>
                <Text style={styles.colDireccion}>{c.address}</Text>
                <Text style={styles.colUbicacion}>
                  {c.department} / {c.province} / {c.district}
                </Text>
                <Text style={styles.colEmail}>{c.email}</Text>
                <Text style={styles.colPhone}>{c.phone}</Text>
                <Text style={styles.colBlock}>{c.isBlocked ? "Sí" : "No"}</Text>
              </View>
            )
          })}
        </View>

        {/* Footer */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Backoffice POS © 2025 – Página ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  )
}

// Descargar PDF
export async function generateClientsPDF(clients: ClientExport[]) {
  const blob = await pdf(<ClientsPdfDocument clients={clients} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "reporte_clientes.pdf"
  a.click()
  URL.revokeObjectURL(url)
}
