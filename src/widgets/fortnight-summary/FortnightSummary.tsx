import { usePlanner } from '../../app/providers/usePlanner'
import { formatMoney } from '../../shared/lib/format'

const summaryLabels = [
  ['Ingreso quincenal', 'totalIncome'],
  ['Total a pagar', 'totalToPay'],
  ['Total pagado', 'totalPaid'],
  ['Restante por pagar', 'totalRemainingToPay'],
  ['Si pago todo me queda', 'remainingIfEverythingIsPaid'],
  ['Disponible actual', 'currentAvailable'],
] as const

export function FortnightSummary() {
  const { financialSummary, selectedFortnightExpenses, selectedFortnight } = usePlanner()

  if (!selectedFortnight) {
    return null
  }

  return (
    <section className="planner-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Resumen financiero</p>
          <h2>{selectedFortnightExpenses.length} gastos en la quincena actual</h2>
        </div>
      </div>

      <div className="planner-summary-grid">
        {summaryLabels.map(([label, key]) => (
          <article key={key} className="planner-stat-card">
            <p>{label}</p>
            <strong>{formatMoney(financialSummary[key])}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
