import { createFileRoute } from "@tanstack/react-router"
import { TableVoucher } from "@/app/sales/components/table-voucher"
import { ModalContainer } from "@/shared/components/modals/modal-container"

export const Route = createFileRoute("/(sidebar)/sales/voucher")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Canje de vales",
  },
})

const modals = [
  {
    modalId: "modal-validate-products",
    component: () =>
      import("@/app/sales/components/voucher/modal-validate-products"),
  },
]

function RouteComponent() {
  return (
    <>
      <TableVoucher />
      <ModalContainer modals={modals} />
    </>
  )
}
