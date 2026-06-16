import { useState, type FormEvent } from 'react'
import { usePlanner } from '../../app/providers/usePlanner'
import type { ExpenseRecurrenceMode } from '../../shared/types/planner'

interface RegisterExpenseFormState {
  name: string
  amount: string
  estimatedPaymentDate: string
  description: string
  recurrenceMode: ExpenseRecurrenceMode
}

const emptyForm: RegisterExpenseFormState = {
  name: '',
  amount: '',
  estimatedPaymentDate: '',
  description: '',
  recurrenceMode: 'none',
}

export function RegisterExpenseForm() {
  const { selectedMonth, selectedFortnight, createExpense, isSavingExpense } = usePlanner()
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState<string | null>(null)

  if (!selectedMonth || !selectedFortnight) {
    return null
  }

  const isClosed = selectedMonth.status === 'Closed'
  const selectedFortnightId = selectedFortnight.id
  const minDate = selectedFortnight.startDate
  const maxDate = selectedFortnight.endDate

  function handleDateChange(nextDate: string) {
    setForm((current) => ({ ...current, estimatedPaymentDate: nextDate }))
    setMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
        await createExpense({
          fortnightPeriodId: selectedFortnightId,
          name: form.name,
          amount: Number(form.amount),
          estimatedPaymentDate: form.estimatedPaymentDate,
          description: form.description,
          recurrenceMode: form.recurrenceMode,
        })

      setForm(emptyForm)
      setMessage('Gasto creado como pendiente.')
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected expense error.')
    }
  }

  return (
    <section className="planner-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Registrar gasto</p>
          <h2>Nuevo gasto para la quincena actual</h2>
        </div>
        <span className={`planner-badge${isClosed ? ' is-closed' : ''}`}>
          {isClosed ? 'Readonly' : 'Editable'}
        </span>
      </div>

      <form className="planner-expense-form" onSubmit={handleSubmit}>
        <label className="planner-field">
          <span className="planner-label">Nombre</span>
          <input
            className="planner-input"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            disabled={isClosed || isSavingExpense}
          />
        </label>

        <div className="planner-form-split">
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
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
                disabled={isClosed || isSavingExpense}
              />
              <span className="planner-money-suffix">COP</span>
            </div>
          </label>

          <label className="planner-field">
            <span className="planner-label">Fecha estimada</span>
            <input
              className="planner-input"
              type="date"
              value={form.estimatedPaymentDate}
              min={minDate}
              max={maxDate}
              onChange={(event) => handleDateChange(event.target.value)}
              disabled={isClosed || isSavingExpense}
            />
          </label>
        </div>

        <label className="planner-field">
          <span className="planner-label">Descripción</span>
          <input
            className="planner-input"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            disabled={isClosed || isSavingExpense}
          />
        </label>

        <label className="planner-field">
          <span className="planner-label">Repetición</span>
          <select
            className="planner-select"
            value={form.recurrenceMode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                recurrenceMode: event.target.value as typeof current.recurrenceMode,
              }))
            }
            disabled={isClosed || isSavingExpense}
          >
            <option value="none">Solo esta quincena</option>
            <option value="monthly_twice">Ambas quincenas de este mes</option>
            <option value="future_once">Esta quincena en los meses futuros</option>
            <option value="future_twice">Ambas quincenas en los meses futuros</option>
          </select>
        </label>

        <button className="planner-primary-button" type="submit" disabled={isClosed || isSavingExpense}>
          {isSavingExpense ? 'Guardando...' : 'Crear gasto'}
        </button>
      </form>

      <p className="planner-inline-message">
        {message ??
          (isClosed
            ? 'No se pueden crear gastos mientras el mes este cerrado.'
            : `La fecha debe estar entre ${minDate} y ${maxDate}.`) }
      </p>
    </section>
  )
}
