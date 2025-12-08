import { AnimatePresence, motion } from "framer-motion"
import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonProps } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { MultiSelectOption } from "@/shared/types/multi-select.type"

export interface MultiSelectProps
  extends Omit<ButtonProps, "onChange" | "className"> {
  label?: string
  options: MultiSelectOption[]
  onChange?: (data: string[]) => void
  className?: string
  showSelectedItems?: number
  shortName?: boolean
  defaultOptions?: (string | number)[]
  classContainer?: string
  classLabel?: string
  placeholder?: string
  isLoading?: boolean
}

export function MultiSelect({
  label,
  options,
  onChange,
  className,
  showSelectedItems = 7,
  shortName = false,
  defaultOptions,
  classContainer,
  classLabel,
  placeholder = "Selecciona una opción",
  isLoading = false,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [selectValues, setSelectValues] = useState<string[]>([])
  const [selectOptions, setSelectOptions] = useState<MultiSelectOption[]>([])
  const returnValues = (value: string) => {
    const updatedValues = selectValues.includes(value)
      ? selectValues.filter((option) => option !== value)
      : [...selectValues, value]
    setSelectValues(updatedValues)
    setSelectOptions(options.filter((opt) => updatedValues.includes(opt.value)))
    onChange?.(updatedValues)
  }

  useEffect(() => {
    if (defaultOptions) {
      const stringDefaults = defaultOptions.map(String)
      setSelectValues(stringDefaults)
      setSelectOptions(
        options.filter((opt) => stringDefaults.includes(opt.value)),
      )
    }
  }, [defaultOptions, options])

  return (
    <div className={cn("flex flex-col gap-1", classContainer)}>
      {label && (
        <Label htmlFor={label} className={cn("w-fit leading-4", classLabel)}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start",
              "text-secondary-foreground",
              className,
            )}
            {...props}
          >
            {isLoading ? (
              <ClipLoader size={16} className="text-calendar" />
            ) : (
              <PlusCircle size={16} className="text-calendar" />
            )}
            {selectValues && selectValues.length > 0 ? (
              <>
                <motion.span
                  key={selectValues.length}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Badge variant="blue">{selectValues.length}</Badge>
                </motion.span>
                <div className="hidden space-x-1 lg:flex">
                  {selectValues.length > showSelectedItems ? (
                    <motion.span
                      key={selectValues.length}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Badge variant="blue">
                        {selectValues.length} seleccionados
                      </Badge>
                    </motion.span>
                  ) : (
                    selectOptions.map((option) => (
                      <motion.span
                        key={option.value.toString()}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                      >
                        <Badge variant="blue">
                          {shortName ? option.label.slice(0, 4) : option.label}
                        </Badge>
                      </motion.span>
                    ))
                  )}
                </div>
              </>
            ) : (
              <span className="ml-2 text-muted-foreground">
                {isLoading ? "Cargando..." : placeholder}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <AnimatePresence>
          {open && (
            <PopoverContent
              asChild
              className="popover-content-width-full max-h-60 w-60 p-0"
              align="start"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Command
                  filter={(
                    value: string,
                    search: string,
                    keywords?: string[],
                  ) => {
                    const combinedText = `${value} ${keywords?.join(" ")}`
                    return combinedText
                      .toLowerCase()
                      .includes(search.toLowerCase())
                      ? 1
                      : 0
                  }}
                  className="h-full"
                >
                  <CommandList>
                    <CommandGroup>
                      {options.map((option) => {
                        return (
                          <CommandItem
                            key={option.value.toString()}
                            onSelect={() => {
                              returnValues(option.value)
                            }}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded border text-transparent transition-colors",
                                selectValues.includes(option.value) &&
                                  "bg-secondary text-white",
                              )}
                            >
                              <Checkbox
                                checked={selectValues.includes(option.value)}
                              />
                            </div>
                            {option.icon && (
                              <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{option.label}</span>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                    {selectValues.length > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              setSelectValues([])
                              onChange?.([])
                            }}
                            className="justify-center text-center"
                          >
                            Limpiar filtros
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </motion.div>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </div>
  )
}
