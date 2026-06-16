import { useState } from 'react'
import { usePlanner } from '../../app/providers/usePlanner'
import { formatMoney } from '../../shared/lib/format'
import type { Expense } from '../../shared/types/planner'

interface EditFormState {
  name: string
  amount: string
  estimatedPaymentDate: string
  description: string
}

const emptyEditForm: EditFormState = {
  name: '',
  amount: '',
  estimatedPaymentDate: '',
  description: '',
}

export function ExpenseList() {
  const {
    selectedFortnightExpenses,
    selectedMonth,
    selectedFortnight,
    toggleExpenseStatus,
    isTogglingExpense,
    updateExpense,
    isSavingExpense,
  } = usePlanner()
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm)
  const [message, setMessage] = useState<string | null>(null)

  if (!selectedMonth) {
    return null
  }

  const isClosed = selectedMonth.status === 'Closed'
  const minDate = selectedFortnight?.startDate ?? ''
  const maxDate = selectedFortnight?.endDate ?? ''

  function startEditing(expense: Expense) {
    setMessage(null)
    setEditingExpenseId(expense.id)
    setEditForm({
      name: expense.name,
      amount: String(expense.amount),
      estimatedPaymentDate: expense.estimatedPaymentDate,
      description: expense.description,
    })
  }

  function stopEditing() {
    setEditingExpenseId(null)
    setEditForm(emptyEditForm)
  }

  async function handleSave(expenseId: string) {
    try {
      await updateExpense({
        expenseId,
        name: editForm.name,
        amount: Number(editForm.amount),
        estimatedPaymentDate: editForm.estimatedPaymentDate,
        description: editForm.description,
      })

      setMessage('Gasto actualizado correctamente.')
      stopEditing()
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected update error.')
    }
  }

  async function handleToggle(expenseId: string, isPaid: boolean) {
    try {
      await toggleExpenseStatus(expenseId, isPaid)
      setMessage(isPaid ? 'Gasto marcado como pagado.' : 'Gasto marcado como pendiente.')
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected toggle error.')
    }
  }

  return (
    <section className="planner-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Gastos</p>
          <h2>Listado de la quincena seleccionada</h2>
        </div>
        <span className={`planner-badge${isClosed ? ' is-closed' : ''}`}>
          {isClosed ? 'Readonly' : 'Edicion activa'}
        </span>
      </div>

      <div className="planner-expense-list">
        {selectedFortnightExpenses.length === 0 ? (
          <p className="planner-empty-copy">No hay gastos registrados en esta quincena.</p>
        ) : null}

        {selectedFortnightExpenses.map((expense) => {
          const isPaid = expense.status === 'Paid'
          const isEditing = editingExpenseId === expense.id

          return (
            <article key={expense.id} className="planner-expense-row">
              <div className="planner-expense-content">
                {isEditing ? (
                  <div className="planner-expense-edit-grid">
                    <input
                      className="planner-input"
                      value={editForm.name}
                      onChange={(event) =>
                        setEditForm((current) => ({ ...current, name: event.target.value }))
                      }
                      disabled={isSavingExpense}
                    />
                    <input
                      className="planner-input"
                      type="number"
                      min="0"
                      step="1000"
                      value={editForm.amount}
                      onChange={(event) =>
                        setEditForm((current) => ({ ...current, amount: event.target.value }))
                      }
                      disabled={isSavingExpense}
                    />
                    <input
                      className="planner-input"
                      type="date"
                      value={editForm.estimatedPaymentDate}
                      min={minDate}
                      max={maxDate}
                      onChange={(event) =>
                        setEditForm((current) => ({
                          ...current,
                          estimatedPaymentDate: event.target.value,
                        }))
                      }
                      disabled={isSavingExpense}
                    />
                    <input
                      className="planner-input"
                      value={editForm.description}
                      onChange={(event) =>
                        setEditForm((current) => ({ ...current, description: event.target.value }))
                      }
                      disabled={isSavingExpense}
                    />
                  </div>
                ) : (
                  <div>
                    <strong>{expense.name}</strong>
                    <p>
                      {expense.estimatedPaymentDate} · {formatMoney(expense.amount)}
                    </p>
                    {expense.description ? <small>{expense.description}</small> : null}
                  </div>
                )}
              </div>

              <div className="planner-expense-actions">
                <label className="planner-toggle">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(event) => void handleToggle(expense.id, event.target.checked)}
                    disabled={isClosed || isTogglingExpense || isEditing}
                  />
                  <span>{isPaid ? 'Pagado' : 'Pendiente'}</span>
                </label>

                {isEditing ? (
                  <div className="planner-inline-actions">
                    <button
                      type="button"
                      className="planner-secondary-button"
                      onClick={() => void handleSave(expense.id)}
                      disabled={isSavingExpense}
                    >
                      {isSavingExpense ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      className="planner-ghost-button"
                      onClick={stopEditing}
                      disabled={isSavingExpense}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="planner-ghost-button"
                    onClick={() => startEditing(expense)}
                    disabled={isClosed}
                  >
                    Editar
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <p className="planner-inline-message">
        {message ??
          (isClosed
            ? 'El mes esta en readonly: editar y cambiar estados esta deshabilitado.'
            : `Puedes editar el gasto dentro del rango ${minDate} a ${maxDate}.`) }
      </p>
    </section>
  )
}
