import { useAuth } from '../../app/providers/useAuth';
import { usePlanner } from '../../app/providers/usePlanner';
import { FortnightIncomeCard } from '../../features/edit-fortnight-income/FortnightIncomeCard';
import { RegisterExpenseForm } from '../../features/register-expense/RegisterExpenseForm';
import { SignOutButton } from '../../features/sign-out/SignOutButton';
import { ExpenseList } from '../../widgets/expense-list/ExpenseList';
import { FortnightSummary } from '../../widgets/fortnight-summary/FortnightSummary';
import { MonthlyCalendar } from '../../widgets/monthly-calendar/MonthlyCalendar';
import { PeriodSelector } from '../../widgets/period-selector/PeriodSelector';
import './PlannerPage.css';

export function PlannerPage() {
  const { currentUser } = useAuth();
  const {
    error,
    isLoading,
    selectedFortnight,
    selectedFortnightExpenses,
    selectedMonth,
  } = usePlanner();
  const pendingExpenses = selectedFortnightExpenses.filter(
    (expense) => expense.status === 'Pending',
  ).length;
  const monthExpenseCount = selectedMonth?.expenses.length ?? 0;

  return (
    <main className='planner-shell'>
      <section className='planner-topbar'>
        <div>
          <p className='planner-topbar-kicker'>Bienvenido</p>
          <strong>{currentUser?.username ?? 'Sin sesion'}</strong>
        </div>

        <SignOutButton />
      </section>

      <section className='planner-hero'>
        <div className='planner-hero-copy'>
          <p className='planner-eyebrow'>Planeador y controlador de finanzas</p>
          <h1>
            <em>Quien controla sus finanzas, controla su futuro.</em>
          </h1>
          <p className='planner-lead'>
            Esta vista está pensada para decidir qué pagar ahora, qué se viene
            después y cuánto aire real queda en la quincena actual.
          </p>

          <div
            className='planner-hero-meta'
            aria-label='Contexto del período activo'
          >
            <article>
              <span>Mes activo</span>
              <strong>
                {selectedMonth
                  ? `${selectedMonth.monthName} ${selectedMonth.year}`
                  : 'Sin selección'}
              </strong>
            </article>
            <article>
              <span>Gastos del mes</span>
              <strong>{monthExpenseCount}</strong>
            </article>
            <article>
              <span>Pendientes</span>
              <strong>{pendingExpenses}</strong>
            </article>
          </div>
        </div>
      </section>

      {error ? <div className='planner-alert'>{error}</div> : null}
      {isLoading ? (
        <div className='planner-loading'>
          Cargando información del planner...
        </div>
      ) : null}

      <div className='planner-layout'>
        <div className='planner-main-column'>
          <PeriodSelector />
          <MonthlyCalendar />
          <ExpenseList />
        </div>

        <aside className='planner-side-column'>
          <FortnightIncomeCard />
          <RegisterExpenseForm key={selectedFortnight?.id ?? 'empty'} />
          <FortnightSummary />
        </aside>
      </div>
    </main>
  );
}
