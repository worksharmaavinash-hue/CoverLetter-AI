import { useState } from 'react'
import { useNavigate } from 'react-router'
import { logoutUser } from '../../auth/services/auth.api'
import { extractJobDetails, generateCoverLetter } from '../services/generate.api'

const savedHistory = [
    {
        role: 'Product Designer',
        company: 'Stripe',
        date: 'Generated today'
    },
    {
        role: 'Frontend Engineer',
        company: 'Linear',
        date: 'Last draft'
    }
]

const GenerateCV = () => {
    const navigate = useNavigate()
    const savedUser = localStorage.getItem('cvMakerUser')
    const user = savedUser ? JSON.parse(savedUser) : null
    const [resumeFile, setResumeFile] = useState(null)
    const [resumeText, setResumeText] = useState('')
    const [jobUrl, setJobUrl] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [coverLetter, setCoverLetter] = useState('')
    const [extractedJob, setExtractedJob] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')
        setCoverLetter('')
        setExtractedJob(null)

        try {
            const jobData = await extractJobDetails({
                jobUrl: jobUrl.trim(),
                jobDescription: jobDescription.trim()
            })

            setExtractedJob(jobData)

            const result = await generateCoverLetter({
                resumeFile,
                resumeText: resumeText.trim(),
                jobDescription: jobData.fullJobDescription
            })

            setCoverLetter(result.coverLetter)
        } catch (err) {
            setError(err.response?.data?.suggestion || err.response?.data?.message || err.response?.data?.error || err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logoutUser()
        } catch (error) {
            console.error(error)
        }

        localStorage.removeItem('cvMakerUser')
        navigate('/login', { replace: true })
    }

    return (
        <main className="generator-page">
            <header className="generator-header">
                <div className="draft-meta">
                    <span>Project Alpha</span>
                    <span>›</span>
                    <strong>Untitled Draft</strong>
                </div>
                <button type="button" onClick={handleLogout}>Logout</button>
            </header>

            <section className="generator-card">

                <form className="generator-form" onSubmit={handleGenerate}>
                    <div className="form-intro">
                        <h1>Experience & Intent</h1>
                        <p>Upload your latest resume and the target job description to begin.</p>
                    </div>

                    <label>
                        <span>Resume</span>
                        <div className="upload-box">
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                            />
                            <div className="upload-content">
                                <div className="file-icon">▧</div>
                                <strong>{resumeFile ? resumeFile.name : 'Upload Resume'}</strong>
                                <small>PDF, DOCX, up to 10MB</small>
                            </div>
                        </div>
                    </label>    

                    <label>
                        <span>Job Posting URL</span>
                        <div className="url-row">
                            <input
                                type="url"
                                value={jobUrl}
                                onChange={(event) => setJobUrl(event.target.value)}
                                placeholder="https://linkedin.com/jobs/..."
                            />
                            <button
                                type="button"
                                onClick={() => navigator.clipboard?.readText?.().then((text) => setJobUrl(text))}
                            >
                                Paste
                            </button>
                        </div>
                    </label>

                    <label>
                        <span>Additional Context Optional</span>
                        <textarea
                            value={jobDescription}
                            onChange={(event) => setJobDescription(event.target.value)}
                            placeholder="Paste Full Description If Job Url Block Scraping"
                            rows={5}
                        />
                    </label>

                    {error && <p className="form-error">{error}</p>}

                    <button className="primary-button" type="submit" disabled={loading}>
                        {loading ? 'Analyzing...' : 'Analyze Context'} <span>→</span>
                    </button>
                </form>

                <section className="saved-history">
                    <h2>Saved History</h2>
                    <div className="history-list">
                        {savedHistory.map((item) => (
                            <article key={`${item.role}-${item.company}`} className="history-item">
                                <span>▧</span>
                                <div>
                                    <strong>{item.role} @ {item.company}</strong>
                                    <small>{item.date}</small>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </section>

            {(extractedJob || coverLetter) && (
                <section className="generator-results">
                    {extractedJob && (
                        <div className="result-panel">
                            <h2>Extracted Job</h2>
                            <dl className="job-summary">
                                <div>
                                    <dt>Company</dt>
                                    <dd>{extractedJob.companyName}</dd>
                                </div>
                                <div>
                                    <dt>Role</dt>
                                    <dd>{extractedJob.jobTitle}</dd>
                                </div>
                                <div>
                                    <dt>Location</dt>
                                    <dd>{extractedJob.location}</dd>
                                </div>
                                <div>
                                    <dt>Salary</dt>
                                    <dd>{extractedJob.salary}</dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {coverLetter && (
                        <div className="result-panel letter-panel">
                            <h2>Your Cover Letter</h2>
                            <pre>{coverLetter}</pre>
                        </div>
                    )}
                </section>
            )}
        </main>
    )
}

export default GenerateCV
