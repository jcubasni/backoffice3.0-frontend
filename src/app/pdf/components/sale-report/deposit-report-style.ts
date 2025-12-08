// src/app/pdf/styles/shortage-overage-report.ts
import { StyleSheet } from "@react-pdf/renderer";

export const depositStyles = StyleSheet.create({
  /* === ESTILO DE LA PÁGINA === */
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#333",
    lineHeight: 1.4,
  },

  /* === ENCABEZADO DEL REPORTE === */
  headerContainer: {
    backgroundColor: "#0A3979",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  headerTitle: { fontSize: 14, fontWeight: "bold" },
  headerText: { fontSize: 9, marginTop: 2 },

  /* === TABLA PRINCIPAL === */
  tableContainer: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "#B0B8D1",
    borderRadius: 6,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0A3979",
    color: "#fff",
    paddingVertical: 5,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#B0B8D1",
    alignItems: "center",
  },

  col: {
    flex: 1,
    textAlign: "center",
    fontSize: 8.5,
    paddingHorizontal: 2,
  },

  /* === TOTAL POR TURNO === */
  totalRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#B0B8D1",
    backgroundColor: "#EDEFF3",
  },
  totalLabel: {
    flex: 5,
    textAlign: "right",
    fontWeight: "bold",
    paddingRight: 6,
  },
  totalValue: { flex: 1, textAlign: "right", fontWeight: "bold" , marginRight: 2},

  /* === ESTILO ESPECÍFICO PARA POR DEPOSITAR === */
  porDepositar: {
    color: "#D93025", // rojo
    fontWeight: "bold",
  },
});
