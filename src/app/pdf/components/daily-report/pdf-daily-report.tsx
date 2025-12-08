import { PDFViewer, Text, View } from "@react-pdf/renderer"
import { format } from "date-fns"
import { SyncLoader } from "react-spinners"
import useAuthStore from "@/app/auth/store/auth.store"
import { formatDate } from "@/shared/lib/date"
import { toCapitalize } from "@/shared/lib/words"
import useBranchStore from "@/shared/store/branch.store"
import { useDailyReportService } from "../../hooks/useDailyReportService"
import { styles } from "../../styles/daily-report/pdf-daily-report"
import { PdfBase } from "../pdf-base"
import { TableAdditional } from "./table-additional"
import { TableBankMovementCashFlow } from "./table-bank-movement-cash-flow"
import { TableDetails } from "./table-details"
import { TableFuels } from "./table-fuels"
import { TableOutput } from "./table-output"
import { TableTotals } from "./table-totals"

interface PdfDailyReportProps {
  dailyReportId: string
}

export const PdfDailyReport = ({ dailyReportId }: PdfDailyReportProps) => {
  const { selectedBranch } = useBranchStore()
  const { data, isLoading } = useDailyReportService(dailyReportId)
  if (isLoading)
    return (
      <div className="flex size-full items-center justify-center">
        <SyncLoader />
      </div>
    )
  const period = data?.fuelSummary?.[0].dailyReportPeriod
  return (
    <PDFViewer className="max-h-full min-h-[60rem] w-full flex-1">
      <PdfBase>
        <View style={styles.container}>
          <View style={styles.gap}>
            <Text>{toCapitalize(selectedBranch?.localName || "")}</Text>
            <Text>{toCapitalize(selectedBranch?.localCode || "")}</Text>
            <Text>
              {useAuthStore.getState().user?.employee.firstName || ""}
            </Text>
          </View>
          <View style={{ ...styles.right, ...styles.gap }}>
            <Text>{formatDate(new Date(), "dd 'de' MMMM 'del' yyyy")}</Text>
            <Text>{format(new Date(), "HH:mm:ss")}</Text>
          </View>
        </View>
        <Text style={styles.title}>
          PARTE DIARIO -{" "}
          {period &&
            formatDate(period, "EEEE dd 'de' MMMM 'del' yyyy")?.toUpperCase()}
        </Text>
        <TableFuels data={data?.fuelSummary || []} />
        <View style={styles.content}>
          <TableOutput data={data?.fuelAdjustments} />
          <TableAdditional data={data?.otherProducts} />
          <TableTotals data={data?.mainTotals} />
        </View>
        {data?.salesSummary && <TableDetails details={data.salesSummary} />}
        {data?.bankDeposits && (
          <TableBankMovementCashFlow
            bankMovement={data.bankDeposits}
            cashFlowSummary={data.cashFlow}
          />
        )}
      </PdfBase>
    </PDFViewer>
  )
}
