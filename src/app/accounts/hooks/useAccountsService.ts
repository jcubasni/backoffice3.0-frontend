// src/app/accounts/hooks/useAccountsService.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type {
  AccountCreateDTO,
  AccountResponse,
  AccountTypeResponse,
  AccountUpdateDTO,
} from "../types/client.type"

import type { CreateAccountsOnlyDTO } from "../services/clients.service"

import {
  assignAccountBalance,
  createAccount,
  createAccountsOnly,
  getAccountByClientId,
  getAccountByDocumentNumber,
  getAccountTypes,
  updateAccount,
} from "../services/accounts.service"

import { assignPlateBalance } from "../services/plates.service"
import type { AssignPlateBalanceDTO } from "../types/plate.type"

const ACCOUNT_TYPES_QUERY_KEY = ["account-types"] as const

export function useGetAccountTypes() {
  return useQuery<AccountTypeResponse[]>({
    queryKey: ACCOUNT_TYPES_QUERY_KEY,
    queryFn: getAccountTypes,
  })
}

export function useGetAccountByClientId(clientId?: string) {
  return useQuery<AccountResponse[]>({
    queryKey: ["accounts", "by-client", clientId],
    queryFn: () => getAccountByClientId(clientId!),
    enabled: !!clientId,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-account"],
    mutationFn: (body: AccountCreateDTO) => createAccount(body),

    onSuccess: (_data, variables) => {
      toast.success("Cuenta creada correctamente")

      const clientId = variables.clientId
      if (clientId) {
        queryClient.invalidateQueries({
          queryKey: ["accounts", "by-client", clientId],
        })
      }
    },

    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo crear la cuenta")
    },
  })
}

export function useCreateAccountOnly() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-account-only"],
    mutationFn: (body: CreateAccountsOnlyDTO) => createAccountsOnly(body),

    onSuccess: (_data, variables) => {
      // 👇 OJO: aquí NO toast porque tu componente ya lo maneja con id
      const clientId = variables.clientId
      if (clientId) {
        queryClient.invalidateQueries({
          queryKey: ["accounts", "by-client", clientId],
        })
      }
    },

    onError: () => {
      // 👇 NO toast, lo maneja el componente con prettyBackendMessage
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-account"],
    mutationFn: (vars: {
      accountId: string
      clientId: string
      data: AccountUpdateDTO
    }) => updateAccount(vars.accountId, vars.data),

    onSuccess: (_data, variables) => {
      toast.success("Cuenta actualizada correctamente")
      queryClient.invalidateQueries({
        queryKey: ["accounts", "by-client", variables.clientId],
      })
    },

    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo actualizar la cuenta")
    },
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
 * ✅ Asignar saldo incremental a una CUENTA
 * Endpoint típico: POST /accounts/:accountId/assign-balance  { amount, note? }
 */
export function useAssignAccountBalance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["assign-account-balance"],
    mutationFn: (vars: {
      accountId: string
      clientId: string
      body: { amount: number; note?: string }
    }) => assignAccountBalance(vars.accountId, vars.body),

    onSuccess: (_data, vars) => {
      toast.success("Saldo asignado correctamente")
      queryClient.invalidateQueries({
        queryKey: ["accounts", "by-client", vars.clientId],
      })
    },

    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo asignar el saldo")
    },
  })
}

/**
 * ✅ Asignar saldo incremental a una TARJETA/PLACA
 * Endpoint típico: POST /accounts/cards/:accountCardId/assign-balance { amount, note? }
 *
 * Importante:
 * - NO cerramos modal aquí (eso lo hace el componente modal con onSuccess)
 * - Invalidamos plates para que refresque la tabla/listado
 */
export function useAssignPlateBalance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["assign-plate-balance"],
    mutationFn: ({ accountCardId, body }: AssignPlateBalanceDTO) =>
      assignPlateBalance(accountCardId, body),

    onSuccess: () => {
      toast.success("Saldo agregado correctamente")
      queryClient.invalidateQueries({
        queryKey: ["plates"],
        exact: false,
      })
    },

    onError: (err: any) => {
      toast.error(err?.message ?? "No se pudo agregar el saldo")
    },
  })
}
