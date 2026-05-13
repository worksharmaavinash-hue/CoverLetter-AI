import { useState } from 'react'
import { useNavigate } from 'react-router'
import useAuth from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const { error, loading, register } = useAuth()
    const [form, setForm] = useState({
        username: '',
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
            await register(form)
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
                <h1>Create your account</h1>
                <p>
                    Start with your profile, then generate tailored cover letters from your resume and job posts.
                </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-tabs" aria-label="Authentication mode">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className="active"
                    >
                        Register
                    </button>
                </div>

                <label>
                    Name
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Your name"
                        autoComplete="name"
                        required
                    />
                </label>

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
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                </label>

                {error && <p className="form-error">{error}</p>}

                <button className="primary-button" type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : 'Create Account'}
                </button>
            </form>
        </section>
    </main>
  )
}

export default Register
