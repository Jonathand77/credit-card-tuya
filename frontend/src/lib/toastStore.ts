export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type Listener = (messages: ToastMessage[]) => void

const toastStore: {
  messages: ToastMessage[]
  listeners: Set<Listener>
} = {
  messages: [],
  listeners: new Set()
}

let toastSeq = 0
const nextToastId = () => `${Date.now()}-${++toastSeq}`

const removeMessage = (id: string) => {
  toastStore.messages = toastStore.messages.filter(t => t.id !== id)
  toastStore.listeners.forEach(l => l([...toastStore.messages]))
}

export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration = 4000
) => {
  const id = nextToastId()
  const toast: ToastMessage = { id, message, type, duration }
  toastStore.messages.push(toast)
  toastStore.listeners.forEach(l => l([...toastStore.messages]))

  if (duration > 0) {
    setTimeout(() => removeMessage(id), duration)
  }

  return id
}

// Permite cancelar un toast desde el efecto que lo mostró (p. ej. al desmontar
// o volver a ejecutarse en React.StrictMode) para evitar mensajes duplicados.
export const dismissToast = (id: string) => removeMessage(id)

// Suscribe un listener a los cambios del store; devuelve la función para desuscribirse.
export const subscribeToasts = (listener: Listener) => {
  toastStore.listeners.add(listener)
  return () => toastStore.listeners.delete(listener)
}
