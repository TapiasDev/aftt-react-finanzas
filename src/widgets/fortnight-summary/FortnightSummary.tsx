import { usePlanner } from '../../app/providers/usePlanner'
import { getDaysUntil } from '../../shared/lib/date'
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

  const pendingExpenses = selectedFortnightExpenses.filter((expense) => expense.status === 'Pending')
  const nextDueExpense = pendingExpenses
    .filter((expense) => getDaysUntil(expense.estimatedPaymentDate) >= 0)
    .sort((left, right) => left.estimatedPaymentDate.localeCompare(right.estimatedPaymentDate))[0] ?? null
  const paidProgress = financialSummary.totalToPay > 0
    ? Math.round((financialSummary.totalPaid / financialSummary.totalToPay) * 100)
    : 0
  const statusTone = getFortnightStatusTone(financialSummary, pendingExpenses.length)

  return (
    <section className={`planner-panel planner-panel-status planner-panel-status-${statusTone}`}>
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Resumen financiero</p>
          <h2>{selectedFortnightExpenses.length} gastos en la quincena actual</h2>
        </div>
        <span className={`planner-summary-badge planner-summary-badge-${statusTone}`}>
          {getFortnightStatusLabel(statusTone)}
        </span>
      </div>

      <div className="planner-progress-card">
        <div>
          <p>Progreso pagado</p>
          <strong>{paidProgress}%</strong>
        </div>
        <div>
          <p>Pendientes</p>
          <strong>{pendingExpenses.length}</strong>
        </div>
        <div>
          <p>Próximo vencimiento</p>
          <strong>{nextDueExpense ? nextDueExpense.estimatedPaymentDate : 'Sin pendientes'}</strong>
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

function getFortnightStatusTone(
  financialSummary: {
    totalToPay: number
    totalPaid: number
    totalRemainingToPay: number
  },
  pendingCount: number,
) {
  if (financialSummary.totalToPay === 0) {
    return 'neutral'
  }

  if (financialSummary.totalRemainingToPay === 0 && financialSummary.totalPaid > 0) {
    return 'success'
  }

  if (pendingCount > 0 && financialSummary.totalPaid > 0) {
    return 'warning'
  }

  return 'danger'
}

function getFortnightStatusLabel(statusTone: 'neutral' | 'success' | 'warning' | 'danger') {
  if (statusTone === 'success') {
    return 'Todo pagado'
  }

  if (statusTone === 'warning') {
    return 'Pago parcial'
  }

  if (statusTone === 'danger') {
    return 'Pendientes activos'
  }

  return 'Sin gastos'
}
