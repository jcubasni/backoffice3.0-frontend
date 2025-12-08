import { StyleSheet } from "@react-pdf/renderer"

export const liquidationStyles = StyleSheet.create({
  /* === CONFIGURACIÓN GENERAL === */
  page: {
    padding: 25,
    fontFamily: "Helvetica",
    fontSize: 8.2, 
    color: "#333",
  },
    /* === SEGUNDA PÁGINA SIN MÁRGENES === */
  pageFullWidth: {
    paddingVertical: 25,
    paddingHorizontal: 0, 
    fontFamily: "Helvetica",
    fontSize: 8.2,
    color: "#333",
  },


  /* === CABECERA PRINCIPAL === */
  headerContainer: {
    backgroundColor: "#0A3979",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 9,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 7.8,
    marginTop: 1.5,
  },

  /* === SECCIONES === */
  sectionTitle: {
    fontSize: 9,
    marginTop: 11,
    marginBottom: 3,
    fontWeight: "bold",
    color: "#0A3979",
  },
  smallText: {
    fontSize: 7,
    color: "#666",
  },

  /* === TARJETAS DE RESUMEN === */
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  card: {
    border: "0.6pt solid #E0E0E0",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
    width: "23%",
    backgroundColor: "#FAFAFA",
  },
  cardTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 0.5,
  },
  blueAmount: {
    color: "#0A3979",
    fontWeight: "bold",
    fontSize: 9,
  },

  /* === TABLAS PROFESIONALES === */
  table: {
    borderRadius: 8,
    border: "0.5pt solid #E0E0E0",
    overflow: "hidden",
    marginBottom: 7,
  },

  /* === CABECERA AZUL === */
  tableHeaderBlue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A3979",
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },

  /* === SUBHEADER GRIS CLARO === */
  tableSubHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E9F3",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottom: "0.4pt solid #D0D5E0",
  },

  /* === FILAS === */
  row3Cols: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "0.4pt solid #EAEAEA",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  row2Cols: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "0.4pt solid #EAEAEA",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  row4Cols: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "0.4pt solid #EAEAEA",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },

  /* === COLUMNAS === */
  colDesc: { width: "60%", paddingLeft: 2 },
  colCode: { width: "15%", textAlign: "center" },
  colAmount: { width: "25%", textAlign: "right", paddingRight: 2 },

  colLabel: { width: "70%", paddingLeft: 2 },
  colValue: { width: "30%", textAlign: "right", paddingRight: 2 },

  col4_1: { width: "25%", paddingLeft: 2 },
  col4_2: { width: "20%", textAlign: "center" },
  col4_3: { width: "30%", textAlign: "center" },
  col4_4: { width: "25%", textAlign: "right", paddingRight: 2 },

  /* === TOTAL / ALTERNADAS === */
  altRow: { backgroundColor: "#FFFFFF" },
  totalRowGray: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0FB",
    borderTop: "0.4pt solid #C0D3F5",
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  totalTextBlue: {
    color: "#0A3979",
    fontWeight: "bold",
  },

  /* === TEXTO === */
  amount: {
    fontWeight: "bold",
    color: "#222",
    fontSize: 7.2, // 
  },
  bold: { fontWeight: "bold" },

  tableTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 8.5,
    textTransform: "uppercase",
    textAlign: "center",
    width: "100%",
  },

  /* === DISTRIBUCIÓN EN COLUMNAS === */
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6, 
    gap: 6, 
  },
  col: { width: "48%" },

  /* === CONTÓMETROS === */
  contometrosSubHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E9F3",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottom: "0.4pt solid #D0D5E0",
  },
  contometrosRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "0.4pt solid #EAEAEA",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  colLado: { width: "10%" },
  colProducto: { width: "20%" },
  colContometro: { width: "14%", textAlign: "center" },
  colVenta: { width: "14%", textAlign: "center" },
  colDiferencia: {
    width: "14%",
    textAlign: "right",
    color: "#0A3979",
    fontWeight: "bold",
    paddingRight: 2,

  },

  /* === VENTAS HOSE === */
ventasHoseSubHeader: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#E5E9F3",
  paddingVertical: 4,
  paddingHorizontal: 4,
  borderBottom: "0.4pt solid #D0D5E0",
},

ventasHoseRow: {
  flexDirection: "row",
  alignItems: "center",
  borderBottom: "0.4pt solid #EAEAEA",
  paddingVertical: 3,
  paddingHorizontal: 4,
},

colHoseLado: { width: "14%" },
colHoseProducto: { width: "40%" },
colHosePrecio: { width: "15%", textAlign: "center" },
colHoseCantidad: { width: "15%", textAlign: "center" },
colHoseTotal: { width: "16%", textAlign: "right", paddingRight: 2 },


})
