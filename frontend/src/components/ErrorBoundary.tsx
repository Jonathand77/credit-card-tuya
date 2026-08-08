import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en la vista:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Ocurrió un error inesperado al mostrar esta página.</p>
          {import.meta.env.DEV && (
            <pre className="error-boundary-details">{this.state.error.stack || this.state.error.message}</pre>
          )}
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
