import '../../shared/ui/Loading.css'

export function PlannerSkeleton({ view }: { view: 'expenses' | 'calendar' }) {
  return (
    <div className="planner-skeleton" role="status" aria-label="Cargando tus finanzas">
      <span className="sr-only">Cargando el período y sus gastos…</span>
      <div aria-hidden="true">
        <div className="planner-overview">
          <div className="planner-panel skeleton-panel">
            <div className="skeleton skeleton-caption" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton-pair"><div className="skeleton skeleton-control" /><div className="skeleton skeleton-control" /></div>
            <div className="skeleton-pair"><div className="skeleton skeleton-period" /><div className="skeleton skeleton-period" /></div>
          </div>
          <div className="planner-panel skeleton-panel">
            <div className="skeleton skeleton-caption" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-control" />
            <div className="planner-summary-grid">
              {Array.from({ length: 6 }, (_, index) => <div className="skeleton skeleton-stat" key={index} />)}
            </div>
          </div>
        </div>
        <div className="planner-view-toolbar"><div className="skeleton skeleton-control skeleton-view" /></div>
        <div className="planner-panel skeleton-panel">
          <div className="skeleton skeleton-title" />
          {view === 'calendar' ? (
            <div className="skeleton-calendar">
              {Array.from({ length: 35 }, (_, index) => <div className="skeleton skeleton-day" key={index} />)}
            </div>
          ) : (
            Array.from({ length: 3 }, (_, index) => (
              <div className="skeleton-expense" key={index}>
                <div className="skeleton-expense-copy"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-caption" /></div>
                <div className="skeleton skeleton-actions" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
