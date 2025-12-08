import { Auth, Login } from "@auth/types/login.type"
import { fetchData } from "@/shared/lib/fetch-data"

export const login = async (dto: Login): Promise<Auth> => {
  const response = await fetchData<Auth>({
    url: "/auth/login",
    method: "POST",
    body: dto,
  })
  return response
}
