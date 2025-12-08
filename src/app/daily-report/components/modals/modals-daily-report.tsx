import { lazy } from "react"
import { ModalLoader } from "@/shared/components/ui/modal-loader"

const ModalDeleteDailyReportBox = lazy(
  () => import("./modal-delete-daily-report-box"),
)
const ModalCloseDailyReport = lazy(() => import("./modal-close-daily-report"))
const ModalBoxes = lazy(() => import("./modal-boxes"))
const ModalCreateDailyReport = lazy(() => import("./modal-create-daily-report"))

export const DailyReportModals = () => {
  return (
    <>
      <ModalLoader modalId="modal-close-daily-report">
        <ModalCloseDailyReport />
      </ModalLoader>
      <ModalLoader modalId="modal-delete-daily-report-box">
        <ModalDeleteDailyReportBox />
      </ModalLoader>
      <ModalLoader modalId="modal-boxes">
        <ModalBoxes />
      </ModalLoader>
      <ModalLoader modalId="modal-create-daily-report">
        <ModalCreateDailyReport />
      </ModalLoader>
    </>
  )
}
