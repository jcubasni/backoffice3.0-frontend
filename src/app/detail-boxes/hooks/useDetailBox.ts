import { useEffect, useMemo, useState } from "react"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useTableDataCopy } from "@/shared/hooks/useTableDataCopy"
import { useModalStore } from "@/shared/store/modal.store"
import { detailBoxColumns } from "../lib/detail-box-columns"
import { DetailBoxesStatus } from "../types/detail-boxes.type"
import {
  useGetDetailBox,
  useLiquidatedDetailBox,
  usePreliquidatedDetailBox,
  useSaveDetailBox,
} from "./useDetailBoxService"

export function useDetailBoxModalLogic({
  cashRegisterId,
}: {
  cashRegisterId: string
}) {
  const {
    data: movements,
    isLoading,
    isFetching,
  } = useGetDetailBox(cashRegisterId)

  const preliquidated =
    movements?.cashRegisterState === DetailBoxesStatus.PRELIQUIDATED
  const closed = movements?.cashRegisterState === DetailBoxesStatus.CLOSED

  const [edit, setEdit] = useState(false)

  useEffect(() => {
    if (movements) {
      setEdit(closed)
    }
  }, [closed, movements])

  const { localData, originalData, setLocalData } = useTableDataCopy(
    movements?.details,
  )

  const table = useDataTable({
    data: localData,
    columns: detailBoxColumns(edit),
    isLoading: isLoading || isFetching,
  })

  // Override updateData to use localData instead of internal tableData
  table.options.meta = {
    ...table.options.meta,
    updateData: (rowIndex: number, columnId: string, value: any) => {
      setLocalData((prevData) =>
        prevData.map((row, index) =>
          index === rowIndex ? { ...row, [columnId]: value } : row,
        ),
      )
    },
  }
  const data = table.getCoreRowModel().rows
  const totalDeposit = useMemo(() => {
    return data.reduce((total, row) => total + row.original.totalAmount, 0)
  }, [data])
  const foundAmount = useMemo(() => {
    return data.reduce(
      (total, row) => total + (row.original.foundAmount ?? 0),
      0,
    )
  }, [data])

  const liquidatedDetailBox = useLiquidatedDetailBox()
  const preliquidatedDetailBox = usePreliquidatedDetailBox()
  const saveDetailBox = useSaveDetailBox()

  const formatData = () => {
    const dto = {
      cashRegisterId: cashRegisterId,
      data: {
        totalAmount: totalDeposit,
        totalFoundMount: foundAmount,
        observations: "Liquidación de caja",
        details: data.map((row) => ({
          codeDepositType: row.original.movementTypeCode,
          amount: row.original.totalAmount,
          foundMount: row.original.foundAmount ?? 0,
          observations: row.original.observations ?? undefined,
        })),
      },
    }
    return dto
  }

  const handlePreliquidated = () => {
    const dto = formatData()
    preliquidatedDetailBox.mutate(dto)
  }

  const handleSave = () => {
    const dto = formatData()
    saveDetailBox.mutate(dto)
  }

  const handleLiquidated = () => {
    liquidatedDetailBox.mutate(cashRegisterId)
  }

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(localData) !== JSON.stringify(originalData)
  }, [localData, originalData])

  const resetToOriginalData = () => {
    setLocalData([...originalData])
  }

  const handleEditToggle = () => {
    if (edit) {
      useModalStore.getState().openModal("modal-enable-edit", {
        isEditing: true,
        onConfirm: () => {
          if (hasUnsavedChanges) {
            resetToOriginalData()
          }
          setEdit(false)
        },
      })
    } else if (!edit) {
      useModalStore.getState().openModal("modal-enable-edit", {
        isEditing: false,
        onConfirm: () => setEdit(true),
      })
    }
  }

  return {
    movements,
    isLoading,
    isFetching,
    preliquidated,
    closed,
    edit,
    setEdit,
    table,
    data,
    totalDeposit,
    foundAmount,
    handlePreliquidated,
    handleSave,
    handleLiquidated,
    hasUnsavedChanges,
    resetToOriginalData,
    handleEditToggle,
  }
}
