import { useEffect, useState, type ReactNode } from 'react'
import { login as apiLogin, setToken as apiSetToken } from '../services/api'
import { showToast } from '../lib/toastStore'
import { AuthContext } from './auth-context'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    if (token) apiSetToken(token)
  }, [token])

  const login = async (username: string, email: string, password: string) => {
    const res = await apiLogin(username, email, password)

    if (!res?.token) {
      throw new Error('No se pudo iniciar sesión')
    }

    setToken(res.token)
    apiSetToken(res.token)
  }

  const logout = () => {
    setToken(null)
    apiSetToken(null)
  }

  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
      showToast('Tu sesión expiró. Inicia sesión de nuevo.', 'warning')
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}
