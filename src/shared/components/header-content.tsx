import { cn } from "@/lib/utils"

type HeaderSidebarProps = {
  children: React.ReactNode
  className?: string
}

export const HeaderContent = ({ children, className }: HeaderSidebarProps) => {
  return (
    <section
      className={cn(
        "flex w-full flex-wrap items-end gap-4 md:justify-between",
        className,
      )}
    >
      {children}
    </section>
  )
}

HeaderContent.Left = function Left({
  children,
  className,
}: HeaderSidebarProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-5 md:w-fit md:flex-row md:flex-wrap",
        className,
      )}
    >
      {children}
    </div>
  )
}

HeaderContent.Right = function Right({
  children,
  className,
}: HeaderSidebarProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-5 text-gray-600 md:ml-auto md:w-fit md:flex-row md:flex-wrap",
        className,
      )}
    >
      {children}
    </div>
  )
}
