import { fetchData } from "@/shared/lib/fetch-data"
import { AddSeriesDTO, EditSeriesDTO, SeriesResponse } from "../types/series.type"

export const getSeries = async (): Promise<SeriesResponse[]> => {
  return await fetchData<SeriesResponse[]>({
    url: "/series",
  })
}

export const getSeriesByUser = async (
  userId: string,
  idDocument?: number,
): Promise<SeriesResponse[]> => {
  return await fetchData<SeriesResponse[]>({
    url: `/series/by-user/${userId}`,
    params: {
      idDocument,
    },
  })
}

export const addSeries = async (body: AddSeriesDTO): Promise<SeriesResponse> => {
  return await fetchData<SeriesResponse>({
    url: "/series",
    method: "POST",
    body: {
      ...body,
      correlativeCurrent: body.correlativeStart,
    },
    headers: {
      "x-local-id": String(body.idLocal),
    },
  })
}

export const editSeries = async (
  id: string,
  body: EditSeriesDTO,
): Promise<SeriesResponse> => {
  return await fetchData<SeriesResponse>({
    url: `/series/${id}`,
    method: "PATCH",
    body: {
      ...body,
      correlativeCurrent: body.correlativeStart,
    },
    headers: {
      "x-local-id": String(body.idLocal),
    },
  })
}

export const getSeriesWithoutGroup = async (
  localIds: string[],
): Promise<SeriesResponse[]> => {
  return await fetchData<SeriesResponse[]>({
    url: "/series/without-group",
    params: { localIds },
  })
}

export const deleteSeries = async (id: string): Promise<void> => {
  await fetchData<void>({
    url: `/series/${id}`,
    method: "DELETE",
  })
}
