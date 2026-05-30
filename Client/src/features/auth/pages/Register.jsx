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
                <aside className="auth-brand">
                    <div className="brand-header">
                        <span className="auth-logo">
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            CoverAI
                        </span>
                    </div>

                    <div className="brand-pitch">
                        <h2>Tailored cover letters, written for you.</h2>
                        <p>Create your account once and generate as many job-specific cover letters as you need.</p>
                    </div>

                    <div className="auth-visual-preview">
                        <div className="preview-card-header">
                            <div className="dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="badge font-semibold">AI Matcher</span>
                        </div>
                        <div className="preview-card-body">
                            <div className="preview-item">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                <span>resume_2026.pdf</span>
                                <span className="status-dot green"></span>
                            </div>
                            <div className="preview-connector">
                                <span className="spark">✦</span>
                            </div>
                            <div className="preview-score-badge">
                                <span className="score-val">98%</span>
                                <span className="score-lbl">Match</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-head">
                        <h1>Create your account</h1>
                        <p>It only takes a few seconds to get started.</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Name</label>
                        <div className="input-with-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="field-icon">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Your name"
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="field-icon">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="field-icon">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button className="primary-button" type="submit" disabled={loading}>
                        {loading ? 'Please wait…' : 'Create Account'}
                    </button>

                    <p className="auth-switch">
                        Already have an account?{' '}
                        <button type="button" onClick={() => navigate('/login')}>
                            Log in
                        </button>
                    </p>
                </form>
            </section>
        </main>
    )
}

export default Register