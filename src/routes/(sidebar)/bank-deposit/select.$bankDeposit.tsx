import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useGetDeposit } from "@/app/bank-deposit/hooks/useBankDepositService";
import {
  useAddReportsToDeposit,
  useGetAvailableReports,
} from "@/app/bank-deposit/hooks/useDailyReportService";
import { selectDailyReportColumns } from "@/app/bank-deposit/lib/select-daily-report-columns";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeaderContent } from "@/shared/components/header-content";
import { DataTable } from "@/shared/components/ui/data-table";
import { useDataTable } from "@/shared/hooks/useDataTable";
import { formatCurrency } from "@/shared/lib/number";
import { Routes } from "@/shared/lib/routes";

export const Route = createFileRoute(
  "/(sidebar)/bank-deposit/select/$bankDeposit"
)({
  component: RouteComponent,
  staticData: {
    headerTitle: "Lista de partes diarios",
  },
});

function RouteComponent() {
  const { bankDeposit: idBankDeposit } = Route.useParams();
  const { isLoading, isFetching, data } = useGetAvailableReports();
  const addDailyReports = useAddReportsToDeposit();
  const bankDeposit = useGetDeposit(idBankDeposit);
  const table = useDataTable({
    data,
    columns: selectDailyReportColumns(
      Number(bankDeposit.data?.depositAmount) ?? 0
    ),
    isLoading: isLoading || isFetching,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableRowClickToggle: false,
  });
  const handleAdd = () => {
    let remaining = Number(bankDeposit.data?.depositAmount) || 0;

    const result = table
      .getSelectedRowModel()
      .rows.sort(
        (a, b) =>
          new Date(a.original.period).getTime() -
          new Date(b.original.period).getTime()
      )
      .map((row) => {
        // Usar balance en lugar de totalDepositAmount
        const saldo = row.original.balance;
        const depositAmount = Math.min(saldo, remaining);
        remaining -= depositAmount;

        return {
          dailyReportId: row.original.dailyReportId,
          depositAmount,
        };
      });

    const totalDepositAmount = result.reduce(
      (sum, item) => sum + item.depositAmount,
      0
    );
    if (totalDepositAmount < Number(bankDeposit.data?.depositAmount)) {
      toast.info("El monto acumulado es menor al monto del depósito");
      return;
    }

    addDailyReports.mutate({
      idDeposit: idBankDeposit,
      assignDetails: result,
    });
  };
  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <h2 className="font-semibold text-lg">
            Monto del Deposito {bankDeposit.data?.depositNumber} :{" "}
            {formatCurrency(bankDeposit.data?.depositAmount ?? 0)}
          </h2>
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "header" })
            )}
            to={Routes.BankDeposit}
          >
            <ChevronLeft />
            Regresar
          </Link>
          <Button
            size="header"
            onClick={handleAdd}
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <Save />
            Grabar
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
    </>
  );
}
