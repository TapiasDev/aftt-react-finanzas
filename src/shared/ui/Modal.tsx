import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  title: string
  busy?: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, busy = false, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])

  return (
    <dialog ref={dialogRef} className="planner-form-modal" aria-label={title}
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose() }}>
      <div className="planner-form-modal-bar">
        <span>{title}</span>
        <button className="planner-icon-button" type="button" aria-label="Cerrar modal" disabled={busy} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </div>
      {children}
    </dialog>
  )
}
