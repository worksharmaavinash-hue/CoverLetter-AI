import { useContext } from 'react'
import AuthContextValue from '../AuthContextValue'
import { loginUser, logoutUser, registerUser } from '../services/auth.api'

const getAuthErrorMessage = (err) => {
    if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        return err.response.data.errors.map(error => error.msg).join(', ')
    }
    return err.response?.data?.message || err.response?.data?.error || err.message || 'Authentication failed'
}

const useAuth = () => {
    const context = useContext(AuthContextValue)

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    const { user, setUser, loading, setLoading, error, setError } = context

    const login = async ({ email, password }) => {
        setLoading(true)
        setError('')

        try {
            const data = await loginUser({ email, password })
            setUser(data.user)
            return data
        } catch (err) {
            const message = getAuthErrorMessage(err)
            setError(message)
            throw new Error(message, { cause: err })
        } finally {
            setLoading(false)
        }
    }

    const register = async ({ username, email, password }) => {
        setLoading(true)
        setError('')

        try {
            const data = await registerUser({ username, email, password })
            setUser(data.user)
            return data
        } catch (err) {
            const message = getAuthErrorMessage(err)
            setError(message)
            throw new Error(message, { cause: err })
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        setError('')

        try {
            await logoutUser()
        } finally {
            setUser(null)
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        error,
        login,
        logout,
        register
    }
}

export default useAuth
