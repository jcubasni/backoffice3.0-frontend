import { fetchData } from "@/shared/lib/fetch-data"
import { AddBranchDTO, Branch } from "../types/branches.type"

export const getBranches = async (): Promise<Branch[]> => {
  return await fetchData<Branch[]>({
    url: "/sedes",
  })
}

export const postBranch = async (body: AddBranchDTO): Promise<Branch> => {
  return await fetchData<Branch>({
    url: "/sedes",
    method: "POST",
    body,
  })
}

export const editBranch = async (
  id: string,
  body: Partial<AddBranchDTO>,
): Promise<Branch> => {
  return await fetchData<Branch>({
    url: `/sedes/${id}`,
    method: "PATCH",
    body,
  })
}

export const deleteBranch = async (id: string): Promise<void> => {
  await fetchData<void>({
    url: `/sedes/${id}`,
    method: "DELETE",
  })
}
