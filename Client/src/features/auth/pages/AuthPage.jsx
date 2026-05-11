import { useState } from 'react'
import { useNavigate } from 'react-router'
import { loginUser, registerUser } from '../services/auth.api'

function AuthPage({ initialMode = 'login' }) {
    const navigate = useNavigate()
    const [mode, setMode] = useState(initialMode)
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isRegister = mode === 'register'

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')

        try {
            const data = isRegister
                ? await registerUser(form)
                : await loginUser(form)

            localStorage.setItem('cvMakerUser', JSON.stringify(data.user))
            navigate('/generate', { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-panel">
                <div className="auth-copy">
                    <p className="eyebrow">CV Maker</p>
                    <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
                    <p>
                        Generate tailored cover letters from your resume and a job post in one focused workflow.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-tabs" aria-label="Authentication mode">
                        <button
                            type="button"
                            className={mode === 'login' ? 'active' : ''}
                            onClick={() => {
                                setMode('login')
                                navigate('/login')
                            }}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className={mode === 'register' ? 'active' : ''}
                            onClick={() => {
                                setMode('register')
                                navigate('/register')
                            }}
                        >
                            Register
                        </button>
                    </div>

                    {isRegister && (
                        <label>
                            Name
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Your name"
                                autoComplete="name"
                            />
                        </label>
                    )}

                    <label>
                        Email
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </label>

                    <label>
                        Password
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                        />
                    </label>

                    {error && <p className="form-error">{error}</p>}

                    <button className="primary-button" type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
                    </button>
                </form>
            </section>
        </main>
    )
}

export default AuthPage
