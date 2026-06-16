import { useMemo } from 'react'
import { usePlanner } from '../../app/providers/usePlanner'
import { getCalendarCells, getDayNumberFromIso, getWeekdayLabels } from '../../shared/lib/date'
import { formatMoney } from '../../shared/lib/format'

const weekdayLabels = getWeekdayLabels()

export function MonthlyCalendar() {
  const { selectedMonth, selectedFortnightType } = usePlanner()

  const calendarCells = useMemo(() => {
    if (!selectedMonth) {
      return []
    }

    return getCalendarCells(selectedMonth.year, selectedMonth.monthNumber)
  }, [selectedMonth])

  if (!selectedMonth) {
    return null
  }

  return (
    <section className="planner-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Calendario</p>
          <h2>
            {selectedMonth.monthName} {selectedMonth.year}
          </h2>
        </div>
        <p className="planner-calendar-caption">
          {calendarCells.filter((cell) => cell.isCurrentMonth).length} dias reales del mes
        </p>
      </div>

      <div className="planner-weekdays">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="planner-calendar-grid">
        {calendarCells.map((cell) => {
          if (!cell.isCurrentMonth) {
            return <div key={cell.date} className="planner-calendar-day is-empty" aria-hidden="true" />
          }

          const expenses = selectedMonth.expenses.filter(
            (expense) => getDayNumberFromIso(expense.estimatedPaymentDate) === cell.dayNumber,
          )

          const isSelectedFortnight = selectedFortnightType === cell.fortnightType

          return (
            <article
              key={cell.date}
              className={`planner-calendar-day${cell.fortnightType === 'Second' ? ' is-second' : ''}${isSelectedFortnight ? ' is-selected' : ''}`}
            >
              <header>
                <strong>{cell.dayNumber}</strong>
                <span>{cell.fortnightType === 'First' ? 'Q1' : 'Q2'}</span>
              </header>

              <div className="planner-calendar-expenses">
                {expenses.length === 0 ? <p className="planner-empty-copy">Sin gastos</p> : null}

                {expenses.map((expense) => (
                  <div key={expense.id} className={`planner-expense-chip is-${expense.status.toLowerCase()}`}>
                    <span>{expense.name}</span>
                    <strong>{formatMoney(expense.amount)}</strong>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
