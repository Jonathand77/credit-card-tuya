import React, { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastMessage {
  id: string
  message: string
  type: ToastType
  duration?: number
}

const toastStore: { messages: ToastMessage[], listeners: Set<Function> } = {
  messages: [],
  listeners: new Set()
}

export const showToast = (message: string, type: ToastType = 'info', duration = 4000) => {
  const id = Date.now().toString()
  const toast: ToastMessage = { id, message, type, duration }
  toastStore.messages.push(toast)
  toastStore.listeners.forEach(listener => listener([...toastStore.messages]))
  
  if (duration > 0) {
    setTimeout(() => {
      toastStore.messages = toastStore.messages.filter(t => t.id !== id)
      toastStore.listeners.forEach(listener => listener([...toastStore.messages]))
    }, duration)
  }
}

export default function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  useEffect(() => {
    toastStore.listeners.add(setMessages)
    return () => {
      toastStore.listeners.delete(setMessages)
    }
  }, [])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
    }
  }

  const getStyles = (type: ToastType) => {
    const baseStyle: React.CSSProperties = {
      padding: '16px 20px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideIn 0.3s ease-out, slideOut 0.3s ease-out 3.7s forwards',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginBottom: '12px'
    }

    switch (type) {
      case 'success':
        return { ...baseStyle, background: '#10b981', color: '#fff' }
      case 'error':
        return { ...baseStyle, background: '#ef4444', color: '#fff' }
      case 'warning':
        return { ...baseStyle, background: '#f59e0b', color: '#fff' }
      case 'info':
        return { ...baseStyle, background: '#3b82f6', color: '#fff' }
    }
  }

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        {messages.map(toast => (
          <div key={toast.id} style={getStyles(toast.type) as React.CSSProperties} onMouseEnter={() => {
            const el = document.querySelector(`[data-toast-id="${toast.id}"]`) as HTMLElement
            if (el) el.style.animation = 'none'
          }} onMouseLeave={() => {
            const el = document.querySelector(`[data-toast-id="${toast.id}"]`) as HTMLElement
            if (el) el.style.animation = 'slideIn 0.3s ease-out, slideOut 0.3s ease-out 3.7s forwards'
          }} data-toast-id={toast.id}>
            <span style={{ fontSize: '18px' }}>{getIcon(toast.type)}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  )
}
