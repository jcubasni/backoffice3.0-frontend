import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PulseLoader } from "react-spinners"
import { Badge } from "@/components/ui/badge"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/shared/hooks/useDebounce"
import type { ComboBoxOption } from "@/shared/types/combo-box.type"
import { Colors } from "@/shared/types/constans"

export interface ComboSearchProps extends Omit<ButtonProps, "onSelect"> {
  label?: string
  classContainer?: string
  classLabel?: string
  placeholder?: string
  options?: ComboBoxOption[]
  defaultValue?: string | number
  value?: string | number
  search?: string
  onSelect?: (option: string) => void
  onSearch?: (searchTerm: string) => void
  onDeselect?: () => void
  isLoading?: boolean
}

export function ComboSearch({
  label,
  classContainer,
  classLabel,
  placeholder,
  options: initialOptions = [],
  onSelect,
  onSearch,
  onDeselect,
  defaultValue,
  value: controlledValue,
  search,
  isLoading = false,
  ...props
}: ComboSearchProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useDebounce(props.disabled ? "" : (search ?? ""))
  const [value, setValue] = useState<string>(defaultValue?.toString() ?? "")

  // Derivar el searchTerm limpio cuando está disabled
  const effectiveSearchTerm = props.disabled ? "" : searchTerm

  // Derivar la opción seleccionada persistida
  const persistedSelectedOption = useMemo(() => {
    if (!value) return null
    return initialOptions.find((option) => option.value === value) ?? null
  }, [value, initialOptions])

  const options = useMemo(() => {
    let filteredOptions = initialOptions

    if (!onSearch && effectiveSearchTerm) {
      const term = effectiveSearchTerm.toLowerCase()
      filteredOptions = initialOptions.filter((option) =>
        option.label.toLowerCase().includes(term),
      )
    }

    // Always include the persisted selected option if it exists and isn't already in the filtered list
    if (value && persistedSelectedOption) {
      if (!filteredOptions.some((option) => option.value === value)) {
        filteredOptions = [persistedSelectedOption, ...filteredOptions]
      }
    }

    return filteredOptions
  }, [
    initialOptions,
    effectiveSearchTerm,
    onSearch,
    value,
    persistedSelectedOption,
  ])

  const selectedOption = useMemo(
    () =>
      persistedSelectedOption ||
      initialOptions.find((option) => option.value === value),
    [persistedSelectedOption, initialOptions, value],
  )

  // Manejar cambios de search term con callback directo
  const handleSearchTermChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
    onSearch?.(newSearchTerm)
  }

  const handleSelect = (currentValue: string) => {
    onSelect?.(currentValue)
    setValue(currentValue)
    setOpen(false)
  }

  const handleDeselect = () => {
    onSearch?.("")
    onSelect?.("")
    onDeselect?.()
    setValue("")
  }

  useEffect(() => {
    const newValue = controlledValue !== undefined ? controlledValue : defaultValue
    setValue(newValue?.toString() ?? "")
  }, [defaultValue, controlledValue])

  useEffect(() => {
    setSearchTerm(props.disabled ? "" : (search ?? ""))
  }, [search, props.disabled])

  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-2", classContainer)}>
      {label && (
        <Label
          className={cn("w-fit leading-4", classLabel)}
          htmlFor={props.name}
        >
          {label}
        </Label>
      )}
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            aria-expanded={open}
            {...props}
            className={cn(
              "group relative flex-1 justify-start overflow-hidden rounded px-2 text-sm",
              !value && "text-muted-foreground",
              props.className,
            )}
          >
            <AnimatePresence mode="wait">
              {value ? (
                <Badge
                  asChild
                  variant="blue"
                  className="h-5 max-w-fit gap-1.5 px-2 text-sm [&>svg]:pointer-events-auto"
                >
                  <motion.div
                    key="badge"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {!props.disabled && (
                      <X
                        className="size-3.5 shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeselect()
                        }}
                      />
                    )}
                    <span className="truncate">{selectedOption?.label}</span>
                  </motion.div>
                </Badge>
              ) : (
                <motion.span
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="truncate pr-8"
                >
                  {selectedOption?.label ||
                    placeholder ||
                    "Seleccionar una opcion"}
                </motion.span>
              )}
            </AnimatePresence>
            <div
              className={cn(
                "absolute top-0 right-0 flex h-full w-8 items-center justify-center bg-inherit",
                props.disabled && "hidden",
              )}
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </div>
          </Button>
        </PopoverTrigger>
        {open && (
          <PopoverContent
            className={cn(
              "popover-content-width-full fade-in-0 zoom-in-95 slide-in-from-top-2 animate-in rounded p-0",
            )}
          >
            <Command
              className={cn(options.length > 8 && "pr-1")}
              filter={onSearch ? () => 1 : undefined}
            >
              <CommandInput
                placeholder="Buscar"
                value={effectiveSearchTerm}
                onValueChange={handleSearchTermChange}
              />
              <CommandList>
                <ScrollArea
                  className={cn(
                    "h-fit overflow-auto",
                    options.length > 8 && "h-64 w-[calc(100%+0.2rem)] pr-1",
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <PulseLoader size={8} color={Colors.extra} />
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No hay opciones</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            className={cn(
                              "rounded! transition-colors hover:bg-blue-50 dark:text-gray-300 hover:dark:bg-background",
                              option.value === value &&
                                "bg-blue-100 dark:bg-background",
                            )}
                            key={option.value.toString()}
                            value={option.label}
                            onSelect={() => {
                              handleSelect(option.value.toString())
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "ml-auto text-primary dark:text-white",
                                value !== option.value && "opacity-0",
                              )}
                              size={18}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
