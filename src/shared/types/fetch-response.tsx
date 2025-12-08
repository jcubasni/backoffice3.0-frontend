export interface FetchResponse<T = null> {
  success: boolean
  data: T
  message: string
}
