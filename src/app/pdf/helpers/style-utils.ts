import type { Style } from "@react-pdf/types"

/**
 * Combina estilos sin errores de tipo.
 * Filtra valores nulos, undefined o falsos.
 */
export function cx(...styles: (Style | null | undefined | false)[]): Style[] {
  return styles.filter(Boolean) as Style[]
}
