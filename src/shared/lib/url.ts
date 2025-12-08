import { useNavigate } from "@tanstack/react-router"
import type { z } from "zod"

type InferSearchParams<T extends z.ZodTypeAny> = z.infer<T>

export const useHandleSearchParams = <T extends z.ZodTypeAny>(
  route: string,
) => {
  const navigate = useNavigate()

  return <K extends keyof InferSearchParams<T>>(
    key: K,
    value: InferSearchParams<T>[K],
  ) => {
    navigate({
      to: route,
      search: (prev) => ({
        ...prev,
        [key]: value,
      }),
    })
  }
}
