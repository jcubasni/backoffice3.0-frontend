export const getCompanies = async (): Promise<any[]> => {
  const response = await fetch("/json/support/companies.json")
  const data = await response.json()
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 1000)
  })
}
