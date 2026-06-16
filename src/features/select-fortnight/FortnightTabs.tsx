import { usePlanner } from '../../app/providers/usePlanner'

const labels = {
  First: 'Primera quincena',
  Second: 'Segunda quincena',
} as const

export function FortnightTabs() {
  const { selectedFortnightType, selectFortnight, selectedMonth } = usePlanner()

  if (!selectedMonth) {
    return null
  }

  return (
    <div className="planner-tabs" role="tablist" aria-label="Quincenas del mes">
      {selectedMonth.fortnights.map((fortnight) => {
        const isActive = selectedFortnightType === fortnight.type

        return (
          <button
            key={fortnight.id}
            type="button"
            className={`planner-tab${isActive ? ' is-active' : ''}`}
            onClick={() => selectFortnight(fortnight.type)}
          >
            <span>{labels[fortnight.type]}</span>
            <small>
              {fortnight.startDate} al {fortnight.endDate}
            </small>
          </button>
        )
      })}
    </div>
  )
}
