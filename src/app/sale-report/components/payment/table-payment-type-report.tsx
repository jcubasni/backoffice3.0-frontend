"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ByPaymentType } from "@/app/sale-report/types/sale-report.type";

interface Props {
  data: ByPaymentType[];
}

export function TablePaymentTypeReport({ data }: Props) {
  if (!data.length) return null;

  return (
    <div className="mt-4 max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 shadow-xl">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow className="bg-primary text-primary-foreground">
            {[
              "Nro. Venta",
              "Fecha",
              "Documento",
              "Serie",
              "Correlativo",
              "Doc. Identidad",
              "Nro. Doc.",
              "Cliente",
              "Total",
              "Moneda",
              "Tipo Pago",
              "Forma Pago",
              "Placa",
            ].map((title) => (
              <TableHead
                key={title}
                className="sticky top-0 z-10 bg-primary px-3 py-2 font-semibold text-primary-foreground"
              >
                {title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-200 bg-white">
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              className={
                idx % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50 transition-colors hover:bg-gray-100"
              }
            >
              <TableCell>{row.venta_id?.slice(0, 8) || "-"}</TableCell>
              <TableCell>{row.fecha_emision?.split("T")[0] || "-"}</TableCell>
              <TableCell>{row.tipo_documento || "-"}</TableCell>
              <TableCell>{row.serie || "-"}</TableCell>
              <TableCell>{row.correlativo || "-"}</TableCell>
              <TableCell>{row.doc_identidad || "-"}</TableCell>
              <TableCell>{row.ruc_dni || "-"}</TableCell>
              <TableCell>{row.cliente || "-"}</TableCell>
              <TableCell className="font-semibold">
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency: row.moneda || "PEN",
                }).format(row.total_venta ?? 0)}
              </TableCell>
              <TableCell>{row.moneda ?? "-"}</TableCell>
              <TableCell>{row.tipo_pago || "-"}</TableCell>
              <TableCell>{row.forma_pago || "-"}</TableCell>
              <TableCell>{row.placa_vehiculo || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
