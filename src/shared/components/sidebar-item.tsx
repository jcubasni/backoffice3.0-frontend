import { SidebarGroup, SidebarMenuButton } from "@shadcn/sidebar"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ItemSidebar } from "../types/sidebar.type"

interface SidebarItemProps {
  items: ItemSidebar[]
  openMenu: string[]
  handleMenuToggle: (title: string) => void
}

const isActiveUtil = (path: string | undefined, currentPath: string): boolean =>
  !!path && currentPath === path

const SidebarItem = ({
  items,
  openMenu,
  handleMenuToggle,
}: SidebarItemProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      {items.map(
        ({ icon: Icon, title, url, items: subItems, permiso }, index) => {
          if (permiso === false) return null

          if (subItems?.every((child) => child.permiso === false)) return null

          const isOpened = subItems ? openMenu.includes(title) : false
          const activeChild = subItems?.some(
            (child) =>
              child.permiso !== false &&
              isActiveUtil(child.url, location.pathname),
          )
          const activeParent = !subItems && isActiveUtil(url, location.pathname)

          return (
            <SidebarGroup key={index} className="w-full py-1">
              <SidebarMenuButton
                onClick={() => {
                  if (subItems) handleMenuToggle(title)
                  if (url) navigate({ to: url })
                }}
                className={cn(
                  "flex h-10 cursor-pointer items-center justify-between gap-0 rounded px-3 transition hover:bg-accent",
                  subItems && "font-normal",
                  activeChild && "font-bold",
                  activeParent && "font-bold",
                  url &&
                    isActiveUtil(url, location.pathname) &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <p className="flex items-center gap-3">
                  {Icon && <Icon size={18} />}
                  <span>{title}</span>
                </p>
                {subItems && (
                  <ChevronDown
                    size={15}
                    className={cn("transition-all", isOpened && "rotate-180")}
                  />
                )}
              </SidebarMenuButton>

              {subItems && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isOpened ? "auto" : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="my-1 grid w-full gap-1 overflow-hidden py-0 pr-0 pl-6"
                >
                  {subItems.map(
                    (
                      {
                        icon: ChildIcon,
                        title: childTitle,
                        url: childUrl,
                        permiso: childPermiso,
                      },
                      idx,
                    ) =>
                      childPermiso === false ? null : (
                        <SidebarMenuButton
                          key={idx}
                          className={cn(
                            "h-10 w-full hover:bg-accent",
                            isActiveUtil(childUrl, location.pathname) &&
                              "bg-primary hover:bg-primary",
                          )}
                        >
                          <Link
                            to={childUrl as string}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 text-xs transition hover:text-accent-foreground",
                              isActiveUtil(childUrl, location.pathname) &&
                                "font-semibold text-primary-foreground hover:text-primary-foreground",
                            )}
                          >
                            {ChildIcon && <ChildIcon size={18} />}
                            <span>{childTitle}</span>
                          </Link>
                        </SidebarMenuButton>
                      ),
                  )}
                </motion.div>
              )}
            </SidebarGroup>
          )
        },
      )}
    </>
  )
}

export default SidebarItem
