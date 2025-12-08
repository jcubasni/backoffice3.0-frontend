import "@tanstack/react-router"

declare module "@tanstack/react-router" {
  interface HistoryState {
    accountId?: string
  }
  interface StaticDataRouteOption {
    headerTitle?: string
  }
}
