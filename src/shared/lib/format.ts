export function formatMoney(value: number) {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}
