import {
  Bolt,
  Coins,
  LayoutDashboard,
  BadgePercent,
  PackageSearch,
  ShoppingCart,
  Tag,
  User,
} from "lucide-react"
import { ItemSidebar } from "@/shared/types/sidebar.type"
import { Routes } from "../routes"

export const Options: ItemSidebar[] = [
  {
    title: "Liquidación",
    icon: LayoutDashboard,
    items: [
      {
        title: "Parte Diario",
        url: Routes.DailyReport,
      },
      {
        title: "Detalle de cajas",
        url: Routes.DetailBoxes,
      },
      {
        title: "Depósito de cajas",
        url: Routes.BankDeposit,
      },
    ],
  },
  {
    title: "Ventas",
    icon: Tag,
    items: [
      {
        title: "Facturación",
        url: Routes.Sales,
      },
      {
        title: "Notas de debito y crédito",
        url: Routes.BillingNotes,
      },
    ],
  },
  // {
  //   title: "Créditos",
  //   icon: CreditCard,
  //   url: Routes.Credits,
  // },
  {
    title: "Crobranzas y pagos",
    icon: Coins,
    // url: Routes.Collections,
    items: [
      {
        title: "Por Pago",
        url: Routes.ForPayments,
      },
      {
        title: "Por documento",
        url: Routes.ForDocuments,
      },
    ],
  },
  {
    icon: User,
    title: "Cliente y Cuenta",
    items: [
      {
        title: "Cliente",
        url: Routes.Clients,
      },
      {
        title: "Proveedor",
        url: Routes.Suppliers,
      },
      
      {
        title: "Usuarios",
        url: Routes.Users,
      },
      {
        title: "Empleado",
        url: Routes.Employeds,
      },
      {
        title: "Vehículos",
        url: Routes.Vehicles,
      }
    ],
  },
  {
    title: "Productos",
    icon: PackageSearch,
    url: Routes.Products,
  },
  {
    title: "Comercial",
    icon: BadgePercent,
    items: [
      {
        title: "Promociones",
        url: Routes.Promotion,
      },
    ],
  },
  {
    title: "Compras",
    icon: ShoppingCart,
    url: Routes.Purchases,
  },
  // {
  //   title: "Inventario",
  //   icon: PackageSearch,
  //   items: [
  //     {
  //       title: "Productos",
  //       url: Routes.Products,
  //     },
  //   ],
  // },
  // {
  //   title: "Soporte",
  //   icon: PackageSearch,
  //   items: [
  //     {
  //       title: "Empresas",
  //       url: Routes.Companies,
  //     },
  //   ],
  // },
  {
    title: "Configuración",
    icon: Bolt,
    url: Routes.Configurations,
  },
  {
    title: "Reportes",
    icon: Bolt,
    items: [
      {
        title: "Reporte - Ventas",
        url: Routes.PdfSales,
      },
      {
        title: "Reporte - Tipo de Pago",
        url: Routes.PDFPaymentTypeReport,
      },
      // {
      //   title: "Reporte - Ventas Anuladas",
      //   url: Routes.PdfCanceledSales,
      // },
      // {
      //   title: "Reporte - Faltantes y Sobrantes",
      //   url: Routes.PdfOverageReport,
      // },
    ],
  },
  // {
  //   title: "PDF",
  //   icon: FileText,
  //   items: [
  //     {
  //       title: "Parte Diario",
  //       url: Routes.PdfDailyReport,
  //     },
  //   ],
  // },
]
