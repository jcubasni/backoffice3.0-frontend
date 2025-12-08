// src/app/pdf/styles/shortage-overage-report.ts
import { StyleSheet } from "@react-pdf/renderer"

export const paymentTypeStyles = StyleSheet.create({
  /* === ESTILO DE LA PÁGINA === */
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#333",
  },

  /* === ENCABEZADO DEL REPORTE === */
  headerContainer: {
    backgroundColor: "#0A3979", // fondo azul
    color: "#fff", // texto blanco
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 13, fontWeight: "bold" }, // nombre de la empresa
  headerText: { fontSize: 9, marginTop: 2 }, // RUC, dirección y fechas

  /* === TABLA PRINCIPAL === */
  tableContainer: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "#B0B8D1",
    borderRadius: 4,
    overflow: "hidden",
  },

  // fila de encabezado de tabla
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0A3979", // azul
    color: "#fff", // texto blanco
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: "bold",
  },

  // fila normal de datos
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#B0B8D1",
  },

  // columna de cada celda
  col: { flex: 1, textAlign: "center", fontSize: 8 },

  /* === FILA DE TOTAL GENERAL === */
  totalRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#B0B8D1",
    backgroundColor: "#EDEFF3", // fondo gris claro
  },
  totalLabel: {
    flex: 5,
    textAlign: "right",
    fontWeight: "bold",
    paddingRight: 4,
  },
  totalValue: { flex: 1, textAlign: "right", fontWeight: "bold" },
})
