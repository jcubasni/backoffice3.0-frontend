import { ColumnDef } from "@tanstack/react-table";

export const addPurchaseColumns: ColumnDef<any>[] = [
  {
    header: "Producto",
  },
  {
    header: "Descripción",
  },
  {
    header: "Cantidad",
  },
  {
    header: "Unidad medida",
  },
  {
    header: "Cantidad recibida",
  },
  {
    header: "Precio unitario",
  },
  {
    header: "Impuesto",
  },
  {
    header: "Subtotal",
  },
  {
    header: "Total",
  },
];
