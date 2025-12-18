// combo-box.tsx
import { Check, ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import { ClipLoader } from "react-spinners"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { ComboBoxOption } from "@/shared/types/combo-box.type"
import { Colors } from "@/shared/types/constans"

export interface ComboBoxProps extends Omit<ButtonProps, "onSelect"> {
  label?: string
  classContainer?: string
  classLabel?: string
  placeholder?: string
  options?: ComboBoxOption[]
  value?: string | number              // ✅ controlled
  onSelect?: (option: string) => boolean | void
  isLoading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
}

export function ComboBox({
  label,
  classContainer,
  classLabel,
  placeholder,
  options = [],
  onSelect,
  value,
  isLoading = false,
  searchable = false,
  searchPlaceholder = "Buscar...",
  ...props
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)

  const stringValue = value?.toString() ?? ""

  const selectedOption = useMemo(
    () => options.find((option) => option.value.toString() === stringValue),
    [options, stringValue],
  )

  const handleSelect = (currentValue: string) => {
    const result = onSelect?.(currentValue)
    if (result !== false) setOpen(false)
  }

  return (
    <div className={cn("flex flex-col gap-2", classContainer)}>
      {label && (
        <Label className={cn("w-fit leading-4", classLabel)} htmlFor={props.name}>
          {label}
        </Label>
      )}

      <Popover modal open={open && !isLoading} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="header"
            aria-expanded={open}
            {...props}
            className={cn(
              "group relative w-full max-w-full justify-start overflow-hidden rounded px-2 font-normal text-sm",
              !stringValue && "text-foreground/40",
              props.className,
            )}
          >
            <span className="block truncate pr-10 text-left">
              {selectedOption?.label ?? placeholder ?? "Seleccionar una opcion"}
            </span>

            <div
              className={cn(
                "absolute top-0 right-0 flex h-full w-8 items-center justify-center",
                props.disabled && "hidden",
              )}
            >
              {isLoading ? (
                <ClipLoader size={8} color={Colors.extra} />
              ) : (
                <ChevronDown
                  className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
                />
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent asChild className={cn("popover-content-width-full rounded p-0")}>
          <Command shouldFilter={searchable} className={cn(options.length > 8 && "pr-1")}>
            <CommandInput
              placeholder={searchPlaceholder}
              className={cn(!searchable && "hidden h-0 overflow-hidden border-0 p-0")}
            />

            <CommandList>
              <ScrollArea
                className={cn(
                  "h-fit overflow-auto",
                  options.length > 8 && "h-64 w-[calc(100%+0.2rem)] pr-1",
                )}
              >
                <CommandEmpty>No hay opciones</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const optValue = option.value.toString()
                    return (
                      <CommandItem
                        key={optValue}
                        value={option.label}
                        onSelect={() => handleSelect(optValue)}
                        className={cn(
                          "rounded! dark:text-gray-300",
                          optValue === stringValue
                            ? "bg-blue-100 font-bold dark:bg-background"
                            : "transition-colors hover:bg-blue-50 hover:dark:bg-background",
                        )}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto text-primary dark:text-white",
                            optValue === stringValue ? "opacity-100" : "opacity-0",
                          )}
                          size={18}
                        />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
