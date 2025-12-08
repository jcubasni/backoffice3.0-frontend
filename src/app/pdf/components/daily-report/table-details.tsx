import { Table, TR } from "@ag-media/react-pdf-table"
import { View } from "@react-pdf/renderer"
import { formatCurrency } from "@/shared/lib/number"
import { toCapitalize } from "@/shared/lib/words"
import { Colors } from "@/shared/types/constans"
import { SalesSummary } from "../../types/daily-report.type"
import { TableHeaderDoubleLine, TCell, THead, THeader } from "../table"

interface TableDetailsProps {
  details: SalesSummary[]
}

export const TableDetails = ({ details }: TableDetailsProps) => {
  return (
    <View style={{ marginTop: 10, marginBottom: 10, width: "100%" }}>
      <Table>
        <THeader>
          <THead weighting={0.15}>Concepto</THead>
          <TableHeaderDoubleLine firstLine="Liq." secondLine="Recaudado" />
          <TableHeaderDoubleLine firstLine="Liq. Total" secondLine="Del Dia" />
          <TableHeaderDoubleLine firstLine="Liq. Otros" secondLine="Ingresos" />
          <TableHeaderDoubleLine
            firstLine="Total Ingreso"
            secondLine="Del Dia"
          />
          <TableHeaderDoubleLine firstLine="Faltante/" secondLine="Sobrante" />
          <THead>Egresos</THead>
          <TableHeaderDoubleLine firstLine="Efectivo Del" secondLine="Dia" />
          <TableHeaderDoubleLine
            firstLine="Efectivo Del"
            secondLine="Dia Anterior"
          />
          <TableHeaderDoubleLine
            firstLine="Egresos Caja"
            secondLine="Central"
          />
          <TableHeaderDoubleLine
            firstLine="Gran Total"
            secondLine="A Depositar"
          />
        </THeader>
        {details.map((detail, index) => {
          return (
            <TR
              key={index}
              style={{
                backgroundColor: index % 2 !== 0 ? Colors.bg : Colors.white,
              }}
            >
              <TCell weighting={0.15}>{toCapitalize(detail.concept)}</TCell>
              <TCell>{formatCurrency(detail.liquidCollected ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.liquidTotalDay ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.liquidOtherIncome ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.totalIncomeDay ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.shortageSurplus ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.expenses ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.cashDay ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.cashPreviousDay ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.centralBoxExpenses ?? 0)}</TCell>
              <TCell>{formatCurrency(detail.grandTotalDeposit ?? 0)}</TCell>
            </TR>
          )
        })}
      </Table>
    </View>
  )
}
