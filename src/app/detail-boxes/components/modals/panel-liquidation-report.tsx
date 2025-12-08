"use client"

import { PDFViewer } from "@react-pdf/renderer"
import { LiquidationReport } from "@/app/pdf/components/liquidation-report"
import Panel from "@/shared/components/ui/panel"
import { usePanelStore } from "@/shared/store/panel.store"
import { useGetLiquidation } from "../../hooks/useDetailBoxesService"
import { PulseLoader } from "react-spinners"
import { Colors } from "@/shared/types/constans"
import { useEffect, useState } from "react"
import type { ReportData } from "@/app/pdf/types/liquidation-report.types"

const PANEL_ID = "liquidation-report"

interface VentaDepto {
  codigo: string | number
  departamento: string
  monto: number
}

interface VentaProducto {
  producto: string
  cantidad: number
  monto: number
}

interface Contometro {
  lado: string
  producto: string
  cont_inicial: number
  cont_final: number
  vol_contometro: number
  vol_venta: number
  diferencia: number
}

interface Tarjeta {
  metodo: string
  referencia: string
  monto: number
}

interface Cliente {
  ruc: string
  galones: number
  producto: string
  monto: number
}

interface RendRow {
  tipo: string
  monto: number
}

interface VentaHose {
  lado: string
  manguera_producto: string
  precio: number
  cantidad: number
  total: number
}


export const PanelLiquidationReport = () => {
  const { closePanel, openPanels } = usePanelStore()

  const panelData = openPanels.find((p) => p.id === PANEL_ID)?.prop as {
    cashRegister: number
  }

  const report = useGetLiquidation(panelData?.cashRegister)

  const [pdfData, setPdfData] = useState<ReportData | null>(null)

  useEffect(() => {
    setPdfData(null)
  }, [panelData?.cashRegister])

  useEffect(() => {
    if (!report.data) return
    const api = report.data

    const ventasDepartamento: VentaDepto[] = api.ventas_departamento?.length
      ? api.ventas_departamento
      : [{ codigo: "", departamento: "", monto: 0 }]

    const ventasProducto: VentaProducto[] = api.ventas_producto?.length
      ? api.ventas_producto
      : [{ producto: "", cantidad: 0, monto: 0 }]

    const contometros: Contometro[] = api.contometros?.length
      ? api.contometros
      : [
          {
            lado: "",
            producto: "",
            cont_inicial: 0,
            cont_final: 0,
            vol_contometro: 0,
            vol_venta: 0,
            diferencia: 0,
          },
        ]

    const tarjetas: Tarjeta[] = api.tarjetas_credito?.length
      ? api.tarjetas_credito
      : [{ metodo: "", referencia: "", monto: 0 }]

    const clientesDescuento: Cliente[] = api.clientes_descuento?.length
      ? api.clientes_descuento
      : [{ ruc: "", galones: 0, producto: "", monto: 0 }]

    const clientesCredito: Cliente[] = api.clientes_credito?.length
      ? api.clientes_credito
      : [{ ruc: "", galones: 0, producto: "", monto: 0 }]

    const rendicion: RendRow[] = api.rendicion?.length
      ? api.rendicion
      : [{ tipo: "-", monto: 0 }]

      const ventasHose: VentaHose[] = api.ventas_hose?.length
        ? api.ventas_hose
        : [
            {
              lado: "",
              manguera_producto: "",
              precio: 0,
              cantidad: 0,
              total: 0,
            },
          ]


    const mapped: ReportData = {
      printerName: "POS80",

      header: [
        { label: "K&R TRADING S.A.C", value: "", format: "BOLD" },
        { label: "JR. CAVERO Y MUÑOZ NRO 355", value: "", format: "NORMAL" },
        { label: "TUMBES - TUMBES - TUMBES", value: "", format: "NORMAL" },
      ],

      document: [
        { label: "CIERRE DE TURNO", value: "", format: "BOLD" },
        { label: "TURNO", value: api.header?.shift_name ?? "-", format: "NORMAL" },
        { label: "FECHA DE TRABAJO", value: api.header?.opennig_date ?? "-", format: "NORMAL" },
        { label: "CAJA", value: api.header?.cash_code?.toString() ?? "-", format: "NORMAL" },
        { label: "USUARIO", value: api.header?.user_name ?? "-", format: "NORMAL" },
        { label: "FECHA IMPRESIÓN", value: new Date().toLocaleString(), format: "NORMAL" },
      ],

      // ITEMS (con tipos seguros)
      items: [
        { description: "VENTAS POR DEPARTAMENTO", total: 0 },
        ...ventasDepartamento.map((d: VentaDepto) => ({
          description: d.departamento,
          code: String(d.codigo), 
          total: d.monto,
        })),
        {
          description: "TOTAL",
          total: ventasDepartamento.reduce(
            (a: number, b: VentaDepto) => a + (b.monto ?? 0),
            0
          ),
        },

        { description: "VENTAS POR PRODUCTO", total: 0 },
        ...ventasProducto.map((p: VentaProducto) => ({
          description: p.producto,
          qty: p.cantidad,
          total: p.monto,
        })),
        {
          description: "TOTAL",
          qty: ventasProducto.reduce(
            (a: number, b: VentaProducto) => a + (b.cantidad ?? 0),
            0
          ),
          total: ventasProducto.reduce(
            (a: number, b: VentaProducto) => a + (b.monto ?? 0),
            0
          ),
        },
      ],

      totals: [
        {
          label: "TOTAL VTA BRUTA",
          value: api.totals.total_bruto?.toFixed(2) ?? "0.00",
          format: "NORMAL",
        },
        {
          label: "TOTAL DSCTO",
          value: api.totals.total_descuento?.toFixed(2) ?? "0.00",
          format: "NORMAL",
        },
        {
          label: "TOTAL TRANS. EXONERADA",
          value: api.totals.total_trans_exonerada?.toFixed(2) ?? "0.00",
          format: "NORMAL",
        },
        {
          label: "TOTAL SERAFIN",
          value: api.totals.total_serafin?.toFixed(2) ?? "0.00",
          format: "NORMAL",
        },
        {
          label: "TOTAL VTA NETA",
          value: api.totals.total_vta_neta?.toFixed(2) ?? "0.00",
          format: "DOUBLE",
        },
        {
          label: "TOTAL NOTA VENTA",
          value: api.totals.total_nota_venta?.toFixed(2) ?? "0.00",
          format: "NORMAL",
        },
        {
          label: "TOTAL FACT. CRÉDITO",
          value: api.totals.total_fact_credito?.toFixed(2) ?? "0.00",
          format: "NORMAL",
        },
        {
          label: "TOTAL CONTADO",
          value: api.totals.total_contado?.toFixed(2) ?? "0.00",
          format: "DOUBLE",
        },
      ],

      rendicion: rendicion.map((r: RendRow) => ({
        label: r.tipo,
        value: r.monto?.toFixed(2) ?? "0.00",
      })),

      discountClients: clientesDescuento.map((c: Cliente) => ({
        label: c.ruc,
        value: `${c.galones},${c.producto},${c.monto}`,
      })),

      creditClients: clientesCredito.map((c: Cliente) => ({
        label: c.ruc,
        value: `${c.galones},${c.producto},${c.monto}`,
      })),

      creditSummary: [],

      cardDetails: tarjetas.map((t: Tarjeta) => ({
        label: t.metodo,
        value: `${t.referencia ?? "-"},${t.monto ?? 0}`,
      })),

      contometros: contometros.map((c: Contometro) => ({
        lado: c.lado,
        producto: c.producto,
        contInicial: c.cont_inicial.toString(),
        contFinal: c.cont_final.toString(),
        volContometro: c.vol_contometro.toString(),
        volVenta: c.vol_venta.toString(),
        diferencia: c.diferencia.toString(),
      })),
       ventas_hose: ventasHose.map((v: VentaHose) => ({
        lado: v.lado,
        manguera_producto: v.manguera_producto,
        precio: v.precio,
        cantidad: v.cantidad,
        total: v.total,
      })),

    
    }

    setPdfData(mapped)
  }, [report.data])

  const handleClose = () => closePanel(PANEL_ID)

  return (
    <Panel
      panelId={PANEL_ID}
      title="Reporte de Liquidación"
      direction="bottom"
      className="h-[90vh] w-[100vw]"
      onClose={handleClose}
    >
      <div className="flex h-full items-center justify-center">
        {(!pdfData || report.isLoading) && <PulseLoader size={8} color={Colors.extra} />}

        {pdfData && (
          <PDFViewer key={JSON.stringify(pdfData)} width="100%" height="100%">
            <LiquidationReport data={pdfData} />
          </PDFViewer>
        )}
      </div>
    </Panel>
  )
}
