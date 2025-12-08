import { EllipsisVertical, LogOut, Moon, Sun } from "lucide-react"

import { useLogout } from "@/app/auth/hooks/useAuthService"
import useAuthStore from "@/app/auth/store/auth.store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useThemeToggle } from "@/shared/hooks/useTheme"
import type { DropdownMenuOptionGroup } from "@/shared/types/dropdown-menu-option.type"

import { FlexibleDropdownMenu } from "../../components/ui/flexible-dropdown-menu"

export function SidebarUserDropdown() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeToggle()
  const handleLogout = useLogout

  // Si no hay usuario, no renderizamos nada
  if (!user) return null

  const userName = user.employee?.firstName || user.user?.username || "Usuario"
  const userEmail = user.user?.username || ""
  const userAvatar = "" // Por ahora no tenemos avatar en el type

  // Generar iniciales del nombre
  const getInitials = (name: string) => {
    const words = name.split(" ")
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const groups: DropdownMenuOptionGroup[] = [
    {
      label: "Configuración",
      options: [
        {
          type: "toggle",
          label: theme ? "Modo claro" : "Modo oscuro",
          onToggle: toggleTheme,
          icon: theme ? Sun : Moon,
        },
      ],
    },
    {
      options: [
        {
          type: "action",
          label: "Cerrar sesión",
          onClick: handleLogout,
          icon: LogOut,
          variant: "destructive",
        },
      ],
    },
  ]

  return (
    <FlexibleDropdownMenu groups={groups} align="end" className="w-56">
      <SidebarMenuButton
        size="lg"
        className="hover:bg-background data-[state=open]:bg-background data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg grayscale">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="rounded-lg">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{userName}</span>
          <span className="truncate text-muted-foreground text-xs">
            {userEmail}
          </span>
        </div>
        <EllipsisVertical className="ml-auto size-4" />
      </SidebarMenuButton>
    </FlexibleDropdownMenu>
  )
}
