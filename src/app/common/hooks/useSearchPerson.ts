import React, { useCallback, useEffect, useState } from "react"
import { ErrorResponse } from "@/shared/errors/error-response"

import { DocumentTypeCode, SearchClientParams } from "../types/common.type"
import { useSearchClient } from "./useCommonService"

// ✅ interno (BD Persona)
import { useSearchPersonByDocumentLocal } from "@/app/person/hooks/usePersonsService"

/**
 * Este hook hace:
 * 1) Buscar primero en BD (Person /persons/by-document/local)
 * 2) Si no existe (404) -> fallback al lookup externo (clients/by-document)
 *
 * IMPORTANTE:
 * - Si viene de BD, devolvemos el objeto person tal cual (PersonByDocumentResponse)
 * - Si viene del externo, devolvemos el UserInfo (con fiscalAddress, etc.)
 * Así client-info.tsx puede diferenciar ambos casos.
 */
interface UseSearchDocumentParams {
  documentType?: DocumentTypeCode
  documentNumber: string
  shouldValidate: boolean | (() => Promise<boolean>)
  onSuccess: (data: any) => void
}

export function useSearchDocument({
  documentType,
  documentNumber,
  shouldValidate,
  onSuccess,
}: UseSearchDocumentParams) {
  const [searchClient, setSearchClient] = useState<SearchClientParams>({
    document: documentNumber,
    documentType,
  })

  // 1) externo (lookup actual)
  const client = useSearchClient(searchClient)

  // 2) interno (BD Persona) - manual
  const internal = useSearchPersonByDocumentLocal()

  const handleSearch = useCallback(async () => {
    // ✅ validar antes de buscar
    const isValid =
      typeof shouldValidate === "function" ? await shouldValidate() : shouldValidate
    if (!isValid) return

    // ✅ solo tipos que hoy permites (DNI/RUC según tu lógica actual)
    if (documentType !== "3" && documentType !== "4") return

    // ✅ 1) Intentar BD primero
    try {
      const person = await internal.mutateAsync({
        documentTypeId: Number(documentType),
        document: documentNumber,
      })

      // ✅ CLAVE: devolver tal cual (NO agregar fiscalAddress aquí)
      onSuccess(person)
      return
    } catch (err) {
      // Si NO es 404, no hacemos fallback (porque fue error real)
      if (!(err instanceof ErrorResponse && err.statusCode === 404)) return
      // 404 -> seguimos al fallback externo
    }

    // ✅ 2) Fallback externo: disparar query (se activa por enabled de longitud)
    setSearchClient({
      document: documentNumber,
      documentType: documentType as DocumentTypeCode,
    })
  }, [documentType, documentNumber, shouldValidate, internal, onSuccess])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  // ✅ Cuando el externo responde OK, ejecutar onSuccess como antes
  useEffect(() => {
    if (client.isSuccess && client.data) {
      onSuccess(client.data)
    }
  }, [client.isSuccess, client.data, onSuccess])

  return {
    client, // externo
    internal, // interno
    handleSearch,
    handleKeyDown,
  }
}
