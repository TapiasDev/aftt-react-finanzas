import { useState } from 'react'
import { usePlanner } from '../../app/providers/usePlanner'
import { getDayNumberFromIso, getDaysUntil } from '../../shared/lib/date'
import { formatMoney } from '../../shared/lib/format'
import type { Expense, ExpenseApplyScope } from '../../shared/types/planner'

type ExpenseFilter = 'all' | 'pending' | 'paid' | 'overdue'

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

interface DuplicateDialogState {
  expense: Expense
}

type DuplicateTarget = 'same_fortnight' | 'other_fortnight'

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
    createExpense,
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
  const [duplicateDialog, setDuplicateDialog] = useState<DuplicateDialogState | null>(null)
  const [duplicateTarget, setDuplicateTarget] = useState<DuplicateTarget>('same_fortnight')
  const [selectedFilter, setSelectedFilter] = useState<ExpenseFilter>('all')
  const [message, setMessage] = useState<string | null>(null)

  if (!selectedMonth) {
    return null
  }

  const minDate = selectedFortnight?.startDate ?? ''
  const maxDate = selectedFortnight?.endDate ?? ''
  const filteredExpenses = selectedFortnightExpenses.filter((expense) => matchesFilter(expense, selectedFilter))

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

  function openDuplicateDialog(expense: Expense) {
    setDuplicateTarget('same_fortnight')
    setDuplicateDialog({ expense })
  }

  function closeDuplicateDialog() {
    setDuplicateDialog(null)
    setDuplicateTarget('same_fortnight')
  }

  async function confirmDuplicate() {
    if (!duplicateDialog || !selectedMonth) {
      return
    }

    const sourceExpense = duplicateDialog.expense
    const sourceFortnight = selectedMonth.fortnights.find((fortnight) => fortnight.id === sourceExpense.fortnightPeriodId)

    if (!sourceFortnight) {
      setMessage('No se pudo identificar la quincena origen del gasto.')
      return
    }

    const targetFortnight =
      duplicateTarget === 'same_fortnight'
        ? sourceFortnight
        : selectedMonth.fortnights.find((fortnight) => fortnight.type !== sourceFortnight.type)

    if (!targetFortnight) {
      setMessage('No se pudo identificar la quincena destino del gasto.')
      return
    }

    const duplicatedDate =
      duplicateTarget === 'same_fortnight'
        ? sourceExpense.estimatedPaymentDate
        : buildDuplicateDate(sourceExpense.estimatedPaymentDate, sourceFortnight.startDate, targetFortnight.startDate, targetFortnight.endDate)

    try {
      await createExpense({
        fortnightPeriodId: targetFortnight.id,
        name: `${sourceExpense.name} copia`,
        amount: sourceExpense.amount,
        estimatedPaymentDate: duplicatedDate,
        description: sourceExpense.description,
        recurrenceMode: 'none',
      })
      setMessage('Gasto duplicado correctamente.')
      closeDuplicateDialog()
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected duplicate error.')
    }
  }

  return (
    <section className="planner-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Gastos</p>
          <h2>Listado de la quincena seleccionada</h2>
        </div>
        <span className="planner-badge">Edición activa</span>
      </div>

      <div className="planner-expense-list">
        <div className="planner-filter-group" role="tablist" aria-label="Filtros de gastos">
          {[
            ['all', 'Todos'],
            ['pending', 'Pendientes'],
            ['paid', 'Pagados'],
            ['overdue', 'Vencidos'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`planner-filter-chip${selectedFilter === value ? ' is-active' : ''}`}
              onClick={() => setSelectedFilter(value as ExpenseFilter)}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="planner-empty-copy">No hay gastos registrados en esta quincena.</p>
        ) : null}

        {filteredExpenses.map((expense) => {
          const isPaid = expense.status === 'Paid'
          const isEditing = editingExpenseId === expense.id
          const isRecurring = Boolean(expense.recurrenceId)
          const dueTone = getExpenseDueTone(expense)
          const dueCopy = getExpenseDueCopy(expense)

          return (
            <article key={expense.id} className={`planner-expense-row planner-expense-row-${dueTone}`}>
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
                    <div className="planner-expense-meta-row">
                      <small className={`planner-expense-badge planner-expense-badge-${expense.status.toLowerCase()}`}>
                        {expense.status === 'Paid' ? 'Pagado' : 'Pendiente'}
                      </small>
                      {dueCopy ? <small className={`planner-expense-badge planner-expense-badge-${dueTone}`}>{dueCopy}</small> : null}
                      {isRecurring ? <small className="planner-expense-badge planner-expense-badge-recurring">Recurrente{expense.isAutoGenerated ? ' auto' : ''}</small> : null}
                    </div>
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
                    disabled={isTogglingExpense || isEditing}
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
                    disabled={false}
                    aria-label="Editar gasto"
                    title="Editar gasto"
                  >
                    <EditIcon />
                  </button>
                )}

                <button
                  type="button"
                  className="planner-icon-button"
                  onClick={() => openDuplicateDialog(expense)}
                  disabled={isSavingExpense}
                  aria-label="Duplicar gasto"
                  title="Duplicar gasto"
                >
                  <DuplicateIcon />
                </button>

                <button
                  type="button"
                  className="planner-icon-button planner-icon-button-danger"
                  onClick={() => openDeleteDialog(expense)}
                  disabled={isSavingExpense}
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
          `Puedes editar el gasto dentro del rango ${minDate} a ${maxDate}.` }
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

      {duplicateDialog ? (
        <div className="planner-modal-backdrop" role="presentation">
          <div className="planner-modal" role="dialog" aria-modal="true" aria-labelledby="duplicate-expense-title">
            <div className="planner-modal-header">
              <div>
                <p className="planner-kicker">Duplicar gasto</p>
                <h3 id="duplicate-expense-title">Crear copia</h3>
              </div>
            </div>

            <p className="planner-modal-copy">
              Elige dónde crear la copia de <strong>{duplicateDialog.expense.name}</strong>.
            </p>

            <label className="planner-field">
              <span className="planner-label">Destino</span>
              <select
                className="planner-select"
                value={duplicateTarget}
                onChange={(event) => setDuplicateTarget(event.target.value as DuplicateTarget)}
                disabled={isSavingExpense}
              >
                <option value="same_fortnight">Esta misma quincena</option>
                <option value="other_fortnight">La otra quincena del mes</option>
              </select>
            </label>

            <div className="planner-modal-actions">
              <button type="button" className="planner-secondary-button" onClick={() => void confirmDuplicate()} disabled={isSavingExpense}>
                {isSavingExpense ? 'Duplicando...' : 'Crear copia'}
              </button>
              <button type="button" className="planner-ghost-button" onClick={closeDuplicateDialog} disabled={isSavingExpense}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function buildDuplicateDate(originalDate: string, sourceStartDate: string, targetStartDate: string, targetEndDate: string) {
  const offset = getDayNumberFromIso(originalDate) - getDayNumberFromIso(sourceStartDate)
  const targetDay = Math.min(getDayNumberFromIso(targetStartDate) + offset, getDayNumberFromIso(targetEndDate))
  return `${targetStartDate.slice(0, 8)}${String(targetDay).padStart(2, '0')}`
}

function matchesFilter(expense: Expense, selectedFilter: ExpenseFilter) {
  if (selectedFilter === 'all') {
    return true
  }

  if (selectedFilter === 'paid') {
    return expense.status === 'Paid'
  }

  if (selectedFilter === 'pending') {
    return expense.status === 'Pending'
  }

  return expense.status === 'Pending' && getDaysUntil(expense.estimatedPaymentDate) < 0
}

function getExpenseDueTone(expense: Expense) {
  if (expense.status === 'Paid') {
    return 'paid'
  }

  const daysUntil = getDaysUntil(expense.estimatedPaymentDate)

  if (daysUntil < 0) {
    return 'overdue'
  }

  if (daysUntil <= 3) {
    return 'soon'
  }

  return 'pending'
}

function getExpenseDueCopy(expense: Expense) {
  if (expense.status === 'Paid') {
    return null
  }

  const daysUntil = getDaysUntil(expense.estimatedPaymentDate)

  if (daysUntil < 0) {
    return 'Vencido'
  }

  if (daysUntil === 0) {
    return 'Vence hoy'
  }

  if (daysUntil === 1) {
    return 'Vence mañana'
  }

  if (daysUntil <= 3) {
    return `Vence en ${daysUntil} días`
  }

  return null
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

function DuplicateIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M9 9h10v10H9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
