export type Filter<T> = {
  id: string
  title: string
  filterFn: (reports: T[]) => T[]
}
