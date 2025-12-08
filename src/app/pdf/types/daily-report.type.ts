export type FuelSummary = {
  productName: string
  initialSalesStock: number
  inputGallons: number
  internalConsumption: number
  salesGallons: number
  finalStockGallons: number
  finalSalesStock: number
  dailyDifference: number
  monthlyDifference: number
  totalOutputAmount: number
  unitPrice: number
  dailyReportPeriod: string
}

export type BankDeposit = {
  bankAccountInfo: string
  depositDate: string
  depositNumber: string
  depositAmount: number
}

export type CashFlow = {
  initialCash: number
  salesIncome: number
  otherIncome: number
  totalExpenses: number
  centralCashExpenses: number
  bankDeposit: number
  finalCash: number
}

export type DepositsSummary = {
  cashRemittancesDeposited: string
  soles: number
  dollars: number
  checks: number
  sortOrder: number
}

export type FuelAdjustments = {
  discountIncrease: number
  internalConsumptionStation: number
  seraphines: number
  totalNonTaxableOutput: number
}

export type MainTotals = {
  totalGrossSales: number
  grossSalesMinusFuelOutput: number
  totalDailySales: number
}

export type OtherProducts = {
  lubricants: number
  rental: number
  services: number
  market: number
  totalOtherProducts: number
}

export type SalesSummary = {
  concept: string
  liquidCollected: number
  liquidTotalDay: number
  liquidOtherIncome: number
  totalIncomeDay: number
  shortageSurplus: number
  expenses: number
  cashDay: number
  cashPreviousDay: number
  centralBoxExpenses: number
  grandTotalDeposit: number
  sortOrder: number
}

export type DailyReportPDF = {
  fuelSummary: FuelSummary[]
  bankDeposits: BankDeposit[]
  cashFlow: CashFlow
  depositsSummary: DepositsSummary[]
  fuelAdjustments: FuelAdjustments
  mainTotals: MainTotals
  otherProducts: OtherProducts
  salesSummary: SalesSummary[]
}
