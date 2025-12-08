import { createFileRoute } from "@tanstack/react-router";
import { Edit, Save } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import z from "zod";
import {
  useEditDipstick,
  useGetDipstick,
} from "@/app/dipstick/hooks/useDipstickService";
import { dipstickColumns } from "@/app/dipstick/lib/dipstick-columns";
import { getDipstickChanges } from "@/app/dipstick/lib/format-dipsick";
import { DetailDipstick } from "@/app/dipstick/types/dipstick.type";
import { Button } from "@/components/ui/button";
import { HeaderContent } from "@/shared/components/header-content";
import { DataTable } from "@/shared/components/ui/data-table";
import { useDataTable } from "@/shared/hooks/useDataTable";

const dipstickSearchParams = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute("/(sidebar)/daily-report/dipstick")({
  component: RouteComponent,
  validateSearch: dipstickSearchParams,
  staticData: {
    headerTitle: "Varillaje",
  },
});

function RouteComponent() {
  const { id } = Route.useSearch();
  const { data, isLoading, isFetching } = useGetDipstick(id);
  const originalRef = useMemo(() => {
    return data?.map((row) => ({ ...row })) ?? [];
  }, [data]);
  const editDipstick = useEditDipstick();
  const table = useDataTable({
    data,
    columns: dipstickColumns,
    isLoading: isLoading || isFetching,
  });

  const handleSave = () => {
    const current = table.getCoreRowModel().rows.map((row) => row.original);
    const changes: DetailDipstick[] = getDipstickChanges(originalRef, current);
    if (!changes.length) {
      toast.info("No hay cambios para guardar");
      return;
    }
    editDipstick.mutate(changes);
  };

  return (
    <>
      <HeaderContent>
        {/* <HeaderSidebar.Left>
            <ComboBox
              label="N° partida diario"
              options={[
                { label: "CDSM01", value: "CDSM01" },
                { label: "CDSM02", value: "CDSM02" },
              ]}
              defaultValue="CDSM01"
            />
          </HeaderSidebar.Left> */}
        <HeaderContent.Right>
          <Button variant="outline" size="header">
            <Edit />
            Editar
          </Button>
          <Button variant="outline" size="header" onClick={handleSave}>
            <Save />
            Guardar cambios
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
    </>
  );
}
