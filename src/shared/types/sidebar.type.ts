import { LucideIcon } from "lucide-react"
import type { FileRoutesByFullPath } from "@/routeTree.gen"

export type ItemSidebar = {
  title: string
  url?: keyof FileRoutesByFullPath
  icon?: LucideIcon
  items?: ItemSidebar[]
  permiso?: boolean
}

export type SubItemSidebar = Omit<ItemSidebar, "items"> & {
  permiso: boolean
}
