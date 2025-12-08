import { ChevronDown } from "lucide-react"
import { JSX } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toCapitalize } from "@/shared/lib/words"

export interface DropdownOption {
  id: string
  label: string
  onSelect?: () => void
  children?: DropdownOption[]
  type?: "item" | "checkbox"
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export interface DropdownProps {
  mainLabel: string | JSX.Element
  options: DropdownOption[]
}

export function Dropdown({ mainLabel, options }: DropdownProps) {
  if (!options || options.length === 0) return null

  const renderOptions = (opts: DropdownOption[]) =>
    opts.map((option) => {
      if (option.children && option.children.length > 0) {
        return (
          <DropdownMenuSub key={option.id}>
            <DropdownMenuSubTrigger>
              {toCapitalize(option.label)}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={4}>
              {renderOptions(option.children)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )
      }

      if (option.type === "checkbox") {
        return (
          <DropdownMenuCheckboxItem
            key={option.id}
            checked={option.checked}
            onCheckedChange={option.onCheckedChange}
            className="capitalize"
          >
            {toCapitalize(option.label)}
          </DropdownMenuCheckboxItem>
        )
      }

      return (
        <DropdownMenuItem key={option.id} onSelect={option.onSelect}>
          {toCapitalize(option.label)}
        </DropdownMenuItem>
      )
    })

  const shouldRenderChevron = typeof mainLabel === "string"
  const renderMainLabel = shouldRenderChevron ? (
    toCapitalize(mainLabel)
  ) : (
    <span>{mainLabel}</span>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 font-medium">
        {renderMainLabel}
        {shouldRenderChevron && <ChevronDown size={15} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8}>
        {renderOptions(options)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
