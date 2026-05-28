import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useAuth from '../features/auth/hooks/useAuth'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true })
        }
    }, [user, loading, navigate])

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p style={{ fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>Verifying your session...</p>
            </div>
        )
    }

    return user ? children : null
}

export default ProtectedRoute
