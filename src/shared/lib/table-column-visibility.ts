export function saveColumnVisibility(key: string, visibility: Record<string, boolean>) {
  localStorage.setItem(key, JSON.stringify(visibility))
}

export function loadColumnVisibility(key: string): Record<string, boolean> | undefined {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
  } catch {
    return undefined
  }
}
