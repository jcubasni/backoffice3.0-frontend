export const generatepagination = (init: number) => {
  const pagination: number[] = []
  Array.from({ length: 4 }).forEach((_, i) => {
    pagination.push(init + i * 5)
  })
  return pagination
}
