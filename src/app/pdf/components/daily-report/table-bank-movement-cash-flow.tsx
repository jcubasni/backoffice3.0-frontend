import { Table, TR } from "@ag-media/react-pdf-table"
import { View } from "@react-pdf/renderer"
import { formatDate } from "@/shared/lib/date"
import { formatCurrency } from "@/shared/lib/number"
import { BankDeposit, CashFlow } from "../../types/daily-report.type"
import { TCell, THead, THeader } from "../table"

export const TableBankMovement = ({
  bankMovement,
}: {
  bankMovement: BankDeposit[]
}) => {
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      <Table>
        <THeader>
          <THead weighting={0.3}>Banco / Nro Cuenta</THead>
          <THead>Fecha Depósito</THead>
          <THead>Nro. Depósito</THead>
          <THead>Monto Depósito</THead>
        </THeader>
        {bankMovement.map((deposit, i) => (
          <TR key={i}>
            <TCell weighting={0.3}>{deposit.bankAccountInfo}</TCell>
            <TCell>{formatDate(deposit.depositDate)}</TCell>
            <TCell>{deposit.depositNumber}</TCell>
            <TCell>{formatCurrency(deposit.depositAmount)}</TCell>
          </TR>
        ))}
      </Table>
    </View>
  )
}

// Tabla: Resumen Flujo de Caja
const TableCashFlowSummary = ({
  cashFlowSummary,
}: {
  cashFlowSummary: CashFlow
}) => {
  return (
    <View style={{ marginTop: 10, marginBottom: 10, width: "100%" }}>
      <Table>
        <THeader>
          <THead>Caja Inicial</THead>
          <THead>Venta Ingresos</THead>
          <THead>Otros Ingresos</THead>
          <THead>Total Egresos</THead>
          <THead>Egresos Caja Central</THead>
          <THead>Depósito Banco</THead>
          <THead>Caja Final</THead>
        </THeader>
        <TR>
          <TCell>{formatCurrency(cashFlowSummary.initialCash)}</TCell>
          <TCell>{formatCurrency(cashFlowSummary.salesIncome)}</TCell>
          <TCell>{formatCurrency(cashFlowSummary.otherIncome)}</TCell>
          <TCell>{formatCurrency(cashFlowSummary.totalExpenses)}</TCell>
          <TCell>{formatCurrency(cashFlowSummary.centralCashExpenses)}</TCell>
          <TCell>{formatCurrency(cashFlowSummary.bankDeposit)}</TCell>
          <TCell>{formatCurrency(cashFlowSummary.finalCash)}</TCell>
        </TR>
      </Table>
    </View>
  )
}

// Componente único que muestra ambas tablas separadas
export const TableBankMovementCashFlow = ({
  bankMovement,
  cashFlowSummary,
}: {
  bankMovement: BankDeposit[]
  cashFlowSummary: CashFlow
}) => (
  <>
    {bankMovement.length > 0 && (
      <TableBankMovement bankMovement={bankMovement} />
    )}
    <TableCashFlowSummary cashFlowSummary={cashFlowSummary} />
  </>
)
