import { useState } from 'react'
import AuthContextValue from './AuthContextValue'

const getInitialUser = () => {
    try {
        const savedUser = localStorage.getItem('cvMakerUser')
        return savedUser ? JSON.parse(savedUser) : null
    } catch {
        return null
    }
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getInitialUser)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

  return (
    <AuthContextValue.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
        { children }
    </AuthContextValue.Provider>
  )
}

export default AuthProvider
