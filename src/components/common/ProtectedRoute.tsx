import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import Loader from './Loader'

export default function ProtectedRoute() {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) return <Loader />
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
    return <Outlet />
}
