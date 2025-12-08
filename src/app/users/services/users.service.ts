import { fetchData } from "@/shared/lib/fetch-data"
import { AddUserDTO, User } from "../types/users.type"

export const getUsers = async (): Promise<User[]> => {
  const response = await fetchData<User[]>({
    url: "/users",
  })
  return response
}

export const getUser = async (id: string): Promise<User> => {
  const response = await fetchData<User>({
    url: `/users/${id}`,
  })
  return response
}

export const addUser = async (body: AddUserDTO): Promise<User> => {
  const response = await fetchData<User>({
    url: "/users",
    method: "POST",
    body,
  })
  return response
}

export const deleteUser = async (id: string): Promise<void> => {
  await fetchData<void>({
    url: `/users/${id}`,
    method: "DELETE",
  })
}

export const editUser = async (
  id: string,
  body: Partial<AddUserDTO>,
): Promise<User> => {
  const response = await fetchData<User>({
    url: `/users/${id}`,
    method: "PATCH",
    body,
  })
  return response
}
