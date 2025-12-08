export const formatCurrency = (
  number: number | string,
  moneda: "PEN" | "USD" = "PEN",
  decimals: number = 2,
): string => {
  const num = Number(number) ?? 0
  const isNegative = num < 0
  const absNum = Math.abs(num)

  // If the number is an integer or has no significant decimals beyond 2 places, use 2 decimals
  const hasSignificantDecimals = absNum % 1 !== 0 && absNum % 0.01 !== 0
  const finalDecimals = hasSignificantDecimals ? decimals : 2

  const locale = moneda === "PEN" ? "es-PE" : "en-US"
  let format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: finalDecimals,
    maximumFractionDigits: finalDecimals,
    currencyDisplay: "symbol",
  }).format(absNum)

  if (moneda === "USD") {
    format = format.replace("$", "$")
    return isNegative ? `-${format}` : format
  }

  // For PEN, move the negative sign after the currency symbol
  format = format.replace("S/", "S/")
  return isNegative ? format.replace("S/", "S/-") : format
}

export const formatNumber = (number: number | string): number => {
  const format = new Intl.NumberFormat("es-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return Number(format.format(Number(number) ?? 0))
}
