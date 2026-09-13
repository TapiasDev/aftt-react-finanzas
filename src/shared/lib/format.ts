export function formatMoney(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}

// Keep the editable value as a numeric string; separators belong only to the UI.
export function formatMoneyInput(value: string) {
  const [integer, fraction] = value.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return fraction === undefined ? grouped : `${grouped},${fraction}`
}

export function parseMoneyInput(value: string) {
  const [integer, ...fractions] = value.replace(/[^\d,]/g, '').split(',')
  return fractions.length === 0 ? integer : `${integer || '0'}.${fractions.join('').slice(0, 2)}`
}
