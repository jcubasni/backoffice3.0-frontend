export const Routes = {
  // Login
  Home: "/",
  // Companies
  ListCompanies: "/companies",
  // Daily Report
  DailyReport: "/daily-report",
  GenerateDailyReport: "/daily-report/generate",
  Dipstick: "/daily-report/dipstick",
  // Detail Boxes
  DetailBoxes: "/detail-boxes",
  Contometer: "/detail-boxes/contometer",
  //Bank Deposit
  BankDeposit: "/bank-deposit",
  SelectBankDeposit: "/bank-deposit/select/$bankDeposit",
  ListBankDeposit: "/bank-deposit/list/$bankDeposit",
  // Sales
  Sales: "/sales",
  NewSale: "/sales/new",
  Voucher: "/sales/voucher",
  // Credits and Debits Notes
  BillingNotes: "/billing-notes",
  NewBillingNote: "/billing-notes/new",
  // Account
  Clients: "/account/clients",
  Plates: "/account/plates",
  // Products
  Products: "/products",
  // Extras
  Companies: "/support/companies",
  // Configurations
  Configurations: "/configurations",
  // Credits
  Credits: "/credits",
  // Collections
  ForPayments: "/collections/payments",
  ForDocuments: "/collections/documents",
  //PDF
  PdfDailyReport: "/pdf/daily-report",
  PdfSales: "/pdf/sales-report",
  PDFPaymentTypeReport: "/pdf/payment-type-report",
  PdfCanceledSales: "/pdf/canceled-sales-report",
  PdfOverageReport: "/pdf/shortage-overage-report",
  // Purchases
  Purchases: "/purchases",
  NewPurchase: "/purchases/new",
  // Suppliers
  Suppliers: "/supplier/suppliers",
  // Employeeds
   Employeds: "/employed/employeds",
  // Users
  Users: "/users",
  // Vehicles
  Vehicles: "/vehicle/vehicles",
  // Promotions
  Promotion: "/promotions",
  NewPromotion: "/promotions/new",
} as const
