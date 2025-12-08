import { format } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
import { useState } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Label } from "../../../components/ui/label"

export interface DatePickerProps extends Omit<ButtonProps, "onSelect"> {
  onSelect?: (date: Date) => void
  label?: string
  defaultValue?: string
  min?: Date
  max?: Date
  classContainer?: string
  classLabel?: string
}

export function DatePicker({
  onSelect,
  label,
  disabled = false,
  defaultValue,
  min,
  max,
  className,
  classContainer,
  classLabel,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = useState(false)

  React.useEffect(() => {
    if (defaultValue) return setDate(new Date(`${defaultValue}T00:00:00`))
    setDate(undefined)
  }, [defaultValue])

  React.useEffect(() => {
    if (date! < min!) {
      setDate(min)
    }
  }, [min])

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-start gap-2",
        classContainer,
      )}
    >
      {label && (
        <Label htmlFor="date-picker" className={cn(classLabel)}>
          {label}
        </Label>
      )}
      <Popover
        modal={true}
        open={open}
        onOpenChange={(open) => {
          if (disabled) return
          setOpen(open)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size={"header"}
            className={cn(
              "justify-start rounded text-left font-normal",
              !date && "text-black/40",
              className,
            )}
            disabled={disabled}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary/80" />
            {date ? format(date, "yyyy-MM-dd") : <span>Elija una fecha</span>}
          </Button>
        </PopoverTrigger>
        <AnimatePresence>
          {open && (
            <PopoverContent asChild className="w-auto p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(value) => {
                    if (!value) return
                    setOpen(false)
                    setDate(value)
                    onSelect?.(value)
                  }}
                  initialFocus
                  fromDate={min}
                  toDate={max}
                  defaultMonth={date}
                />
              </motion.div>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </div>
  )
}
