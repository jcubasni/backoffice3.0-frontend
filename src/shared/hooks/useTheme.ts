import { useCallback, useEffect, useState } from "react"

export function useThemeToggle() {
  const [theme, setTheme] = useState(false)

  // Inicializar desde localStorage o preferencia del sistema
  useEffect(() => {
    const html = document.documentElement
    const saved = localStorage.getItem("theme")
    const dark = saved === "dark"
    setTheme(dark)
    html.classList.toggle("dark", dark)
  }, [])

  // Función para alternar tema
  const toggleTheme = useCallback(() => {
    const html = document.documentElement
    setTheme((prev) => {
      const next = !prev
      html.classList.toggle("dark", next)
      localStorage.setItem("theme", next ? "dark" : "light")
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
