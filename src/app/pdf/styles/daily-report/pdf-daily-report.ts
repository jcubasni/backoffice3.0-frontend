import { StyleSheet } from "@react-pdf/renderer"

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gap: {
    gap: 6,
  },
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 10,
  },
})
