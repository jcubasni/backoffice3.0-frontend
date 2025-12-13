import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useModalStore } from "@/shared/store/modal.store"

import {
  addClient,
  createAccount,
  getAccountByClientId,
  getAccountByDocumentNumber,
  getAccountTypes,
  getClientById,
  getClients,
  getProductsByAccount,
  searchClientBySaleDocument,
  updateAccount,
  updateClient,
  updateProductsByClient,
} from "../services/clients.service"

import {
  AccountCreateDTO,
  AccountTypeResponse,
  AccountUpdateDTO,
  ClientDTO,
  ClientResponse,
  ClientUpdateDTO,
  SearchClientParams,
  UpdateProductsParams,
} from "../types/client.type"
import { Modals } from "../types/modals-name"

const CLIENTS_QUERY_KEY = ["clients"] as const
const ACCOUNT_TYPES_QUERY_KEY = ["account-types"] as const

/* -------------------------------------------
 * 🟢 LISTAR CLIENTES
 * ---------------------------------------- */
export function useGetClients() {
  return useQuery<ClientResponse[]>({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: getClients,
  })
}

/* -------------------------------------------
 * 🟢 LISTAR TIPOS DE CUENTA (GET /accounts/types)
 * ---------------------------------------- */
export function useGetAccountTypes() {
  return useQuery<AccountTypeResponse[]>({
    queryKey: ACCOUNT_TYPES_QUERY_KEY,
    queryFn: getAccountTypes,
  })
}

/* -------------------------------------------
 * 🟢 OBTENER CLIENTE POR ID (para Mis Datos)
 * ---------------------------------------- */
export function useGetClientById(clientId?: string) {
  return useQuery<ClientResponse>({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId!),
    enabled: !!clientId,
  })
}

/* -------------------------------------------
 * 🟢 CREAR CLIENTE
 * ---------------------------------------- */
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

/* -------------------------------------------
 * 🟢 BUSCAR CLIENTE PARA VENTA
 * ---------------------------------------- */
export function useSearchClientBySaleDocument(params: SearchClientParams) {
  return useQuery({
    queryKey: ["search-client", "by-sale-document", params],
    queryFn: () => searchClientBySaleDocument(params),
    enabled: params.saleDocumentTypeId !== undefined && !!params.paymentTypeId,
  })
}

/* -------------------------------------------
 * 🟢 PRODUCTOS POR CUENTA
 * ---------------------------------------- */
export function useGetProductsByAccount(accountId?: string) {
  return useQuery({
    queryKey: ["products", "by-client", accountId],
    queryFn: () => getProductsByAccount(accountId!),
    enabled: !!accountId,
  })
}

/* -------------------------------------------
 * 🟢 ACTUALIZAR PRODUCTOS DE UNA CUENTA
 * ---------------------------------------- */
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

/* -------------------------------------------
 * 🟢 CUENTAS POR CLIENTE
 * ---------------------------------------- */
export function useGetAccountByClientId(clientId?: string) {
  return useQuery({
    queryKey: ["accounts", "by-client", clientId],
    queryFn: () => getAccountByClientId(clientId!),
    enabled: !!clientId,
  })
}

/* -------------------------------------------
 * 🟢 CREAR CUENTA PARA UN CLIENTE
 * ---------------------------------------- */
export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-account"],
    mutationFn: (body: AccountCreateDTO) => createAccount(body),
    onSuccess(_data, variables) {
      const clientId = variables.clientId
      toast.success("Cuenta creada correctamente")

      if (clientId) {
        queryClient.invalidateQueries({
          queryKey: ["accounts", "by-client", clientId],
        })
      }
    },
    onError() {
      toast.error("No se pudo crear la cuenta")
    },
  })
}

/* -------------------------------------------
 * 🟢 EDITAR CUENTA (PATCH /accounts/:id)
 * ---------------------------------------- */
export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-account"],
    mutationFn: ({
      accountId,
      clientId,
      data,
    }: {
      accountId: string
      clientId: string
      data: AccountUpdateDTO
    }) => updateAccount(accountId, data),

    onSuccess(_data, variables) {
      const { clientId } = variables
      toast.success("Cuenta actualizada correctamente")

      if (clientId) {
        queryClient.invalidateQueries({
          queryKey: ["accounts", "by-client", clientId],
        })
      }
    },

    onError() {
      toast.error("No se pudo actualizar la cuenta")
    },
  })
}

/* -------------------------------------------
 * 🟢 CUENTA POR DOCUMENTO
 * ---------------------------------------- */
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

/* -------------------------------------------
 * 🟢 EDITAR CLIENTE (PATCH /clients/:id)
 *    + actualización optimista de la tabla
 * ---------------------------------------- */
export function useEditClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["edit-client"],
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string
      data: ClientUpdateDTO
    }) => updateClient(clientId, data),

    async onMutate(variables) {
      const { clientId, data } = variables

      await queryClient.cancelQueries({ queryKey: CLIENTS_QUERY_KEY })

      const previousClients =
        queryClient.getQueryData<ClientResponse[]>(CLIENTS_QUERY_KEY)

      queryClient.setQueryData<ClientResponse[]>(CLIENTS_QUERY_KEY, (old) => {
        if (!old) return old

        return old.map((client) => {
          if (client.id !== clientId) return client

          const updatedClient: ClientResponse = {
            ...client,
            firstName: data.firstName ?? client.firstName,
            lastName: data.lastName ?? client.lastName,
            email: data.email ?? client.email,
            phoneNumber: data.phone ?? client.phoneNumber,
          }

          if (client.addresses && client.addresses.length > 0) {
            const primary =
              client.addresses.find((addr) => addr.isPrimary) ??
              client.addresses[0]

            const updatedPrimary = {
              ...primary,
              addressLine1: data.address ?? primary.addressLine1,
            }

            return {
              ...updatedClient,
              addresses: client.addresses.map((addr) =>
                addr.id === primary.id ? updatedPrimary : addr,
              ),
            }
          }

          return updatedClient
        })
      })

      return { previousClients }
    },

    onError(_error, _vars, context) {
      if (context?.previousClients) {
        queryClient.setQueryData(CLIENTS_QUERY_KEY, context.previousClients)
      }
      toast.error("No se pudo actualizar el cliente")
    },

    onSuccess(_data, variables) {
      const { clientId } = variables

      toast.success("Cliente actualizado correctamente")
      queryClient.invalidateQueries({ queryKey: ["client", clientId] })
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })

      useModalStore.getState().closeModal(Modals.EDIT_CLIENT)
    },
  })
}
