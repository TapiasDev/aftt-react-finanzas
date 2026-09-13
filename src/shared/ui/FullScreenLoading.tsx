import './Loading.css'

export function FullScreenLoading() {
  return (
    <main className="fullscreen-loading" role="status" aria-live="polite">
      <div className="fullscreen-loading-content">
        <div className="loading-emblem" aria-hidden="true">
          <span className="loading-orbit" />
          <span className="loading-monogram">f.</span>
        </div>
        <p className="loading-eyebrow">Tu planeador personal</p>
        <h1>Preparando tus finanzas</h1>
        <p>Estamos cargando tu sesión.</p>
        <div className="loading-dots" aria-hidden="true"><span /><span /><span /></div>
      </div>
    </main>
  )
}
