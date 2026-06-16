import { useEffect, useState, type FormEvent } from 'react'
import { usePlanner } from '../../app/providers/usePlanner'
import { formatMoney } from '../../shared/lib/format'

export function FortnightIncomeCard() {
  const { selectedFortnight, selectedMonth, saveFortnightIncome, isSavingIncome } = usePlanner()
  const [draft, setDraft] = useState({
    fortnightId: selectedFortnight?.id ?? 'empty',
    amount: String(selectedFortnight?.incomeAmount ?? 0),
  })
  const [message, setMessage] = useState<string | null>(null)

  const selectedFortnightId = selectedFortnight?.id ?? 'empty'
  const selectedFortnightIncome = selectedFortnight?.incomeAmount ?? 0

  useEffect(() => {
    setDraft({
      fortnightId: selectedFortnightId,
      amount: String(selectedFortnightIncome),
    })
    setMessage(null)
  }, [selectedFortnightId, selectedFortnightIncome])

  if (!selectedFortnight || !selectedMonth) {
    return null
  }

  const isClosed = selectedMonth.status === 'Closed'
  const displayedAmount =
    draft.fortnightId === selectedFortnightId ? draft.amount : String(selectedFortnightIncome)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextAmount =
      draft.fortnightId === selectedFortnightId ? Number(draft.amount) : selectedFortnightIncome

    try {
      await saveFortnightIncome(nextAmount)
      setDraft({
        fortnightId: selectedFortnightId,
        amount: String(nextAmount),
      })
      setMessage(`Ingreso guardado: ${formatMoney(nextAmount)}`)
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected save error.')
    }
  }

  return (
    <section className="planner-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Ingreso quincenal</p>
          <h3>{selectedFortnight.type === 'First' ? 'Primera quincena' : 'Segunda quincena'}</h3>
        </div>
        <span className={`planner-badge${isClosed ? ' is-closed' : ''}`}>
          {isClosed ? 'Mes cerrado' : 'Mes abierto'}
        </span>
      </div>

      <form className="planner-income-form" onSubmit={handleSubmit}>
        <label className="planner-field">
          <span className="planner-label">Valor</span>
          <div className="planner-money-input">
            <span className="planner-money-prefix">$</span>
            <input
              className="planner-input planner-input-money"
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              value={displayedAmount}
              onChange={(event) =>
                setDraft({
                  fortnightId: selectedFortnightId,
                  amount: event.target.value,
                })
              }
              disabled={isClosed || isSavingIncome}
            />
            <span className="planner-money-suffix">COP</span>
          </div>
        </label>

        <button className="planner-primary-button" type="submit" disabled={isClosed || isSavingIncome}>
          {isSavingIncome ? 'Guardando...' : 'Guardar ingreso'}
        </button>
      </form>

      {message ? <p className="planner-inline-message">{message}</p> : null}
    </section>
  )
}
