// src/app/pdf/components/clients/clients-pdf.styles.ts
import { StyleSheet } from "@react-pdf/renderer"

const COLORS = {
  primary: "#004B91",
  primaryLight: "#E8F1FC",
  textDark: "#333333",
  textLight: "#666",
  border: "#D0D7E2",
  titleColor: "#1A4378",
}

export const clientPdfStyles = StyleSheet.create({
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
  colCliente: { width: "18%" },
  colDireccion: { width: "18%" },
  colUbicacion: { width: "18%" },
  colEmail: { width: "13%" },
  colPhone: { width: "8%" },
  colBlock: { width: "5%", textAlign: "center" },
})
    