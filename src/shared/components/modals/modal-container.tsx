import { type ComponentType, lazy } from "react"
import { ModalLoader } from "@/shared/components/ui/modal-loader"

export interface ModalConfig {
  modalId: string
  component: () => Promise<{ default: ComponentType<any> }>
}

interface ModalContainerProps {
  modals: ModalConfig[]
}

export const ModalContainer = ({ modals }: ModalContainerProps) => {
  return (
    <>
      {modals.map(({ modalId, component }) => {
        const LazyModal = lazy(component)
        return (
          <ModalLoader key={modalId} modalId={modalId}>
            <LazyModal />
          </ModalLoader>
        )
      })}
    </>
  )
}
