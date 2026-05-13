import { Link } from 'react-router'

const Navbar = () => {
  return (
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
  )
}

export default Navbar   
