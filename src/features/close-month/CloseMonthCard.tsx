import { useState, type FormEvent } from 'react'
import { usePlanner } from '../../app/providers/usePlanner'

export function CloseMonthCard() {
  const { selectedMonth, closeMonth, isClosingMonth } = usePlanner()
  const [confirmClose, setConfirmClose] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!selectedMonth) {
    return null
  }

  const isClosed = selectedMonth.status === 'Closed'
  const selectedMonthId = selectedMonth.id

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await closeMonth(selectedMonthId, confirmClose)
      setMessage('El mes fue cerrado y quedo en modo readonly.')
      setConfirmClose(false)
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : 'Unexpected close month error.')
    }
  }

  return (
    <section className="planner-panel">
      <div className="planner-panel-header">
        <div>
          <p className="planner-kicker">Cierre de mes</p>
          <h2>{isClosed ? 'Mes cerrado' : 'Bloquear modificaciones del mes'}</h2>
        </div>
        <span className={`planner-badge${isClosed ? ' is-closed' : ''}`}>
          {isClosed ? 'Readonly activo' : 'Pendiente por cerrar'}
        </span>
      </div>

      <form className="planner-expense-form" onSubmit={handleSubmit}>
        <label className="planner-checkline">
          <input
            type="checkbox"
            checked={confirmClose}
            onChange={(event) => setConfirmClose(event.target.checked)}
            disabled={isClosed || isClosingMonth}
          />
          <span>Confirmo que quiero cerrar el mes seleccionado.</span>
        </label>

        <button
          className="planner-secondary-button"
          type="submit"
          disabled={isClosed || isClosingMonth || !confirmClose}
        >
          {isClosingMonth ? 'Cerrando...' : 'Cerrar mes'}
        </button>
      </form>

      <p className="planner-inline-message">
        {message ??
          (isClosed
            ? 'Crear, editar y cambiar estados esta deshabilitado para este mes.'
            : 'El cierre convierte todo el mes en modo solo lectura.')}
      </p>
    </section>
  )
}
