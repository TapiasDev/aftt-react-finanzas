import { usePlanner } from '../../app/providers/usePlanner'

export function MonthSelect() {
  const { months, selectedMonth, selectMonth, isLoading } = usePlanner()

  return (
    <label className="planner-field">
      <span className="planner-label">Mes</span>
      <select
        className="planner-select"
        value={selectedMonth?.monthNumber ?? ''}
        onChange={(event) => void selectMonth(Number(event.target.value))}
        disabled={isLoading || months.length === 0}
      >
        {months.map((month) => (
          <option key={month.id} value={month.monthNumber}>
            {month.monthName}
          </option>
        ))}
      </select>
    </label>
  )
}
