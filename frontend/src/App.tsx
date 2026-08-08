import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Payments from './pages/Payments'
import History from './pages/History'

import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'
import Toast from './components/Toast'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'

function AppLayout() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  const routes = (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/cards"
        element={
          <RequireAuth>
            <Cards />
          </RequireAuth>
        }
      />

      <Route
        path="/payments"
        element={
          <RequireAuth>
            <Payments />
          </RequireAuth>
        }
      />

      <Route
        path="/history"
        element={
          <RequireAuth>
            <History />
          </RequireAuth>
        }
      />
    </Routes>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1 }}>
        <ErrorBoundary key={location.pathname}>
          {isLogin ? routes : <div className="container">{routes}</div>}
        </ErrorBoundary>
      </main>

      {/* FOOTER GLOBAL (oculto en login para una experiencia inmersiva) */}
      {!isLogin && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* TOAST GLOBAL */}
        <Toast />
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}