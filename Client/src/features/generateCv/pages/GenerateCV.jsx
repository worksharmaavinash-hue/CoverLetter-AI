import { useState } from 'react'
import { useNavigate } from 'react-router'
import { logoutUser } from '../../auth/services/auth.api'
import { extractJobDetails, generateCoverLetter } from '../services/generate.api'
import { jsPDF } from 'jspdf'

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
    const [resumeFile, setResumeFile] = useState(null)
    const [resumeText, setResumeText] = useState('')
    const [jobUrl, setJobUrl] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [coverLetter, setCoverLetter] = useState('')
    const [extractedJob, setExtractedJob] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [activeFeature, setActiveFeature] = useState('CV Check')
    const [showFallbackInput, setShowFallbackInput] = useState(false)

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
                resumeText: '',
                jobDescription: jobData.fullJobDescription,
                companyName: jobData.companyName
            })

            setCoverLetter(result.coverLetter)
        } catch (err) {
            setError(err.response?.data?.suggestion || err.response?.data?.message || err.response?.data?.error || err.message)
            if (err.response?.status === 403) {
                setShowFallbackInput(true)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setResumeFile(null)
        setResumeText('')
        setShowFallbackInput(false)
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF()
        const margin = 20
        const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin
        const pageHeight = doc.internal.pageSize.getHeight()
        const lineHeight = 7

        // Add a header
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text('Cover Letter', margin, margin + 10)

        // Add the cover letter body
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(coverLetter, maxWidth)
        let cursorY = margin + (extractedJob?.companyName ? 32 : 22)

        for (const line of lines) {
            if (cursorY + lineHeight > pageHeight - margin) {
                doc.addPage()
                cursorY = margin
            }
            doc.text(line, margin, cursorY)
            cursorY += lineHeight
        }

        const fileName = extractedJob?.companyName
            ? `${extractedJob.companyName}-cover-letter.pdf`
            : 'cover-letter.pdf'
        doc.save(fileName)
    }

    const handleLogout = async () => {
        try {
            await logoutUser()
        } catch (error) {
            console.error(error)
        }

        navigate('/login', { replace: true })
    }

    return (
        <main className="generator-page">
            <header className="generator-header relative py-4">
                <button className='absolute right-0' type="button" onClick={handleLogout}>Logout</button>
            </header>

            <section className="generator-card">

                <form className="generator-form" onSubmit={handleGenerate}>
                    <div className="cv-input-card">
                        <div className="cv-input-header">
                            <h2>Try it on your CV</h2>
                        </div>

                        <div className="cv-input-box">
                            <div className="upload-row">
                                <label className="upload-btn-outline">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    Upload CV
                                    <input 
                                        type="file" 
                                        accept=".pdf,.doc,.docx" 
                                        onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <span className="upload-hint">{resumeFile ? resumeFile.name : 'PDF only, up to 5MB'}</span>
                            </div>

                            <input
                                type="url"
                                className="cv-textarea"
                                style={{ minHeight: 'auto', padding: '12px 0 32px' }}
                                placeholder="Paste Job URL here..."
                                value={jobUrl}
                                onChange={(e) => setJobUrl(e.target.value)}
                            />
                        </div>

                        {showFallbackInput && (
                            <div className="job-inputs-section" style={{marginTop: '24px'}}>
                                <textarea
                                    className="cv-textarea"
                                    value={jobDescription}
                                    onChange={(event) => setJobDescription(event.target.value)}
                                    placeholder="Scraping blocked. Please paste the full job description here..."
                                    rows={3}
                                />
                            </div>
                        )}

                        {error && <p className="form-error">{error}</p>}

                        <div className="submit-row">
                            <button className="primary-button outline-submit" type="submit" disabled={loading}>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                {loading ? 'Analyzing...' : 'Generate cover letter'}
                            </button>
                        </div>
                    </div>
                </form>

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h2 className='font-semibold text-lg'>Your Cover Letter:</h2>
                                <button 
                                    type="button" 
                                    className="primary-button outline-submit" 
                                    onClick={handleDownloadPDF}
                                    style={{ padding: '8px 16px', fontSize: '14px' }}
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Download PDF
                                </button>
                            </div>
                            <pre>{coverLetter}</pre>
                        </div>
                    )}
                </section>
            )}
        </main>
    )
}

export default GenerateCV
