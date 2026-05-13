import { useState } from 'react'
import { useNavigate } from 'react-router'
import useAuth from '../hooks/useAuth'

const Login = () => {
    const navigate = useNavigate()
    const { error, loading, login } = useAuth()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            await login(form)
            navigate('/generate', { replace: true })
        } catch {
            // The hook owns the displayed error state.
        }
    }

  return (
    <main className="auth-page">
        <section className="auth-panel">
            <div className="auth-copy">
                <p className="eyebrow">CV Maker</p>
                <h1>Welcome back</h1>
                <p>
                    Generate tailored cover letters from your resume and a job post in one focused workflow.
                </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-tabs" aria-label="Authentication mode">
                    <button
                        type="button"
                        className="active"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </div>

                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
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
                        autoComplete="current-password"
                        required
                    />
                </label>

                {error && <p className="form-error">{error}</p>}

                <button className="primary-button" type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : 'Login'}
                </button>
            </form>
        </section>
    </main>
  )
}

export default Login
