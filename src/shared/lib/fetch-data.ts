import useAuthStore from "@/app/auth/store/auth.store"
import { ErrorResponse } from "../errors/error-response"
import useBranchStore from "../store/branch.store"
import useTokenStore from "../store/token.store"
import { FetchResponse } from "../types/fetch-response"
import { Routes } from "./routes"

type TypeFetch = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
interface FetchProps {
  prefix?: string
  url: string
  method?: TypeFetch
  body?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string> // Nuevo campo opcional para headers personalizados
}

export async function fetchData<T>(params: FetchProps): Promise<T> {
  const url = objectToQueryString(params.url, params.params)
  const token = useTokenStore.getState().token ?? ""
  const prefix = params.prefix ?? import.meta.env.PUBLIC_API_URL
  const localId = useBranchStore.getState().selectedBranch?.localId

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...params.headers, // Combina los headers personalizados con los por defecto
  }

  // Solo añade x-local-id si localId está definido y no fue pasado en los headers personalizados
  if (localId && !params.headers?.["x-local-id"]) {
    headers["x-local-id"] = localId
  }

  const response = await fetch(`${prefix}${url}`, {
    method: params.method ?? "GET",
    headers,
    credentials: "include",
    body: params.body ? JSON.stringify(params.body) : undefined,
  })

  if (response.status === 401 || response.status === 403) {
    useAuthStore.getState().setUser(null)
    useTokenStore.getState().setToken(null)
    window.location.replace(Routes.Home)
    return Promise.reject("Unauthorized")
  }

  const data: FetchResponse<T> = await response.json()
  if (!data.success) {
    throw new ErrorResponse(data.message, response.status)
  }

  return data.data
}

function objectToQueryString(url: string, params?: Record<string, unknown>) {
  if (!params) return url

  const filteredParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          (item) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
        )
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    })

  const queryString =
    filteredParams.length > 0 ? `?${filteredParams.join("&")}` : ""

  return `${url}${queryString}`
}
