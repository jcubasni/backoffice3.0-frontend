import { FieldErrors } from "react-hook-form"

type ErrorField = {
  error: string
  isArrayError: boolean
  errorArrayIndex?: number
}

export function getFirstError(errors: FieldErrors): ErrorField {
  let errorArrayIndex: number | undefined
  let isArrayError = false
  let firstError = Object.values(getLastObject(errors))[0]
  if (Array.isArray(firstError)) {
    isArrayError = true
    const firstIndex = Number(Object.keys(firstError)[0])
    firstError = Object.values(firstError[firstIndex])[0] as FieldErrors
    errorArrayIndex = firstIndex
  }
  const error = firstError?.message?.toString() ?? ""
  return {
    error,
    isArrayError,
    errorArrayIndex,
  }
}

function getLastObject<T extends object>(obj: T): T {
  const firstValue = Object.values(obj)[0]
  const nextValue = Object.values(firstValue)[0]
  if (typeof nextValue === "object" && !Array.isArray(firstValue)) {
    return getLastObject(firstValue)
  }
  return obj
}
