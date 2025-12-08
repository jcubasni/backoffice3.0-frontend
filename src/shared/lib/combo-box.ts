export function dataToCombo<T>(
  data: T[] | undefined,
  valueField: keyof T,
  labelField: keyof T,
) {
  if (!data) return []
  return data.map((item) => ({
    label: String(item[labelField]),
    value: String(item[valueField]),
  }))
}

export function dataToComboAdvanced<T>(
  data: T[] | undefined,
  valueSelector: (item: T) => any,
  labelSelector: (item: T) => any,
) {
  if (!data) return []
  return data.map((item) => ({
    label: String(labelSelector(item)),
    value: String(valueSelector(item)),
  }))
}
