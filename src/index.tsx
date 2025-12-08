import { createRoot } from "react-dom/client"
import "./styles/globals.css"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootEl = document.getElementById("root")
if (rootEl) {
  const root = createRoot(rootEl)
  root.render(<RouterProvider router={router} />)
}
