import {
  SidebarContent,
  Sidebar as SidebarCustom,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@shadcn/sidebar"
import { useLocation } from "@tanstack/react-router"
import { Image } from "@unpic/react"
import { useEffect, useState } from "react"
import { SidebarUserDropdown } from "../lib/sidebar/dropdown"
import { Options } from "../lib/sidebar/options"
import { ItemSidebar } from "../types/sidebar.type"
import SidebarItem from "./sidebar-item"

export const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string[]>([])
  const location = useLocation()
  const { open, setOpen } = useSidebar()

  // Verifica si alguno de los hijos del menú está activo
  const hasActiveChild = (items?: ItemSidebar[]): boolean => {
    if (!items) return false
    return items.some((item) => {
      if (item.items) return hasActiveChild(item.items)
      return location.pathname === item.url
    })
  }

  // Al cargar el componente, abre los menús que tengan hijos activos
  useEffect(() => {
    const activeParents: string[] = []

    const checkActiveMenus = (items: ItemSidebar[]) => {
      for (const item of items) {
        if (item.items && hasActiveChild(item.items)) {
          activeParents.push(item.title)
          checkActiveMenus(item.items)
        }
      }
    }

    checkActiveMenus(Options)
    setOpenMenu((prev) => Array.from(new Set([...prev, ...activeParents])))
  }, [location.pathname])

  const handleMenuToggle = (title: string) => {
    setOpenMenu((prevMenu) =>
      prevMenu.includes(title)
        ? prevMenu.filter((item) => item !== title)
        : [...prevMenu, title],
    )
  }

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebar-open")
    if (savedSidebarState !== null) {
      setOpen(savedSidebarState === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-open", String(open))
  }, [open])

  return (
    <SidebarCustom>
      <SidebarHeader className="py-4">
        <Image
          src="/img/logo-gray.svg"
          alt="logo"
          height={200}
          width={200}
          className="mx-auto w-28 rounded-full bg-white object-contain shadow-sm"
        />
      </SidebarHeader>
      <SidebarContent className="px-1.5">
        <SidebarItem
          items={Options}
          openMenu={openMenu}
          handleMenuToggle={handleMenuToggle}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarUserDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarCustom>
  )
}
