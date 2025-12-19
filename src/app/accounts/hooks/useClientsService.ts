// src/app/accounts/hooks/useClientsService.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useModalStore } from "@/shared/store/modal.store"
import { ErrorResponse } from "@/shared/errors/error-response"

import {
  // ✅ CLIENTS
  createClient,
  getClientById,
  getClients,
  searchClientBySaleDocument,
  updateClient,

  // ✅ ACCOUNTS
  createAccount,
  createAccountsOnly,
  getAccountByClientId,
  getAccountByDocumentNumber,
  getAccountTypes,
  updateAccount,

  // ✅ PRODUCTS BY ACCOUNT
  getProductsByAccount,
  updateProductsByClient,
} from "../services/clients.service"

import type {
  AccountCreateDTO,
  AccountResponse,
  AccountTypeResponse,
  AccountUpdateDTO,
  ClientResponse,
  ClientSearch,
  ClientUpdateDTO,
  SearchClientParams,
  UpdateProductsParams,
} from "../types/client.type"

import type { CreateAccountsOnlyDTO, CreateClientBody } from "../services/clients.service"
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
 * 🟢 OBTENER CLIENTE POR ID (GET /clients/:id)
 * ---------------------------------------- */
export function useGetClientById(clientId?: string) {
  return useQuery<ClientResponse>({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId!),
    enabled: !!clientId,
  })
}

/* -------------------------------------------
 * 🟢 CREAR CLIENTE (POST /clients)
 * ✅ Devuelve { clientId } resolviendo id desde GET /clients
 * ---------------------------------------- */
type AddClientVars = {
  body: CreateClientBody
  documentTypeId: number
  documentNumber: string
}

type AddClientResult = {
  clientId: string
}

export function useAddClient() {
  const queryClient = useQueryClient()

  return useMutation<AddClientResult, unknown, AddClientVars>({
    mutationKey: ["create-client"],

    mutationFn: async ({ body, documentTypeId, documentNumber }) => {
      // 1) Crear cliente
      await createClient(body)

      // 2) Traer lista fresca (así no dependemos de invalidate timing)
      const clients = await queryClient.fetchQuery({
        queryKey: CLIENTS_QUERY_KEY,
        queryFn: getClients,
      })

      // 3) Resolver id por docType + docNumber
      const found = clients.find(
        (c) => c.documentNumber === documentNumber && c.documentType?.id === documentTypeId,
      )

      if (!found?.id) {
        throw new Error(
          "Se creó el cliente pero no se pudo resolver el ID. (El POST no devuelve id y no se encontró en GET /clients).",
        )
      }

      return { clientId: found.id }
    },

    onSuccess: () => {
      toast.success("Cliente guardado")
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })
      // ❗ NO cerrar modal aquí
    },

    onError: (err: any) => {
      // Si viene de fetchData -> ErrorResponse(message,status)
      const msg =
        err instanceof ErrorResponse
          ? err.message
          : err?.message ?? "No se pudo registrar el cliente"

      toast.error(msg)
    },
  })
}

/* -------------------------------------------
 * 🟢 BUSCAR CLIENTE PARA VENTA
 * ---------------------------------------- */
export function useSearchClientBySaleDocument(params: SearchClientParams) {
  return useQuery<ClientSearch[]>({
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
    queryKey: ["account-products", accountId],
    queryFn: () => getProductsByAccount(accountId!, 1),
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
  return useQuery<AccountResponse[]>({
    queryKey: ["accounts", "by-client", clientId],
    queryFn: () => getAccountByClientId(clientId!),
    enabled: !!clientId,
  })
}

/* -------------------------------------------
 * 🟢 CREAR CUENTA PARA UN CLIENTE (POST /accounts)
 * ---------------------------------------- */
export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-account"],
    mutationFn: (body: AccountCreateDTO) => createAccount(body),
    onSuccess(_data, variables) {
      toast.success("Cuenta creada correctamente")

      const clientId = variables.clientId
      if (clientId) {
        queryClient.invalidateQueries({ queryKey: ["accounts", "by-client", clientId] })
      }
    },
    onError() {
      toast.error("No se pudo crear la cuenta")
    },
  })
}

/* -------------------------------------------
 * 🟢 CREAR CUENTAS "ONLY" (POST /accounts/only)
 * ---------------------------------------- */
export function useCreateAccountOnly() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-account-only"],
    mutationFn: (body: CreateAccountsOnlyDTO) => createAccountsOnly(body),

    onSuccess(_data, variables) {
      toast.success("Cuentas creadas correctamente")

      const clientId = variables.clientId
      if (clientId) {
        queryClient.invalidateQueries({ queryKey: ["accounts", "by-client", clientId] })
      }
    },

    // ✅ NO toast aquí (se maneja en el componente)
    onError() {},
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
      toast.success("Cuenta actualizada correctamente")

      const clientId = variables.clientId
      queryClient.invalidateQueries({ queryKey: ["accounts", "by-client", clientId] })
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

      const previousClients = queryClient.getQueryData<ClientResponse[]>(CLIENTS_QUERY_KEY)

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
            const primary = client.addresses.find((a) => a.isPrimary) ?? client.addresses[0]

           const updatedPrimary = {
            ...primary,
            addressLine1: data.address?.addressLine1 ?? primary.addressLine1,
            district: data.address?.districtId
              ? {
                  ...(primary.district ?? {}),
                  id: data.address.districtId,
                  name: (primary.district as any)?.name ?? "",
                }
              : primary.district,
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
