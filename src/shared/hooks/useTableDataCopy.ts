import { useEffect, useState } from "react"

export function useTableDataCopy<T>(data: T[] | undefined) {
  const [localData, setLocalData] = useState<T[]>([])
  const [originalData, setOriginalData] = useState<T[]>([])

  useEffect(() => {
    if (data) {
      const dataCopy = data.map((item) => ({ ...item }))
      setLocalData(dataCopy)
      setOriginalData(data.map((item) => ({ ...item })))
    }
  }, [data])

  return {
    localData,
    originalData,
    setLocalData,
  }
}
