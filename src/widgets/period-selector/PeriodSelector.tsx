import { usePlanner } from '../../app/providers/usePlanner'
import { FortnightTabs } from '../../features/select-fortnight/FortnightTabs'
import { MonthSelect } from '../../features/select-month/MonthSelect'
import { YearSelect } from '../../features/select-year/YearSelect'

export function PeriodSelector() {
  const { selectedMonth } = usePlanner()

  return (
    <section className="planner-panel planner-selector-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Período</p>
          <h2>Selecciona el contexto de trabajo</h2>
        </div>
        {selectedMonth ? (
          <span className={`planner-badge${selectedMonth.status === 'Closed' ? ' is-closed' : ''}`}>
            {selectedMonth.status === 'Closed' ? 'Readonly' : 'Editable'}
          </span>
        ) : null}
      </div>

      <div className="planner-selector-grid">
        <YearSelect />
        <MonthSelect />
      </div>

      <FortnightTabs />
    </section>
  )
}
