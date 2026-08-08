import { useEffect, type ReactNode } from 'react'

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode
  onClose?: () => void
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {onClose && (
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
