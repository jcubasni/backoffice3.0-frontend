import { TableBanks } from "../../bank/components/table-banks"
import { TableBankAccounts } from "../../bank-accounts/components/table-bank-accounts"
import { TableBranches } from "../../branches/components/table-branches"
import { TableCurrencies } from "../../currencies/components/table-currencies"
import { TableDepositTypes } from "../../deposit-types/components/table-deposit-types"
import TableDocuments from "../../documents/components/table-documents"
import { TableGroupSeries } from "../../group-serie/components/table-group-series"
import { TableSeries } from "../../series/components/table-series"
import { TableSides } from "../../sides/components/table-sides"

export const maintenanceTabs = [
  {
    value: "series",
    label: "Series",
    component: TableSeries,
  },
  {
    value: "groups-series",
    label: "Grupos de Series",
    component: TableGroupSeries,
  },
  {
    value: "branches",
    label: "Sedes",
    component: TableBranches,
  },
  {
    value: "banks",
    label: "Bancos",
    component: TableBanks,
  },
  {
    value: "documents",
    label: "Documentos",
    component: TableDocuments,
  },
  {
    value: "bank-accounts",
    label: "Cuentas Bancarias",
    component: TableBankAccounts,
  },
  {
    value: "currencies",
    label: "Moneda",
    component: TableCurrencies,
  },
  {
    value: "deposit-types",
    label: "Tipo de Depósito",
    component: TableDepositTypes,
  },
  {
    value: "sides",
    label: "Lados",
    component: TableSides,
  },
]
