// src/app/pdf/components/clients/clients-pdf-document.tsx
"use client"

import { Document, Page, Text, View, Image } from "@react-pdf/renderer"
import type { ClientExport } from "@/app/accounts/utils/clients-export"
import { clientPdfStyles as styles } from "./clients-pdf.styles"

interface ClientsPdfDocumentProps {
  clients: ClientExport[]
}

export default function ClientsPdfDocument({ clients }: ClientsPdfDocumentProps) {
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
          {/* Encabezado */}
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

          {/* Filas */}
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
            `Backoffice POS © 2025 – Reporte de clientes | Página ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  )
}
