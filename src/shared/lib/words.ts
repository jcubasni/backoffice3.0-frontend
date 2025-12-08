export const toCapitalize = (str: string | undefined): string => {
  if (!str) return ""
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (!word) return ""
      if (/[.-/]/.test(word)) {
        return word.toUpperCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}
