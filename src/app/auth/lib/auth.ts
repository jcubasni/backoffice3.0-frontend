import { redirect } from "@tanstack/react-router"

export async function isAuth() {
  const store = localStorage.getItem("token")
  const token = store ? JSON.parse(store).state.token : null
  if (!token) {
    throw redirect({ to: "/", replace: true })
  }
}
