import { usePanelStore } from "@/shared/store/panel.store";
import { PanelDepositDetailReport } from "@/app/sale-report/components/deposit/panel-deposit-report";

export function PanelsContainer() {
  const openPanels = usePanelStore((state) => state.openPanels);

  return (
    <>
      {openPanels.map((panel) => {
        if (panel.id === "deposit-report-detail") {
          const { data, date, cashRegisterId, shiftId } = panel.prop;
          return (
            <PanelDepositDetailReport
              key={panel.id}
              data={data}
              date={date}
              cashRegisterId={cashRegisterId}
              shiftId={shiftId}
            />
          );
        }

        // Puedes agregar más paneles aquí
        return null;
      })}
    </>
  );
}
