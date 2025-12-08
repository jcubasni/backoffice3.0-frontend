import { fetchData } from "@/shared/lib/fetch-data"
import {
  AddGroupSerieDTO,
  EditGroupSerieDTO,
} from "../schemas/group-serie.schema"
import { GroupSerieResponse, GroupSerieType } from "../types/group-serie.type"

export const getGroupSeries = async (
  localId: string,
): Promise<GroupSerieResponse[]> => {
  return await fetchData<GroupSerieResponse[]>({
    url: "/group-series",
    headers: {
      "x-local-id": localId,
    },
  })
}

export const getGroupSerieTypes = async (): Promise<GroupSerieType[]> => {
  return await fetchData<GroupSerieType[]>({
    url: "/group-series/types",
  })
}

export const addGroupSerie = async (body: AddGroupSerieDTO): Promise<void> => {
  return await fetchData({
    method: "POST",
    url: "/group-series",
    body,
    headers: {
      "x-local-id": body.localId,
    },
  })
}

export const updateGroupSerie = async (
  id: string,
  body: EditGroupSerieDTO,
): Promise<void> => {
  return await fetchData({
    method: "PUT",
    url: `/group-series/${id}`,
    body,
    headers: {
      "x-local-id": body.localId,
    },
  })
}

export const getAvailableGroupSeries = async (
  idDocument: number,
  idLocal: string,
): Promise<GroupSerieResponse[]> => {
  return await fetchData<GroupSerieResponse[]>({
    url: `/group-series/available-for-document/${idDocument}`,
    headers: {
      "x-local-id": idLocal,
    },
  })
}

export const deleteGroupSerie = async (
  localId: string,
  groupId: string,
): Promise<void> => {
  return await fetchData({
    method: "DELETE",
    url: `/group-series/${groupId}`,
    headers: {
      "x-local-id": localId,
    },
  })
}

