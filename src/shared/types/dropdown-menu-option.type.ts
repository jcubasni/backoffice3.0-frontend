import type React from "react"

/**
 * Base option type for dropdown menu items
 */
export type BaseDropdownMenuOption = {
  /** Icon component to display */
  icon?: React.ComponentType<{ className?: string }>
  /** Label text to display */
  label: string
  /** Whether the option is disabled */
  disabled?: boolean
  /** Visual variant of the option */
  variant?: "default" | "destructive"
  /** Optional keyboard shortcut to display */
  shortcut?: string
}

/**
 * Option that navigates to a URL when clicked
 */
export type LinkDropdownMenuOption = BaseDropdownMenuOption & {
  type: "link"
  /** URL to navigate to */
  href: string
}

/**
 * Option that executes an action when clicked
 */
export type ActionDropdownMenuOption = BaseDropdownMenuOption & {
  type: "action"
  /** Function to execute on click */
  onClick: () => void
}

/**
 * Option that toggles a state without closing the dropdown
 */
export type ToggleDropdownMenuOption = BaseDropdownMenuOption & {
  type: "toggle"
  /** Function to execute on toggle */
  onToggle: () => void
  /** Current toggle state */
  checked?: boolean
}

/**
 * Option that contains a submenu
 */
export type SubmenuDropdownMenuOption = BaseDropdownMenuOption & {
  type: "submenu"
  /** Array of options in the submenu */
  items: DropdownMenuOption[]
}

/**
 * Option that renders custom content
 */
export type CustomDropdownMenuOption = {
  type: "custom"
  /** Custom render function */
  render: () => React.ReactNode
}

/**
 * Separator between menu items
 */
export type SeparatorDropdownMenuOption = {
  type: "separator"
}

/**
 * Union type of all possible dropdown menu options
 */
export type DropdownMenuOption =
  | LinkDropdownMenuOption
  | ActionDropdownMenuOption
  | ToggleDropdownMenuOption
  | SubmenuDropdownMenuOption
  | CustomDropdownMenuOption
  | SeparatorDropdownMenuOption

/**
 * Group of dropdown menu options
 */
export type DropdownMenuOptionGroup = {
  /** Optional label for the group */
  label?: string
  /** Array of options in the group */
  options: DropdownMenuOption[]
}
