import { useCallback, useEffect, useState } from "react"
import { UserInfo } from "@/app/accounts/types/client.type"
import { DocumentTypeCode, SearchClientParams } from "../types/common.type"
import { useSearchClient } from "./useCommonService"

interface UseSearchDocumentParams {
  documentType?: DocumentTypeCode
  documentNumber: string
  shouldValidate: boolean | (() => Promise<boolean>) // flag o función que valida antes de buscar
  onSuccess: (data: UserInfo) => void // callback cuando llega respuesta
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

  const client = useSearchClient(searchClient)

  const handleSearch = useCallback(async () => {
    // Si shouldValidate es una función, llamarla y verificar el resultado
    if (typeof shouldValidate === "function") {
      const isValid = await shouldValidate()
      if (!isValid) return
    } else if (!shouldValidate) {
      // Si es boolean y es false, no continuar
      return
    }

    if (documentType === "3" || documentType === "4") {
      const docTypeCode = documentType as DocumentTypeCode

      setSearchClient({
        document: documentNumber,
        documentType: docTypeCode,
      })
    }
  }, [documentType, documentNumber, shouldValidate])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  useEffect(() => {
    if (client.isSuccess && client.data) {
      onSuccess(client.data)
    }
  }, [client.isSuccess, client.data, onSuccess])

  return {
    client,
    handleSearch,
    handleKeyDown,
  }
}
