import { ModalContainer } from "@/shared/components/modals/modal-container"
import { PanelLiquidationReport } from "./panel-liquidation-report"
import { PanelShortageOverageReport } from "./panel-shortage-overage-report"

const modals = [
  {
    modalId: "modal-observation",
    component: () => import("./modal-observation"),
  },
  {
    modalId: "modal-detail-box",
    component: () => import("./modal-detail-box"),
  },
  {
    modalId: "modal-preview-detail-box",
    component: () => import("./modal-preview-detail-box"),
  },
  {
    modalId: "modal-observations-box",
    component: () => import("./modal-observations-box"),
  },
  {
    modalId: "modal-enable-edit",
    component: () => import("./modal-enable-edit"),
  },
  {
    modalId: "modal-deposit-report",
    component: () =>
      import("../../../sale-report/components/deposit/modal-filter-report"),
  },
]

export const ModalsBoxes = () => {
  return (
    <>
      <ModalContainer modals={modals} />
      <PanelLiquidationReport />
      <PanelShortageOverageReport />
    </>
  )
}
