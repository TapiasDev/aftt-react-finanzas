import { useAuth } from '../../app/providers/useAuth';
import { usePlanner } from '../../app/providers/usePlanner';
import { CloseMonthCard } from '../../features/close-month/CloseMonthCard';
import { FortnightIncomeCard } from '../../features/edit-fortnight-income/FortnightIncomeCard';
import { RegisterExpenseForm } from '../../features/register-expense/RegisterExpenseForm';
import { SignOutButton } from '../../features/sign-out/SignOutButton';
import { ExpenseList } from '../../widgets/expense-list/ExpenseList';
import { MonthlyCalendar } from '../../widgets/monthly-calendar/MonthlyCalendar';
import { PeriodSelector } from '../../widgets/period-selector/PeriodSelector';
import { FortnightSummary } from '../../widgets/fortnight-summary/FortnightSummary';
import './PlannerPage.css';

export function PlannerPage() {
  const { currentUser } = useAuth();
  const {
    error,
    isLoading,
    selectedMonth,
    selectedFortnight,
    selectedFortnightExpenses,
  } = usePlanner();

  return (
    <main className='planner-shell'>
      <section className='planner-topbar'>
        <div>
          <p className='planner-topbar-kicker'>Bienvenido</p>
          <strong>{currentUser?.email ?? 'Sin sesion'}</strong>
        </div>

        <SignOutButton />
      </section>

      <section className='planner-hero'>
        <div>
          <p className='planner-eyebrow'>Cuida tus finanzas</p>
          <h1>Control de gastos por año, mes y quincena</h1>
          <p className='planner-lead'>
            <em>Quien controla sus finanzas, controla su destino.</em>
          </p>
        </div>

        <div className='planner-hero-card'>
          <span>
            {selectedMonth?.status === 'Closed'
              ? 'Modo readonly'
              : 'Modo edicion'}
          </span>
          <strong>
            {selectedMonth
              ? `${selectedMonth.monthName} ${selectedMonth.year}`
              : 'Sin período'}
          </strong>
          <p>
            {selectedFortnightExpenses.length} gastos visibles en la quincena
            seleccionada
          </p>
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
          <FortnightIncomeCard key={selectedFortnight?.id ?? 'empty'} />
          <RegisterExpenseForm key={selectedFortnight?.id ?? 'empty'} />
          <CloseMonthCard />
          <FortnightSummary />
        </aside>
      </div>
    </main>
  );
}
