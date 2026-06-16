import type { CalendarCell, FortnightType } from '../types/planner'

const weekDayFormatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
const shortDateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
})

export function getMonthName(year: number, monthNumber: number) {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(year, monthNumber - 1, 1),
  )
}

export function getDaysInMonth(year: number, monthNumber: number) {
  return new Date(year, monthNumber, 0).getDate()
}

export function getFortnightTypeForDay(dayNumber: number): FortnightType {
  return dayNumber <= 15 ? 'First' : 'Second'
}

export function getCalendarCells(year: number, monthNumber: number): CalendarCell[] {
  const firstDay = new Date(year, monthNumber - 1, 1)
  const firstWeekDay = (firstDay.getDay() + 6) % 7
  const daysInMonth = getDaysInMonth(year, monthNumber)
  const cells: CalendarCell[] = []

  for (let index = 0; index < firstWeekDay; index += 1) {
    cells.push({
      date: `empty-${year}-${monthNumber}-${index}`,
      dayNumber: 0,
      isCurrentMonth: false,
      fortnightType: 'First',
    })
  }

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
    cells.push({
      date: toIsoDate(year, monthNumber, dayNumber),
      dayNumber,
      isCurrentMonth: true,
      fortnightType: getFortnightTypeForDay(dayNumber),
    })
  }

  return cells
}

export function getWeekdayLabels() {
  const baseMonday = new Date('2026-06-01T00:00:00Z')

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseMonday)
    date.setUTCDate(baseMonday.getUTCDate() + index)

    return capitalize(weekDayFormatter.format(date).replace('.', ''))
  })
}

export function toIsoDate(year: number, monthNumber: number, dayNumber: number) {
  return `${year}-${String(monthNumber).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
}

export function getDayNumberFromIso(date: string) {
  return Number(date.slice(-2))
}

export function getTodayIsoDate() {
  const now = new Date()
  return toIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

export function getDaysUntil(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  const [todayYear, todayMonth, todayDay] = getTodayIsoDate().split('-').map(Number)
  const targetUtc = Date.UTC(year, month - 1, day)
  const todayUtc = Date.UTC(todayYear, todayMonth - 1, todayDay)
  return Math.round((targetUtc - todayUtc) / (1000 * 60 * 60 * 24))
}

export function formatShortDateLabel(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return capitalize(shortDateFormatter.format(new Date(year, month - 1, day)).replace('.', ''))
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
