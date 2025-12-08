import { X } from "lucide-react"
import { ReactNode } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { SyncLoader } from "react-spinners"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useLoadStore } from "@/shared/store/load.store"
import { usePanelStore } from "@/shared/store/panel.store"
import { Colors } from "@/shared/types/constans"

interface BasePanelProps {
  panelId: string
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  scrollable?: boolean
  direction?: "left" | "right" | "top" | "bottom"
  onClose?: () => void
}

const Panel = ({
  panelId,
  title,
  description,
  children,
  className,
  scrollable = false,
  direction = "right",
  onClose,
}: BasePanelProps) => {
  const { openPanels, closePanel } = usePanelStore()
  const loading = useLoadStore((state) => state.loading)
  const isOpen = openPanels.some((p) => p.id === panelId)

  const handleClose = () => {
    closePanel(panelId)
    onClose?.()
  }

  useHotkeys("escape", handleClose, { enabled: isOpen })

  return (
    <Drawer open={isOpen} direction={direction}>
      <DrawerContent
        className={cn(
          "flex flex-col overflow-hidden pt-4",
          className,
        )}
      >
        {loading && (
          <div
            className={cn(
              "absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-black/30",
            )}
          >
            <SyncLoader size={14} color={Colors.extra} />
          </div>
        )}

        <DrawerClose asChild>
          <X
            size={16}
            className="absolute top-2 right-2 cursor-pointer"
            onClick={handleClose}
          />
        </DrawerClose>

        <DrawerHeader className={cn("hidden", title && "block")}>
          <DrawerTitle className="w-full text-center text-2xl">
            {title ?? ""}
          </DrawerTitle>
          <DrawerDescription className={cn(description && "hidden")}>
            {description}
          </DrawerDescription>
        </DrawerHeader>

        {scrollable ? (
          <div className="flex flex-1 overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="flex w-full max-w-full flex-col gap-3">
                {children}
              </div>
            </ScrollArea>
          </div>
        ) : (
          children
        )}
      </DrawerContent>
    </Drawer>
  )
}

Panel.Footer = function Footer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <DrawerFooter
      className={cn("mt-2 grid w-full grid-cols-1 gap-3", className)}
    >
      {children}
    </DrawerFooter>
  )
}

export default Panel
