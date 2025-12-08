import { StyleSheet } from "@react-pdf/renderer"

export const shortageOverageStyles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#333",
  },

  /* === HEADER === */
  headerContainer: {
    backgroundColor: "#0A3979",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 13, fontWeight: "bold" },
  headerText: { fontSize: 9, marginTop: 2 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    color: "#0A3979",
  },
  smallText: { fontSize: 8, color: "#666" },

  /* === TABLA === */
  table: {
    borderRadius: 6,
    border: "0.75pt solid #E0E0E0",
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeaderBlue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A3979",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    textAlign: "center",
    width: "100%",
  },

  /* === CABECERA === */
  tableHeaderTwoRows: {
    backgroundColor: "#FFFFFF",
    borderBottom: "0.75pt solid #B0B8D1",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottom: "0.5pt solid #B0B8D1",
  },
  headerBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
    paddingHorizontal: 6,
  },

  /* === FILAS === */
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRowBorder: {
    borderBottom: "0.5pt solid #E0E0E0", // ✅ borde común
  },
  altRow: {
    backgroundColor: "#F9FAFB", // ✅ fila alternada
  },
  bold: { fontWeight: "bold" },

  /* === COLUMNAS === */
  colCaja: { width: "10%", textAlign: "center" },
  colResp: { width: "15%", textAlign: "center" },
  colGroup: {
    width: "25%",
    flexDirection: "column",
    alignItems: "center",
  },
    colTurno: {
    width: "15%",
    textAlign: "center",
    },
    colUser: {
      width: "20%",
      textAlign: "left",
    },


  /* === Subencabezados y valores === */
  innerGroupHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    marginTop: 2,
  },
  innerGroup: {
    flexDirection: "row",
    width: "100%",
  },
  subHeaderText: {
    width: "33.3%",
    textAlign: "center",
    fontSize: 7,
    color: "#333",
    lineHeight: 1.1,
    marginVertical: 0,
  },
  valueText: {
    width: "33.3%",
    textAlign: "right",
    fontSize: 8,
    paddingRight: 2,
  },

  /* === FALTANTE/SOBRANTE === */
  colBalance: {
    width: "17%",
    textAlign: "center",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    marginLeft: 8,
  },
  positiveBalance: { color: "#222" },
  negativeBalance: { color: "#D32F2F" },

  /* === TOTALES === */
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEFF3",
    borderTop: "0.75pt solid #B0B4BC",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  totalLabel: {
    width: "25%",
    textAlign: "right",
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#0A3979",
    paddingRight: 4,
  },
  totalGroup: {
    width: "25%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalValue: {
    width: "33.3%",
    textAlign: "right",
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#0A3979",
    paddingRight: 2,
  },
  totalBalance: {
    width: "17%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#0A3979",
    marginLeft: 8,
  },
})
