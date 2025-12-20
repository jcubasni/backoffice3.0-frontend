import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ErrorResponse } from "@/shared/errors/error-response"

import {
  getPersonByDocumentLocal,
  type PersonByDocumentResponse,
  type SearchPersonByDocumentParams,
} from "../services/persons.service"

/**
 * Hook interno (BD):
 * - Es MUTATION para que sea manual (botón Buscar).
 * - No muestra toast en 404 (para permitir fallback externo).
 */
export function useSearchPersonByDocumentLocal() {
  return useMutation<PersonByDocumentResponse, unknown, SearchPersonByDocumentParams>({
    mutationKey: ["person", "by-document", "local"],
    mutationFn: (params) => getPersonByDocumentLocal(params),
    onError: (err: any) => {
      // 404 = "no existe en BD", lo manejamos arriba (fallback externo)
      if (err instanceof ErrorResponse && err.statusCode === 404) return

      const msg =
        err instanceof ErrorResponse
          ? err.message
          : err?.message ?? "No se pudo buscar la persona"

      toast.error(msg)
    },
  })
}
