import { useState } from 'react'
import { useAuth } from '../../app/providers/useAuth'
import { usePlanner } from '../../app/providers/usePlanner'
import { FortnightIncomeCard } from '../../features/edit-fortnight-income/FortnightIncomeCard'
import { RegisterExpenseForm } from '../../features/register-expense/RegisterExpenseForm'
import { SignOutButton } from '../../features/sign-out/SignOutButton'
import { Modal } from '../../shared/ui/Modal'
import { ExpenseList } from '../../widgets/expense-list/ExpenseList'
import { FortnightSummary } from '../../widgets/fortnight-summary/FortnightSummary'
import { MonthlyCalendar } from '../../widgets/monthly-calendar/MonthlyCalendar'
import { PeriodSelector } from '../../widgets/period-selector/PeriodSelector'
import { PlannerSkeleton } from '../../widgets/planner-skeleton/PlannerSkeleton'
import './PlannerPage.css'

export function PlannerPage() {
  const { currentUser } = useAuth()
  const { error, isLoading, selectedFortnight, selectedMonth, isSavingExpense, isSavingIncome } = usePlanner()
  const [modal, setModal] = useState<'expense' | 'income' | null>(null)
  const [view, setView] = useState<'expenses' | 'calendar'>('expenses')
  const [notice, setNotice] = useState('')

  function handleSuccess(message: string) {
    setModal(null)
    setNotice(message)
  }

  return (
    <main className="planner-shell">
      <header className="planner-topbar">
        <a className="planner-brand" href="#main-content" aria-label="Finanzas, ir al contenido">
          <span className="planner-brand-mark" aria-hidden="true">f.</span>
          <span>finanzas<span className="planner-brand-caption">Tu planeador personal</span></span>
        </a>
        <div className="planner-account"><span>{currentUser?.username ?? 'Sin sesión'}</span><SignOutButton /></div>
      </header>
      <section className="planner-hero" id="main-content">
        <div>
          <p className="planner-eyebrow">Claridad en cada quincena</p>
          <h1>Tus finanzas, en orden.</h1>
          <p className="planner-lead">Organiza tus gastos y decide con tranquilidad.</p>
        </div>
        <div className="planner-header-actions">
          <button className="planner-secondary-button" disabled={!selectedFortnight || isLoading} onClick={() => setModal('income')}>Editar ingreso</button>
          <button className="planner-primary-button" disabled={!selectedFortnight || isLoading} onClick={() => setModal('expense')}><span aria-hidden="true">＋</span> Nuevo gasto</button>
        </div>
      </section>
      {error ? <div className="planner-alert" role="alert">{error}</div> : null}
      {isLoading ? <PlannerSkeleton view={view} /> : null}
      {notice ? <div className="planner-notice" role="status">{notice}<button className="planner-ghost-button" onClick={() => setNotice('')} aria-label="Cerrar notificación">Cerrar</button></div> : null}
      <div hidden={isLoading} aria-busy={isLoading}>
      <div className="planner-overview">
        <PeriodSelector />
        <FortnightSummary />
      </div>
      <div className="planner-view-toolbar">
        <div className="planner-view-switch" role="group" aria-label="Vista de tus gastos">
          <button className={view === 'expenses' ? 'is-active' : ''} aria-pressed={view === 'expenses'} onClick={() => setView('expenses')}>Gastos</button>
          <button className={view === 'calendar' ? 'is-active' : ''} aria-pressed={view === 'calendar'} onClick={() => setView('calendar')}>Calendario</button>
        </div>
        <p>{selectedMonth ? `${selectedMonth.monthName} ${selectedMonth.year}` : 'Selecciona un período'}</p>
      </div>
      <div hidden={view !== 'expenses'}><ExpenseList /></div>
      {view === 'calendar' ? <MonthlyCalendar /> : null}
      </div>
      {modal === 'expense' ? (
        <Modal title="Nuevo gasto" busy={isSavingExpense} onClose={() => setModal(null)}>
          <RegisterExpenseForm key={selectedFortnight?.id ?? 'empty'} onSuccess={() => handleSuccess('Gasto creado como pendiente.')} />
        </Modal>
      ) : null}
      {modal === 'income' ? (
        <Modal title="Editar ingreso" busy={isSavingIncome} onClose={() => setModal(null)}>
          <FortnightIncomeCard onSuccess={() => handleSuccess('Ingreso guardado correctamente.')} />
        </Modal>
      ) : null}
    </main>
  )
}
