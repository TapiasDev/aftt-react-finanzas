import { usePlanner } from '../../app/providers/usePlanner'

export function YearSelect() {
  const { availableYears, selectedYear, selectYear, isLoading } = usePlanner()

  const previousYear = (selectedYear ?? availableYears[0] ?? new Date().getFullYear()) - 1
  const nextYear = (selectedYear ?? availableYears.at(-1) ?? new Date().getFullYear()) + 1

  return (
    <label className="planner-field">
      <span className="planner-label">Año</span>
      <div className="planner-year-picker">
        <button type="button" className="planner-ghost-button" onClick={() => void selectYear(previousYear)} disabled={isLoading}>
          {previousYear}
        </button>
        <select
          className="planner-select"
          value={selectedYear ?? ''}
          onChange={(event) => void selectYear(Number(event.target.value))}
          disabled={isLoading || availableYears.length === 0}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button type="button" className="planner-ghost-button" onClick={() => void selectYear(nextYear)} disabled={isLoading}>
          {nextYear}
        </button>
      </div>
    </label>
  )
}
