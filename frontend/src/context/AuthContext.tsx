import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, setToken as apiSetToken } from '../services/api'

type AuthContextType = {
  token: string | null
  login: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    if (token) apiSetToken(token)
  }, [token])

  const login = async (username: string, email: string, password: string) => {
    const res = await apiLogin(username, email, password)

    if (!res) {
      throw new Error('USER_NOT_FOUND')
    }

    if (res.error) {
      throw new Error(res.error)
    }

    if (!res.token) {
      throw new Error('INVALID_CREDENTIALS')
    }

    setToken(res.token)
    apiSetToken(res.token)
  }

  const logout = () => {
    setToken(null)
    apiSetToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
