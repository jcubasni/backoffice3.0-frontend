import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useGetNotes } from "@/app/billing-notes/hooks/useNotesService";
import { notesColumns } from "@/app/billing-notes/lib/billing-notes-columns";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeaderContent } from "@/shared/components/header-content";
import { DataTable } from "@/shared/components/ui/data-table";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Input } from "@/shared/components/ui/input";
import { useDataTable } from "@/shared/hooks/useDataTable";
import { Routes } from "@/shared/lib/routes";

export const Route = createFileRoute("/(sidebar)/billing-notes/")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Notas de Debito y Crédito",
  },
});

function RouteComponent() {
  const notes = useGetNotes({ startDate: "2025-09-25" });
  const table = useDataTable({
    data: notes.data,
    columns: notesColumns,
    isLoading: false,
  });
  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input label="RUC" icon={Search} />
          <Input label="Cliente" icon={Search} />
          <DatePicker label="Fecha" />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button>Consultar</Button>
          <Link
            to={Routes.NewBillingNote}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Nuevo comprobante
          </Link>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} className="flex-1" />
    </>
  );
}
