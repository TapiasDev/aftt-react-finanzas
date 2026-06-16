import { usePlanner } from '../../app/providers/usePlanner'

export function YearSelect() {
  const { availableYears, selectedYear, selectYear, isLoading } = usePlanner()

  return (
    <label className="planner-field">
      <span className="planner-label">Año</span>
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
    </label>
  )
}
