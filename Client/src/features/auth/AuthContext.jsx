import { useState, useEffect } from 'react'
import AuthContextValue from './AuthContextValue'
import { getMe } from './services/auth.api'

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getMe()
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

  return (
    <AuthContextValue.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
        { children }
    </AuthContextValue.Provider>
  )
}

export default AuthProvider
