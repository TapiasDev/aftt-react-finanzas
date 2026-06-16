import { useState } from 'react'
import { usePlanner } from '../../app/providers/usePlanner'
import { formatMoney } from '../../shared/lib/format'
import type { Expense, ExpenseApplyScope } from '../../shared/types/planner'

interface EditFormState {
  name: string
  amount: string
  estimatedPaymentDate: string
  description: string
}

interface DeleteDialogState {
  expenseId: string
  expenseName: string
  isRecurring: boolean
}

interface EditDialogState {
  expenseId: string
  expenseName: string
  isRecurring: boolean
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
    deleteExpense,
    isSavingExpense,
  } = usePlanner()
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [editingScope, setEditingScope] = useState<ExpenseApplyScope>('current')
  const [editDialog, setEditDialog] = useState<EditDialogState | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm)
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState | null>(null)
  const [deleteScope, setDeleteScope] = useState<ExpenseApplyScope>('current')
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
    setEditingScope('current')
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
    const expense = selectedFortnightExpenses.find((item) => item.id === expenseId)

    if (expense?.recurrenceId) {
      setEditDialog({
        expenseId,
        expenseName: expense.name,
        isRecurring: true,
      })
      return
    }

    await submitSave(expenseId, 'current')
  }

  async function submitSave(expenseId: string, applyScope: ExpenseApplyScope) {
    try {
      await updateExpense({
        expenseId,
        name: editForm.name,
        amount: Number(editForm.amount),
        estimatedPaymentDate: editForm.estimatedPaymentDate,
        description: editForm.description,
        applyScope,
      })

      setMessage('Gasto actualizado correctamente.')
      stopEditing()
      setEditDialog(null)
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected update error.')
    }
  }

  function closeEditDialog() {
    setEditDialog(null)
    setEditingScope('current')
  }

  async function confirmEditScope() {
    if (!editDialog) {
      return
    }

    await submitSave(editDialog.expenseId, editingScope)
  }

  async function handleToggle(expenseId: string, isPaid: boolean) {
    try {
      await toggleExpenseStatus(expenseId, isPaid)
      setMessage(isPaid ? 'Gasto marcado como pagado.' : 'Gasto marcado como pendiente.')
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected toggle error.')
    }
  }

  function openDeleteDialog(expense: Expense) {
    setDeleteScope('current')
    setDeleteDialog({
      expenseId: expense.id,
      expenseName: expense.name,
      isRecurring: Boolean(expense.recurrenceId),
    })
  }

  function closeDeleteDialog() {
    setDeleteDialog(null)
    setDeleteScope('current')
  }

  async function confirmDelete() {
    if (!deleteDialog) {
      return
    }

    try {
      await deleteExpense({
        expenseId: deleteDialog.expenseId,
        applyScope: deleteDialog.isRecurring ? deleteScope : 'current',
      })
      setMessage('Gasto eliminado correctamente.')
      if (editingExpenseId === deleteDialog.expenseId) {
        stopEditing()
      }
      closeDeleteDialog()
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected delete error.')
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
          const isRecurring = Boolean(expense.recurrenceId)

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
                    <div className="planner-money-input">
                      <span className="planner-money-prefix">$</span>
                      <input
                        className="planner-input planner-input-money"
                        type="number"
                        min="0"
                        step="1000"
                        inputMode="numeric"
                        value={editForm.amount}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, amount: event.target.value }))
                        }
                        disabled={isSavingExpense}
                      />
                      <span className="planner-money-suffix">COP</span>
                    </div>
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
                    {isRecurring ? <small>Recurrente{expense.isAutoGenerated ? ' · autogenerado' : ''}</small> : null}
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
                    className="planner-icon-button"
                    onClick={() => startEditing(expense)}
                    disabled={isClosed}
                    aria-label="Editar gasto"
                    title="Editar gasto"
                  >
                    <EditIcon />
                  </button>
                )}

                <button
                  type="button"
                  className="planner-icon-button planner-icon-button-danger"
                  onClick={() => openDeleteDialog(expense)}
                  disabled={isClosed || isSavingExpense}
                  aria-label="Eliminar gasto"
                  title="Eliminar gasto"
                >
                  <DeleteIcon />
                </button>
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

      {deleteDialog ? (
        <div className="planner-modal-backdrop" role="presentation">
          <div className="planner-modal" role="dialog" aria-modal="true" aria-labelledby="delete-expense-title">
            <div className="planner-modal-header">
              <div>
                <p className="planner-kicker">Confirmar eliminación</p>
                <h3 id="delete-expense-title">Eliminar gasto</h3>
              </div>
            </div>

            <p className="planner-modal-copy">
              Vas a eliminar <strong>{deleteDialog.expenseName}</strong>.
            </p>

            {deleteDialog.isRecurring ? (
              <label className="planner-field">
                <span className="planner-label">Alcance</span>
                <select
                  className="planner-select"
                  value={deleteScope}
                  onChange={(event) => setDeleteScope(event.target.value as ExpenseApplyScope)}
                  disabled={isSavingExpense}
                >
                  <option value="current">Solo este gasto</option>
                  <option value="future_only">Solo futuras</option>
                  <option value="current_and_future">Este y futuras</option>
                </select>
              </label>
            ) : null}

            <div className="planner-modal-actions">
              <button type="button" className="planner-secondary-button" onClick={() => void confirmDelete()} disabled={isSavingExpense}>
                {isSavingExpense ? 'Eliminando...' : 'Confirmar'}
              </button>
              <button type="button" className="planner-ghost-button" onClick={closeDeleteDialog} disabled={isSavingExpense}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editDialog ? (
        <div className="planner-modal-backdrop" role="presentation">
          <div className="planner-modal" role="dialog" aria-modal="true" aria-labelledby="edit-expense-scope-title">
            <div className="planner-modal-header">
              <div>
                <p className="planner-kicker">Aplicar edición</p>
                <h3 id="edit-expense-scope-title">Actualizar gasto recurrente</h3>
              </div>
            </div>

            <p className="planner-modal-copy">
              Elige cómo aplicar los cambios de <strong>{editDialog.expenseName}</strong>.
            </p>

            <label className="planner-field">
              <span className="planner-label">Alcance</span>
              <select
                className="planner-select"
                value={editingScope}
                onChange={(event) => setEditingScope(event.target.value as ExpenseApplyScope)}
                disabled={isSavingExpense}
              >
                <option value="current">Solo este gasto</option>
                <option value="future_only">Solo futuras</option>
                <option value="current_and_future">Este y futuras</option>
              </select>
            </label>

            <div className="planner-modal-actions">
              <button type="button" className="planner-secondary-button" onClick={() => void confirmEditScope()} disabled={isSavingExpense}>
                {isSavingExpense ? 'Guardando...' : 'Aplicar cambios'}
              </button>
              <button type="button" className="planner-ghost-button" onClick={closeEditDialog} disabled={isSavingExpense}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 20h4l10-10-4-4L4 16v4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 7h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 7V5h6v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 7l1 12h6l1-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v5M14 11v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
