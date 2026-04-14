import * as React from 'react'
import { Link } from 'gatsby'
import { Mail, Calendar } from 'lucide-react'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import '../styles/global.css'
import Footer from '../components/Footer'

const ContactPage = ({ location }) => {
  const pathname = location?.pathname || ''
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)

  // Detect background color behind header (throttled for performance)
  React.useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let ticking = false
    const checkBackground = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const headerRect = header.getBoundingClientRect()
          const headerCenterY = headerRect.top + headerRect.height / 2
          const headerCenterX = window.innerWidth / 2

          const elementBelow = document.elementFromPoint(headerCenterX, headerCenterY)
          
          if (!elementBelow) {
            setTextColor('black')
            ticking = false
            return
          }

          let currentElement = elementBelow
          while (currentElement && currentElement !== document.body) {
            if (currentElement.classList && currentElement.classList.contains('card-primary')) {
              setTextColor('white')
              ticking = false
              return
            }
            if (currentElement.classList && (
              currentElement.classList.contains('card-secondary') ||
              currentElement.classList.contains('page-container')
            )) {
              setTextColor('black')
              ticking = false
              return
            }
            currentElement = currentElement.parentElement
          }

          const bgColor = window.getComputedStyle(elementBelow).backgroundColor
          if (bgColor) {
            const rgb = bgColor.match(/\d+/g)
            if (rgb && rgb.length >= 3) {
              const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3
              setTextColor(brightness < 128 ? 'white' : 'black')
            } else {
              setTextColor('black')
            }
          } else {
            setTextColor('black')
          }
          ticking = false
        })
        ticking = true
      }
    }

    checkBackground()
    window.addEventListener('scroll', checkBackground, { passive: true })
    window.addEventListener('resize', checkBackground, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkBackground)
      window.removeEventListener('resize', checkBackground)
    }
  }, [])
  
  return (
    <div className="page-container">
      <header className="header" ref={headerRef}>
        <Link to="/" className="logo" style={{ color: textColor }}>Decision Labs</Link>
        <nav className="nav">
          <Link to="/about" className={pathname === '/about' || pathname === '/about/' ? 'active' : ''}>About</Link>
          <Link to="/blog" className={pathname === '/blog' || pathname === '/blog/' ? 'active' : ''}>Blog</Link>
          <Link to="/contact" className={pathname === '/contact' || pathname === '/contact/' ? 'active' : ''}>Contact</Link>
          <Link to="/work" className={pathname === '/work' || pathname === '/work/' ? 'active' : ''}>Work</Link>
        </nav>
      </header>

      <main className="main-content contact-content">
        <div className="content-cards contact-cards">
          <div className="card card-primary contact-main-card">
            <h1 className="contact-page-title">Contact</h1>
            <div className="card-body">
              <p className="mission-text">
                Let's discuss how we can help transform your data into actionable insights. Reach out to start a conversation about your next project.
              </p>
            </div>
            <div className="card-footer">
            </div>
          </div>

          <div className="contact-links-container">
            <div className="contact-links-grid">
              <a href="https://github.com" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaGithub size={24} />
                </div>
                <div className="contact-link-label">GitHub</div>
              </a>
              <a href="mailto:team@decision-labs.com" className="contact-link-card">
                <div className="contact-link-icon">
                  <Mail size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">Email</div>
              </a>
              <a href="https://www.linkedin.com/company/spacialdb-ug-decision-labs/" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaLinkedin size={24} />
                </div>
                <div className="contact-link-label">LinkedIn</div>
              </a>
              <a href="https://twitter.com/geobaseapp" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaXTwitter size={24} />
                </div>
                <div className="contact-link-label">Twitter</div>
              </a>
              <a href="https://cal.com/decision-labs" className="contact-link-card contact-link-card-wide" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <Calendar size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">Book a Call</div>
                <div className="contact-link-helper">30-minute consultation • Free • No commitment</div>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage

export const Head = () => <title>Contact - Decision Labs</title>

