import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth?.() || { user: null, loading: false }
  const location = useLocation()

  // Show a lightweight loader while auth state is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  // If not logged in, kick to home (adjust to /auth if you have a login page)
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  // Authorized
  return children
}
