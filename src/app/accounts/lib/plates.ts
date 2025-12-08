export const generateCardNumber = (plate: string): string => {
  if (!plate) return ""

  // Remove hyphens and spaces to get clean plate (ABC-123 -> ABC123)
  const cleanPlate = plate.replace(/[-\s]/g, "")

  // Generate additional numbers based on plate characters
  const hash = cleanPlate
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Generate a 7-digit number based on hash and timestamp
  const additionalNumbers = String(hash * 13 + Date.now() % 10000000).slice(-7)

  // Format: cleanPlate + additionalNumbers (e.g., ABC123 + 8543098 = ABC1238543098)
  return cleanPlate + additionalNumbers
}
