import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addClient,
  // editClient, // 👈 lo dejaremos comentado hasta que exista el endpoint real
  getAccountByClientId,
  getAccountByDocumentNumber,
  getClients,
  getProductsByAccount,
  searchClientBySaleDocument,
  updateProductsByClient,
} from "../services/clients.service"
import {
  ClientDTO,
  ClientResponse,
  SearchClientParams,
  UpdateProductsParams,
} from "../types/client.type"
import { Modals } from "../types/modals-name"
import { EditClientSchema } from "../schemas/edit-client.schema"

const CLIENTS_QUERY_KEY = ["clients"] as const

export function useGetClients() {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: getClients,
  })
}

export function useAddClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["add-client"],
    mutationFn: (params: ClientDTO) => addClient(params),
    onSuccess: () => {
      toast.success("Se agregó el cliente")
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
      useModalStore.getState().closeModal(Modals.ADD_CLIENT)
    },
    onError: () => {
      toast.error("No se pudo registrar el cliente")
    },
  })
}

export function useSearchClientBySaleDocument(params: SearchClientParams) {
  return useQuery({
    queryKey: ["search-client", "by-sale-document", params],
    queryFn: () => searchClientBySaleDocument(params),
    enabled: params.saleDocumentTypeId !== undefined && !!params.paymentTypeId,
  })
}

export function useGetProductsByAccount(accountId?: string) {
  return useQuery({
    queryKey: ["products", "by-client", accountId],
    queryFn: () => getProductsByAccount(accountId!),
    enabled: !!accountId,
  })
}

export function useUpdateProductsByClient() {
  return useMutation({
    mutationKey: ["update-products", "by-client"],
    mutationFn: ({ accountId, body }: UpdateProductsParams) =>
      updateProductsByClient(accountId, body),
    onSuccess: () => {
      toast.success("Se actualizaron los productos")
      useModalStore.getState().closeModal(Modals.ADD_PRODUCT)
    },
    onError: () => {
      toast.error("No se pudieron actualizar los productos")
    },
  })
}

export function useGetAccountByClientId(clientId?: string, isCredit?: boolean) {
  return useQuery({
    queryKey: ["account", "by-client-id", clientId],
    queryFn: () => getAccountByClientId(clientId!),
    enabled: !!clientId && isCredit,
  })
}

export function useGetAccountByDocumentNumber(
  documentNumber?: string,
  documentTypeId?: number,
) {
  return useQuery({
    queryKey: ["account", "by-document", documentNumber, documentTypeId],
    queryFn: () => getAccountByDocumentNumber(documentNumber!, documentTypeId!),
    enabled: !!documentNumber && !!documentTypeId,
  })
}

/**
 * 🟢 useEditClient (MODO MAQUETA)
 * - Identifica al cliente por `documentNumber` (no tienes id).
 * - Actualiza SOLO el cache de ["clients"].
 * - Muestra toast y cierra modal.
 *
 * Cuando tengas endpoint real:
 *  - Podrás cambiar mutationFn para llamar a editClient(...)
 *  - Y si backend te da id, adaptas el identificador.
 */
export function useEditClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["edit-client"],
    // ⛔ Sin llamar a backend todavía
    mutationFn: async ({
      documentNumber,
      data,
    }: {
      documentNumber: string
      data: EditClientSchema
    }) => ({ documentNumber, data }),

    async onMutate({ documentNumber, data }) {
      await queryClient.cancelQueries({ queryKey: CLIENTS_QUERY_KEY })

      const previous = queryClient.getQueryData<ClientResponse[]>(CLIENTS_QUERY_KEY)

      // 🟡 Actualización optimista en cache
      queryClient.setQueryData<ClientResponse[]>(CLIENTS_QUERY_KEY, (old) =>
        (old ?? []).map((client) => {
          if (client.documentNumber !== documentNumber) return client

          return {
            ...client,
            firstName: data.firstName ?? client.firstName,
            lastName: data.lastName ?? client.lastName,
            // estos campos no estaban en ClientResponse,
            // pero si tu backend los devuelve luego, aquí los respetarías
            address: (data as any).address ?? (client as any).address,
            department: (data as any).department ?? (client as any).department,
            province: (data as any).province ?? (client as any).province,
            district: (data as any).district ?? (client as any).district,
            email: data.email ?? client.email,
            phoneNumber: data.phone ?? client.phoneNumber,
          }
        }),
      )

      return { previous }
    },

    onError(_err, _vars, context) {
      if (context?.previous) {
        queryClient.setQueryData(CLIENTS_QUERY_KEY, context.previous)
      }
      toast.error("No se pudo actualizar el cliente (modo maqueta)")
    },

    onSuccess() {
      toast.success("Cliente actualizado (solo en frontend)")
      useModalStore.getState().closeModal(Modals.EDIT_CLIENT)
    },
  })
}
