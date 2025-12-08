import { Table } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { DropdownOption } from "../components/ui/dropdown"

interface ColumnConfig {
  id: string
  defaultVisible?: boolean
}

interface UseColumnVisibilityProps<T> {
  table: Table<T>
  columnsConfig: ColumnConfig[]
}

export function useColumnVisibility<T>({
  table,
  columnsConfig,
}: UseColumnVisibilityProps<T>) {
  // Estado para manejar visibilidad de columnas alternables
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {}
    columnsConfig.forEach((col) => {
      initial[col.id] = col.defaultVisible ?? true
    })
    return initial
  })

  // Filtrar columnas ocultas para pasarle al useDataTable
  const hiddenColumns = useMemo(() => {
    return columnsConfig
      .filter((col) => !columnVisibility[col.id])
      .map((col) => col.id)
  }, [columnVisibility, columnsConfig])

  // Generar opciones para el dropdown
  const dropdownOptions = useMemo((): DropdownOption[] => {
    return columnsConfig.map((config) => {
      // Buscar la columna en la tabla para obtener el header
      const column = table.getAllColumns().find((col) => col.id === config.id)
      const header = column?.columnDef.header as string

      return {
        id: config.id,
        label: header || config.id,
        type: "checkbox" as const,
        checked: columnVisibility[config.id],
        onCheckedChange: (checked: boolean) => {
          setColumnVisibility((prev) => ({
            ...prev,
            [config.id]: checked,
          }))
        },
      }
    })
  }, [columnVisibility, columnsConfig, table])

  const toggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  return {
    columnVisibility,
    setColumnVisibility,
    hiddenColumns,
    dropdownOptions,
    toggleColumn,
  }
}
