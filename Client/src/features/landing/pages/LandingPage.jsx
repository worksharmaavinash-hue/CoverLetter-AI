import { Link } from 'react-router'

function LandingPage() {
    return (
        <main className="landing-page">
            <nav className="site-nav">
                <Link className="brand" to="/">CoverAI</Link>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#process">How it works</a>
                    <a href="#pricing">Pricing</a>
                </div>
                <div className="nav-actions">
                    <Link to="/login">Log In</Link>
                    <Link className="nav-cta" to="/register">Get Started</Link>
                </div>
            </nav>

            <section className="hero-section">
                <div className="hero-copy">
                    <p className="pill">New: GPT-powered resume analysis</p>
                    <h1>
                        Land Interviews Faster with <span>AI-Powered</span> Cover Letters
                    </h1>
                    <p>
                        Upload your resume, paste a job link, and generate a tailored cover letter
                        that sounds human, focused, and ready to send.
                    </p>
                    <div className="hero-actions">
                        <Link className="primary-link" to="/register">Generate My Cover Letter</Link>
                        <Link className="secondary-link" to="/login">I Already Have An Account</Link>
                    </div>
                    <p className="trust-line">Trusted by job seekers building sharper applications.</p>
                </div>

                <div className="hero-visual" aria-label="Cover letter editor preview">
                    <div className="window-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="preview-badge">Tailored score</div>
                    <div className="preview-title"></div>
                    <div className="preview-line wide"></div>
                    <div className="preview-line"></div>
                    <div className="preview-line full"></div>
                    <div className="preview-line full"></div>
                    <div className="preview-line long"></div>
                    <div className="ai-spark">✦</div>
                    <div className="preview-line accent"></div>
                    <div className="preview-line full"></div>
                    <div className="profile-row">
                        <div className="profile-dot"></div>
                        <div>
                            <div className="profile-line"></div>
                            <div className="profile-line short"></div>
                        </div>
                    </div>
                    <Link className="edit-button" to="/generate">Edit Draft</Link>
                </div>
            </section>

            <section className="feature-section" id="features">
                <div className="section-heading">
                    <h2>Engineered for Your Success</h2>
                    <p>Modern AI assistance with a workflow built for real job applications.</p>
                </div>
                <div className="feature-grid">
                    <article>
                        <span className="feature-icon teal">✦</span>
                        <h3>AI Personalized Writing</h3>
                        <p>Turn resume details and job requirements into a polished, relevant letter.</p>
                    </article>
                    <article>
                        <span className="feature-icon blue">▣</span>
                        <h3>ATS-Aware Content</h3>
                        <p>Reflect important role keywords without making the letter sound robotic.</p>
                    </article>
                    <article>
                        <span className="feature-icon gold">▤</span>
                        <h3>PDF & Image Resume Input</h3>
                        <p>Upload a resume PDF or image and let the app extract the text for you.</p>
                    </article>
                </div>
            </section>

            <section className="process-section" id="process">
                <div className="steps">
                    <div className="step-item">
                        <span>1</span>
                        <div>
                            <h3>Upload Your Profile</h3>
                            <p>Add your resume and the job you are targeting.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <span>2</span>
                        <div>
                            <h3>AI Generation</h3>
                            <p>The app extracts job details and connects them with your experience.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <span>3</span>
                        <div>
                            <h3>Review & Submit</h3>
                            <p>Read, refine, and use a concise letter tailored to the role.</p>
                        </div>
                    </div>
                </div>

                <div className="mesh-card">
                    <div className="mesh-lines"></div>
                    <div className="score-card">
                        <strong>96%</strong>
                        <span>Match Rate</span>
                    </div>
                </div>
            </section>

            <section className="pricing-section" id="pricing">
                <div className="section-heading">
                    <h2>Simple, Transparent Pricing</h2>
                    <p>Start free while you build the rest of your application flow.</p>
                </div>
                <div className="pricing-grid">
                    <article className="price-card">
                        <p>Free</p>
                        <h3>$0<span>/mo</span></h3>
                        <ul>
                            <li>1 cover letter per month</li>
                            <li>Basic AI analysis</li>
                            <li>Standard templates</li>
                        </ul>
                        <Link to="/register">Start Free</Link>
                    </article>
                    <article className="price-card featured">
                        <p>Pro</p>
                        <h3>$12<span>/mo</span></h3>
                        <ul>
                            <li>Unlimited cover letters</li>
                            <li>Advanced job matching</li>
                            <li>Resume PDF and image upload</li>
                        </ul>
                        <Link to="/register">Upgrade to Pro</Link>
                    </article>
                    <article className="price-card">
                        <p>Team</p>
                        <h3>$49<span>/mo</span></h3>
                        <ul>
                            <li>Up to 5 users</li>
                            <li>Shared resume review tools</li>
                            <li>Priority support</li>
                        </ul>
                        <Link to="/register">Contact Sales</Link>
                    </article>
                </div>
            </section>

            <footer className="site-footer">
                <div>
                    <Link className="brand" to="/">CoverAI</Link>
                    <p>AI cover letters for focused job seekers.</p>
                </div>
                <div>
                    <strong>Product</strong>
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                </div>
                <div>
                    <strong>Company</strong>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Get Started</Link>
                </div>
            </footer>
        </main>
    )
}

export default LandingPage
