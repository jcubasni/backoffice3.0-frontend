import { useMatches } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTitleHeaderStore } from "../store/title-header.store"

export default function Header() {
  const currentRoute = useMatches().at(-1)
  const headerTitle = currentRoute?.staticData.headerTitle
  const title = useTitleHeaderStore((state) => state.title)

  return (
    <header className="flex items-center justify-between border-border border-b bg-background px-6 py-2">
      <div className="flex items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <h1 className="ml-2 font-bold text-xl leading-none">
          {headerTitle ?? title}
        </h1>
      </div>
    </header>
  )
}
