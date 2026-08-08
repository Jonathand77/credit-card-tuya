import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export default function RequireAuth({ children }:{ children: ReactElement }){
  const auth = useAuth()
  const location = useLocation()
  if(!auth.isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
