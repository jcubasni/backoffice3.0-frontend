import Big from "big.js"
import { AnimatePresence, motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { DECIMAL_PLACES } from "@/shared/lib/constans"

interface QuantityCounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
  decimalPlaces?: number
}

export const QuantityCounter = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  className,
  disabled = false,
  decimalPlaces = DECIMAL_PLACES,
}: QuantityCounterProps) => {
  const [inputText, setInputText] = useState(value.toString())
  const [direction, setDirection] = useState<"up" | "down">("up")
  const [isEditing, setIsEditing] = useState(false)

  // Sincronizar el texto cuando cambie el valor desde fuera
  useEffect(() => {
    if (!isEditing) {
      setInputText(value.toString())
    }
  }, [value, isEditing])
  const handleDecrement = () => {
    try {
      const bigValue = new Big(value.toFixed(decimalPlaces))
      const bigStep = new Big(step.toString())
      const bigMin = new Big(min.toString())

      const decremented = bigValue.minus(bigStep)
      const newValue = decremented.lt(bigMin)
        ? bigMin.toFixed(decimalPlaces)
        : decremented.toFixed(decimalPlaces)

      const numValue = parseFloat(newValue)
      if (numValue !== value) {
        setDirection("down")
        onChange(numValue)
      }
    } catch (error) {
      console.warn("Error in handleDecrement:", error)
    }
  }

  const handleIncrement = () => {
    try {
      const bigValue = new Big(value.toFixed(decimalPlaces))
      const bigStep = new Big(step.toString())

      const incremented = bigValue.plus(bigStep)
      const newValue =
        max && incremented.gt(new Big(max.toString()))
          ? new Big(max.toString()).toFixed(decimalPlaces)
          : incremented.toFixed(decimalPlaces)

      const numValue = parseFloat(newValue)
      if (numValue !== value) {
        setDirection("up")
        onChange(numValue)
      }
    } catch (error) {
      console.warn("Error in handleIncrement:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputText = e.target.value
    setInputText(newInputText)
    setIsEditing(true)

    // Si el campo está vacío, establecer a 0
    if (newInputText === "") {
      onChange(0)
      return
    }

    // Si solo es un punto decimal, establecer a 0 pero mantener el punto en el input
    if (newInputText === ".") {
      onChange(0)
      return
    }

    // Si termina en punto decimal (ej: "5."), no actualizar el valor hasta que se ingrese más
    if (
      newInputText.endsWith(".") &&
      !newInputText.slice(0, -1).includes(".")
    ) {
      return
    }

    const inputValue = Number.parseFloat(newInputText)
    if (!Number.isNaN(inputValue)) {
      try {
        const bigInput = new Big(inputValue.toString())
        const bigMin = new Big(min.toString())

        let clampedValue = bigInput.lt(bigMin) ? bigMin : bigInput
        if (max) {
          const bigMax = new Big(max.toString())
          clampedValue = clampedValue.gt(bigMax) ? bigMax : clampedValue
        }

        const finalValue = parseFloat(clampedValue.toFixed(decimalPlaces))
        onChange(finalValue)
      } catch {
        // Si Big.js falla, establecer a 0
        onChange(0)
      }
    }
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setInputText(value.toString())
  }

  const canDecrement = !disabled && value > min
  const canIncrement = !disabled && (!max || value < max)

  const variants = {
    enter: (direction: "up" | "down") => ({
      y: direction === "up" ? 20 : -20,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: "up" | "down") => ({
      y: direction === "up" ? -20 : 20,
      opacity: 0,
    }),
  }

  return (
    <div className={cn("mx-auto flex w-fit items-center gap-2", className)}>
      <Button
        type="button"
        className={cn(
          "size-6 rounded-full bg-primary p-0 transition-all duration-200",
          "hover:scale-105 hover:bg-primary/90",
          "active:scale-95",
          !canDecrement && "opacity-40",
        )}
        onClick={handleDecrement}
        disabled={!canDecrement}
      >
        <Minus className="size-3" />
      </Button>

      <div className="relative h-8 w-18 overflow-hidden rounded bg-background">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={value}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 500, damping: 25 },
              opacity: { duration: 0.1 },
            }}
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-150",
              isEditing && "opacity-0",
            )}
          >
            <span className="font-medium text-foreground tabular-nums">
              {value}
            </span>
          </motion.div>
        </AnimatePresence>
        <Input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "h-8 w-18 border-none bg-transparent px-1 text-center transition-opacity duration-150 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            !isEditing && "opacity-0 hover:opacity-100 focus:opacity-100",
          )}
          disabled={disabled}
        />
      </div>

      <Button
        type="button"
        className={cn(
          "size-6 rounded-full bg-primary p-0 transition-all duration-200",
          "hover:scale-105 hover:bg-primary/90",
          "active:scale-95",
          !canIncrement && "opacity-40",
        )}
        onClick={handleIncrement}
        disabled={!canIncrement}
      >
        <Plus className="size-3" />
      </Button>
    </div>
  )
}
