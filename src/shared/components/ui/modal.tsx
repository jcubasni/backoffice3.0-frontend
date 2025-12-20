import { X } from "lucide-react"
import React, { ReactNode, isValidElement } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { SyncLoader } from "react-spinners"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useLoadStore } from "@/shared/store/load.store"
import { useModalStore } from "@/shared/store/modal.store"
import { Colors } from "@/shared/types/constans"

interface BaseDialogProps {
  modalId: string
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  scrollable?: boolean
  onClose?: () => void
}

const Modal = ({
  modalId,
  title,
  description,
  children,
  className,
  scrollable = false,
  onClose,
}: BaseDialogProps) => {
  const { openModals, closeModal } = useModalStore()
  const loading = useLoadStore((state) => state.loading)
  const isOpen = openModals.some((m) => m.id === modalId)

  const handleClose = () => {
    closeModal(modalId)
    onClose?.()
  }

  useHotkeys("escape", handleClose, { enabled: isOpen })

  // ✅ Separamos footer del contenido (para que no quede dentro del ScrollArea)
  const childrenArray = React.Children.toArray(children)

  const footerEl = childrenArray.find(
    (child) => isValidElement(child) && child.type === Modal.Footer,
  ) as React.ReactElement | undefined

  const bodyChildren = childrenArray.filter(
    (child) => !(isValidElement(child) && child.type === Modal.Footer),
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // ✅ BUG FIX: solo cerrar cuando se está cerrando
        if (!open) {
          useModalStore.getState().closeModal(modalId)
          onClose?.()
        }
      }}
    >
      <DialogContent
        className={cn(
          "flex h-full w-full flex-col overflow-hidden p-4 sm:h-fit sm:max-h-11/12 sm:rounded-lg",
          className,
        )}
        onEscapeKeyDown={(e) => {
          e.stopPropagation()
        }}
      >
        {loading && (
          <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-black/30">
            <SyncLoader size={14} color={Colors.extra} />
          </div>
        )}

        <X
          size={16}
          className="absolute top-2 right-2 z-100 cursor-pointer"
          onClick={handleClose}
        />

        <DialogHeader className={cn("hidden", title && "block h-fit w-full")}>
          <DialogTitle className="w-full text-center text-2xl">
            {title ?? ""}
          </DialogTitle>

          {/* OJO: tu lógica original ocultaba cuando description existía.
              Aquí lo dejamos “normal”: se muestra si hay description. */}
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {scrollable ? (
          <>
            {/* ✅ Body scrolleable */}
            <div className="flex flex-1 overflow-hidden">
              <ScrollArea className="flex-1">
                {/* ✅ pb-24 para que el contenido NO quede debajo del footer fijo */}
                <div className="flex w-full max-w-full flex-col gap-3 pb-24">
                  {bodyChildren}
                </div>
              </ScrollArea>
            </div>

            {/* ✅ Footer fijo abajo (fuera del scroll) */}
            {footerEl ? (
              <div className="sticky bottom-0 left-0 right-0 mt-2 border-t border-border bg-background/95 pt-3 backdrop-blur">
                {footerEl}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {bodyChildren}
            {footerEl ? <div className="mt-2">{footerEl}</div> : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

Modal.Footer = function Footer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <DialogFooter className={cn("grid w-full grid-cols-1 gap-3", className)}>
      {children}
    </DialogFooter>
  )
}

export default Modal
