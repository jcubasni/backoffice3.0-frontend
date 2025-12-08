import { StyleSheet } from "@react-pdf/renderer"
import { Colors } from "@/shared/types/constans"

export const styles = StyleSheet.create({
  tableHeader: {
    fontSize: 7,
    fontWeight: "normal",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: Colors.bg,
    textAlign: "center",
    // height: 20,
  },
  headerCell: {
    flexDirection: "column",
    justifyContent: "center",
    borderTop: 0,
    borderBottom: 0,
    borderLeft: 0,
    borderRight: 0,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 20,
    textAlign: "center",
  },
  contentCell: {
    fontSize: 7,
    justifyContent: "center",
    fontWeight: "normal",
    borderTop: 0,
    borderBottom: 0,
    borderLeft: 0,
    borderRight: 0,
    paddingTop: 4,
    paddingBottom: 4,
    height: 20,
    textAlign: "center",
  },
  footerCell: {
    borderTop: 1,
    borderTopColor: Colors.border,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
    height: 20,
  },
})


