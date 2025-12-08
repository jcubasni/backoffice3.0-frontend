import { ReactNode, Suspense } from "react"
import { useModalStore } from "@/shared/store/modal.store"

interface ModalLoaderProps {
  modalId: string
  children: ReactNode
  fallback?: ReactNode
}

export function ModalLoader({ modalId, children, fallback }: ModalLoaderProps) {
  const isOpen = useModalStore((state) =>
    state.openModals.some((modal) => modal.id === modalId),
  )

  if (!isOpen) return null

  return <Suspense fallback={fallback}>{children}</Suspense>
}
