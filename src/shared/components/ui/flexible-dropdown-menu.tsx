import { Link } from "@tanstack/react-router"
import type React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {
  ActionDropdownMenuOption,
  DropdownMenuOption,
  DropdownMenuOptionGroup,
  LinkDropdownMenuOption,
  SubmenuDropdownMenuOption,
  ToggleDropdownMenuOption,
} from "@/shared/types/dropdown-menu-option.type"

type FlexibleDropdownMenuProps = {
  /** Trigger element (button, avatar, etc.) */
  children: React.ReactNode
  /** Array of option groups */
  groups: DropdownMenuOptionGroup[]
  /** Alignment of the dropdown content */
  align?: "start" | "center" | "end"
  /** Side offset for the dropdown */
  sideOffset?: number
  /** Custom className for the content */
  className?: string
}

/**
 * Renders a single dropdown menu item based on its type
 */
function renderDropdownMenuItem(option: DropdownMenuOption, key: number) {
  // Separator
  if (option.type === "separator") {
    return <DropdownMenuSeparator key={`separator-${key}`} />
  }

  // Custom render
  if (option.type === "custom") {
    return <div key={`custom-${key}`}>{option.render()}</div>
  }

  // Submenu
  if (option.type === "submenu") {
    return renderSubmenuItem(option, key)
  }

  // Link option
  if (option.type === "link") {
    return renderLinkItem(option, key)
  }

  // Toggle option
  if (option.type === "toggle") {
    return renderToggleItem(option, key)
  }

  // Action option
  if (option.type === "action") {
    return renderActionItem(option, key)
  }

  return null
}

/**
 * Renders a link dropdown menu item
 */
function renderLinkItem(option: LinkDropdownMenuOption, key: number) {
  const Icon = option.icon

  return (
    <Link to={option.href} key={`link-${key}`}>
      <DropdownMenuItem disabled={option.disabled} variant={option.variant}>
        {Icon && <Icon className="size-4" />}
        {option.label}
        {option.shortcut && (
          <DropdownMenuShortcut>{option.shortcut}</DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
    </Link>
  )
}

/**
 * Renders an action dropdown menu item
 */
function renderActionItem(option: ActionDropdownMenuOption, key: number) {
  const Icon = option.icon

  return (
    <DropdownMenuItem
      key={`action-${key}`}
      disabled={option.disabled}
      variant={option.variant}
      onClick={option.onClick}
    >
      {Icon && <Icon className="size-4" />}
      {option.label}
      {option.shortcut && (
        <DropdownMenuShortcut>{option.shortcut}</DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  )
}

/**
 * Renders a toggle dropdown menu item that doesn't close the dropdown
 */
function renderToggleItem(option: ToggleDropdownMenuOption, key: number) {
  const Icon = option.icon

  return (
    <DropdownMenuItem
      key={`toggle-${key}`}
      disabled={option.disabled}
      variant={option.variant}
      onSelect={(e) => {
        e.preventDefault()
        option.onToggle()
      }}
    >
      {Icon && <Icon className="size-4" />}
      {option.label}
      {option.shortcut && (
        <DropdownMenuShortcut>{option.shortcut}</DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  )
}

/**
 * Renders a submenu dropdown menu item
 */
function renderSubmenuItem(option: SubmenuDropdownMenuOption, key: number) {
  const Icon = option.icon

  return (
    <DropdownMenuSub key={`submenu-${key}`}>
      <DropdownMenuSubTrigger disabled={option.disabled}>
        {Icon && <Icon className="size-4" />}
        {option.label}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {option.items.map((subOption, subIndex) =>
            renderDropdownMenuItem(subOption, subIndex),
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

/**
 * Flexible dropdown menu component that accepts children and configurable options
 *
 * @example
 * ```tsx
 * <FlexibleDropdownMenu
 *   groups={[
 *     {
 *       label: "My Account",
 *       options: [
 *         { type: "link", label: "Profile", href: "/profile", icon: IconUser },
 *         { type: "action", label: "Settings", onClick: () => console.log("Settings") }
 *       ]
 *     },
 *     {
 *       options: [
 *         { type: "separator" },
 *         { type: "action", label: "Logout", onClick: handleLogout, variant: "destructive" }
 *       ]
 *     }
 *   ]}
 * >
 *   <Button>Open Menu</Button>
 * </FlexibleDropdownMenu>
 * ```
 */
export function FlexibleDropdownMenu({
  children,
  groups,
  align = "end",
  sideOffset = 4,
  className,
}: FlexibleDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={className}
        align={align}
        sideOffset={sideOffset}
      >
        {groups.map((group, groupIndex) => (
          <div key={`group-${groupIndex}`}>
            {group.label && (
              <DropdownMenuLabel className="text-xs">
                {group.label}
              </DropdownMenuLabel>
            )}
            <DropdownMenuGroup>
              {group.options.map((option, optionIndex) =>
                renderDropdownMenuItem(option, optionIndex),
              )}
            </DropdownMenuGroup>
            {groupIndex < groups.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
