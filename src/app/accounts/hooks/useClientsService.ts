import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addClient,
  editClient,
  getAccountByClientId,
  getAccountByDocumentNumber,
  getClients,
  getProductsByAccount,
  searchClientBySaleDocument,
  updateProductsByClient,
} from "../services/clients.service"
import {
  ClientDTO,
  SearchClientParams,
  UpdateProductsParams,
} from "../types/client.type"
import { Modals } from "../types/modals-name"
import { EditClientSchema } from "../schemas/edit-client.schema"

export function useGetClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  })
}

export function useAddClient() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-client"],
    mutationFn: (params: ClientDTO) => addClient(params),
    onSuccess: () => {
      toast.success("Se agregaron el cliente")
      query.invalidateQueries({ queryKey: ["clients"] })
      useModalStore.getState().closeModal(Modals.ADD_CLIENT)
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
export function useEditClient() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["edit-client"],
    mutationFn: ({ clientId, data }: { clientId: string; data: EditClientSchema }) =>
      editClient(clientId, data),
    onSuccess: () => {
      toast.success("Cliente actualizado correctamente")
      query.invalidateQueries({ queryKey: ["clients"] })
      useModalStore.getState().closeModal(Modals.EDIT_CLIENT)
    },
  })
}