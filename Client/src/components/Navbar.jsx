import { Link, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import useAuth from '../features/auth/hooks/useAuth'

const Navbar = () => {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('')
  const { user } = useAuth()

  const isLandingPage = location.pathname === '/'

  // On the landing page, observe which section is in view
  useEffect(() => {
    if (!isLandingPage) {
      setActiveSection('')
      return
    }

    const sections = document.querySelectorAll('#features, #process')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.3 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isLandingPage])

  const handleAnchorClick = (e, sectionId) => {
    if (isLandingPage) {
      e.preventDefault()
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="site-nav">
      <Link className="brand" to="/">CoverAI</Link>
      <div className="nav-links">
        <Link
          className={`link ${activeSection === 'features' ? 'link-active' : ''}`}
          to="/#features"
          onClick={(e) => handleAnchorClick(e, 'features')}
        >
          Features
        </Link>
        <Link
          className={`link ${activeSection === 'process' ? 'link-active' : ''}`}
          to="/#process"
          onClick={(e) => handleAnchorClick(e, 'process')}
        >
          How it works
        </Link>
        <Link
          className={`link ${location.pathname === '/generate' ? 'link-active' : ''}`}
          to="/generate"
        >
          Generate
        </Link>
      </div>
      <div className="nav-actions">
        {!user ? (
          <>
            <Link
              className={location.pathname === '/login' ? 'link-active' : ''}
              to="/login"
            >
              Log In
            </Link>
            <Link className="nav-cta" to="/register">Get Started</Link>
          </>
        ) : (
          <span className="nav-user">Hi, {user.username}</span>
        )}
      </div>
    </nav>
  )
}

export default Navbar
