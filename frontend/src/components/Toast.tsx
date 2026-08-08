import { useEffect, useState } from 'react'
import { dismissToast, subscribeToasts, type ToastMessage } from '../lib/toastStore'

/* ---------- COMPONENTE DE ALERTAS ---------- */

export default function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  useEffect(() => subscribeToasts(setMessages), [])

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(120%); opacity: 0 }
          to { transform: translateX(0); opacity: 1 }
        }
        @keyframes toastOut {
          from { transform: translateX(0); opacity: 1 }
          to { transform: translateX(120%); opacity: 0 }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        {messages.map(t => (
          <div
            key={t.id}
            style={{
              minWidth: 320,
              padding: '14px 16px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--color-white)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              animation: 'toastIn 0.35s ease, toastOut 0.3s ease forwards',
              animationDelay: `0s, ${(t.duration || 4000) - 300}ms`,
              borderLeft: `6px solid ${t.type === 'success' ? 'var(--color-success)' :
                  t.type === 'error' ? 'var(--color-error)' :
                    t.type === 'warning' ? 'var(--color-warning)' :
                      'var(--color-primary)'
                }`
            }}
          >
            <strong style={{ textTransform: 'capitalize' }}>
              {t.type}
            </strong>

            <span style={{ flex: 1, fontSize: 14 }}>
              {t.message}
            </span>

            <button
              onClick={() => dismissToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                opacity: 0.6
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
