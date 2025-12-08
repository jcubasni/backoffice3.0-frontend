import { login } from "@auth/services/auth.service"
import useAuthStore from "@auth/store/auth.store"
import { Login } from "@auth/types/login.type"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Routes } from "@/shared/lib/routes"
import useBranchStore from "@/shared/store/branch.store"
import useTokenStore from "@/shared/store/token.store"

export const useLogin = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (dto: Login) => login(dto),
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data)
      useBranchStore.getState().setBranch(data.locals)
      useTokenStore.getState().setToken(data.accessToken)
      // navigate({ to: Routes.ListCompanies, replace: true })
      navigate({ to: Routes.DailyReport, replace: true })
    },
  })
}

export const useLogout = () => {
  useAuthStore.getState().setUser(null)
  useBranchStore.getState().setBranch([])
  useTokenStore.getState().setToken(null)
  useAuthStore.persist.clearStorage?.()
  useTokenStore.persist.clearStorage?.()
  useBranchStore.persist.clearStorage?.()
  window.location.href = Routes.Home
}
