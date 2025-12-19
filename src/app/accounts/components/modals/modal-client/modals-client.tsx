import { Modals } from "@/app/accounts/types/modals-name"
import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: Modals.EDIT_CLIENT,
    component: () => import("./modal-edit-clients"),
  },
  {
    modalId: Modals.DELETE_CLIENT,
    component: () => import("./modal-delete-clients"),
  },
  {
    modalId: Modals.ADD_PRODUCT,
    component: () => import("./modal-add-product"),
  },
  {
    modalId: Modals.ADD_CLIENT,
    component: () => import("./modal-add-client"),
  },
  {
    modalId: Modals.ADD_VEHICLE,
    component: () => import("./modal-add-vehicle"),
  },

  // ✅ ESTE ES EL MODAL REAL PARA TARJETAS (plates)
  {
    modalId: Modals.UPDATE_BALANCE,
    component: () => import("../modal-plate/modal-update-balance"),
  },

  // 👇 MODAL PDF CLIENTES
  {
    modalId: "modal-preview-clients-pdf",
    component: () => import("./modal-preview-clients-pdf"),
  },

  // ✅ ESTE ES SOLO PARA CUENTAS
  {
    modalId: Modals.ADD_ACCOUNT_BALANCE,
    component: () => import("../modal-accounts/modal-add-account-balance"),
  },
]

export const ModalsClient = () => {
  return <ModalContainer modals={modals} />
}
