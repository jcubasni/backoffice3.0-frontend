import { motion } from "framer-motion"
import { createContext, useContext, useId, useState } from "react"
import { cn } from "@/lib/utils"

const TabFilterContext = createContext<string>("")

interface TabFilterProps {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}

export const TabFilter = ({ children, active, onClick }: TabFilterProps) => {
  const contextId = useContext(TabFilterContext)

  return (
    <motion.li
      className={cn(
        "relative z-10 w-fit min-w-fit flex-1 cursor-pointer select-none rounded-t-lg px-5 py-2 text-center font-medium text-sm transition-colors",
        active
          ? "text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      onClick={onClick}
      role="tab"
      aria-selected={active}
      initial={false}
      whileTap={{ scale: 0.98 }}
    >
      {active && (
        <motion.div
          className="absolute inset-0 z-[-1] rounded-t-lg bg-primary"
          layoutId={`activeTabBackground-${contextId}`}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
          layoutId={`activeTabUnderline-${contextId}`}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.li>
  )
}

interface TabFilterContainerProps {
  children: React.ReactNode
  className?: string
}

TabFilter.Container = function Container({
  children,
  className,
}: TabFilterContainerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const uniqueId = useId()

  return (
    <TabFilterContext.Provider value={uniqueId}>
      <motion.div
        className={cn(
          "relative flex w-fit gap-3 border-border border-b",
          isAnimating && "pointer-events-none",
          className,
        )}
        role="tablist"
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <ul className="flex flex-wrap gap-2">{children}</ul>
      </motion.div>
    </TabFilterContext.Provider>
  )
}
