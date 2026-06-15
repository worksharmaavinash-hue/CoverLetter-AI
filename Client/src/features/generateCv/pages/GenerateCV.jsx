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
    const [copied, setCopied] = useState(false)

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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(coverLetter)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    const handleDownloadWord = () => {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><title>Cover Letter</title>" +
            "<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->" +
            "<style>" +
            "body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 12pt; line-height: 1.5; margin: 0.5in; }" +
            "p { margin: 0 0 10pt 0; text-align: justify; }" +
            "</style>" +
            "</head><body>";
        const footer = "</body></html>";

        // Convert the cover letter content (preserving line breaks) into HTML paragraphs
        const paragraphs = coverLetter
            .split('\n')
            .map(line => line.trim() === '' ? '<p>&nbsp;</p>' : `<p>${line}</p>`)
            .join('');

        const htmlContent = header + paragraphs + footer;

        const blob = new Blob(['\ufeff' + htmlContent], {
            type: 'application/msword'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = extractedJob?.companyName
            ? `${extractedJob.companyName}-cover-letter.doc`
            : 'cover-letter.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
            <header className="generator-header">
                <span className="brand">
                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    CoverAI
                </span>
                <button type="button" className="logout-btn" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </header>

            <section className="generator-card">
                <form className="generator-form" onSubmit={handleGenerate}>
                    <div className="cv-input-card">
                        <div className="cv-input-header">
                            <h2>Generate your cover letter</h2>
                        </div>

                        <div className="cv-input-fields">
                            {resumeFile ? (
                                <div className="selected-file-card">
                                    <div className="file-info">
                                        <div className="file-icon-box">
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                            </svg>
                                        </div>
                                        <div className="file-details">
                                            <span className="file-name">{resumeFile.name}</span>
                                            <span className="file-size">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                    <button type="button" className="remove-file-btn" onClick={handleReset} title="Remove resume">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="upload-dropzone">
                                    <div className="upload-icon">
                                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <div className="upload-text">
                                        <label className="upload-label">
                                            <span>Upload resume</span> or drag & drop here
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        <p className="upload-subtext">PDF, DOC, or DOCX up to 5MB</p>
                                    </div>
                                </div>
                            )}

                            <div className={`url-input-container ${jobDescription ? 'input-inactive' : ''}`}>
                                <div className="input-icon">
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                </div>
                                <input
                                    type="url"
                                    className="url-input"
                                    placeholder="Paste the job posting URL here…"
                                    value={jobUrl}
                                    onChange={(e) => setJobUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="or-divider">
                            <span className="or-line"></span>
                            <span className="or-text">OR</span>
                            <span className="or-line"></span>
                        </div>

                        <div className={`fallback-input-box ${jobUrl ? 'input-inactive' : ''}`}>
                            <textarea
                                className="cv-textarea"
                                value={jobDescription}
                                onChange={(event) => setJobDescription(event.target.value)}
                                placeholder="Paste the full job description here…"
                                rows={4}
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}

                        <div className="submit-row">
                            <button className="primary-button outline-submit" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="button-spinner"></div>
                                        Generating…
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                        </svg>
                                        Generate cover letter
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            {(extractedJob || coverLetter) && (
                <section className="generator-results">
                    {coverLetter && (
                        <div className="result-panel letter-panel">
                            <div className="result-header">
                                <h2>Your cover letter</h2>
                                <div className="result-actions">
                                    <button
                                        type="button"
                                        className={`copy-btn ${copied ? 'copied' : ''}`}
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <>
                                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="download-btn"
                                        onClick={handleDownloadWord}
                                    >
                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Download Word
                                    </button>
                                </div>
                            </div>
                            <div className="letter-paper">
                                <pre>{coverLetter}</pre>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>
    )
}

export default GenerateCV
