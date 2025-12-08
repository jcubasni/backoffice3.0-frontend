import { Eye, PlusCircle } from "lucide-react"
import { lazy, Suspense, useEffect } from "react"
import { PulseLoader } from "react-spinners"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Modal from "@/shared/components/ui/modal"
import { formatDate } from "@/shared/lib/date"
import { useModalStore } from "@/shared/store/modal.store"
import { Colors } from "@/shared/types/constans"
import { useDetailBoxStore } from "../../store/detail-box.store"
import { DailyReport } from "../../types/daily-report.type"

const TableSelectedBoxes = lazy(() => import("../tables/table-selected-boxes"))
const TableAddBoxes = lazy(() => import("../tables/table-add-boxes"))

export default function ModalBoxes() {
  const { id, closedAt, period } = useModalStore(
    (state) => state.openModals,
  ).find((modal) => modal.id === "modal-boxes")?.prop as DailyReport
  useEffect(() => {
    useDetailBoxStore.getState().setDailyReportId(id)
  }, [])
  return (
    <Modal
      modalId="modal-boxes"
      title={`Parte diario - ${period}`}
      className="sm:w-2xl"
    >
      {!closedAt ? (
        <Tabs defaultValue="preview" className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="preview">
              <Eye />
              Cajas seleccionadas
            </TabsTrigger>
            <TabsTrigger value="add">
              <PlusCircle />
              Agregar cajas
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="preview"
            className="flex flex-col items-center justify-center gap-3"
          >
            <Suspense fallback={<PulseLoader size={8} color={Colors.extra} />}>
              <TableSelectedBoxes id={id} closedAt={closedAt} />
            </Suspense>
          </TabsContent>
          <TabsContent
            value="add"
            className="flex flex-col items-center justify-center gap-3"
          >
            <Suspense fallback={<PulseLoader size={8} color={Colors.extra} />}>
              <TableAddBoxes
                id={id}
                closedAt={closedAt}
                date={formatDate(period)}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      ) : (
        <Suspense fallback={<PulseLoader size={8} color={Colors.extra} />}>
          <TableSelectedBoxes id={id} closedAt={closedAt} />
        </Suspense>
      )}
    </Modal>
  )
}
