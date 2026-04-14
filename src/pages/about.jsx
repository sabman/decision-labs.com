import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import Footer from '../components/Footer'

const AboutPage = ({ location }) => {
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

  // Scroll-triggered animations for process steps
  React.useEffect(() => {
    const processSteps = document.querySelectorAll('.process-step')
    
    if (processSteps.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Animate the connector line after a short delay
          const connector = entry.target.querySelector('.process-connector')
          if (connector) {
            setTimeout(() => {
              connector.classList.add('animate')
            }, 300)
          }
        }
      })
    }, observerOptions)

    processSteps.forEach((step) => {
      observer.observe(step)
    })

    return () => {
      processSteps.forEach((step) => {
        observer.unobserve(step)
      })
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

      <main className="main-content about-content">
        <div className="content-cards about-cards">
          <div className="card card-primary about-main-card">
            <h1 className="about-page-title">About</h1>
            <div className="card-body">
              <p className="mission-text">
                We help our clients achieve efficiencies through digital transformation, develop analytics and data science capabilities.
              </p>
            </div>
          </div>
        </div>

        <div className="about-process-section">
          <div className="content-cards about-cards">
            <div className="card card-secondary process-timeline-card">
              <div className="card-header">
                <span className="card-title">Our Process</span>
              </div>
              <div className="card-body process-timeline-body">
                <div className="process-timeline">
                  <div className="process-step" data-step="1">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-1">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <rect x="20" y="20" width="60" height="60" rx="5" fill="currentColor" opacity="0.2"/>
                          <line x1="30" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="3"/>
                          <line x1="30" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="3"/>
                          <line x1="30" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="3"/>
                          <circle cx="75" cy="50" r="8" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">Scoping & Architecture Design</h3>
                        <p className="process-step-description">
                          First, we need to understand your problem better. Once we determine there is a fit for Machine Learning, we will work closely together to prepare a roadmap, review the scientific literature, and determine requirements.
                        </p>
                      </div>
                    </div>
                    <div className="process-connector">
                      <div className="process-connector-line"></div>
                    </div>
                  </div>

                  <div className="process-step" data-step="2">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-2">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.3"/>
                          <circle cx="50" cy="30" r="8" fill="currentColor" opacity="0.5"/>
                          <circle cx="70" cy="30" r="8" fill="currentColor" opacity="0.7"/>
                          <rect x="25" y="50" width="50" height="30" rx="3" fill="currentColor" opacity="0.2"/>
                          <line x1="35" y1="60" x2="65" y2="60" stroke="currentColor" strokeWidth="2"/>
                          <line x1="35" y1="70" x2="60" y2="70" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">Data Collection & Exploration</h3>
                        <p className="process-step-description">
                          Machine Learning needs data. If you have data needed to train the models, we will perform an exploratory analysis phase to find patterns and correlations. If you don't, we will collect the data for you using online sources (if possible).
                        </p>
                      </div>
                    </div>
                    <div className="process-connector">
                      <div className="process-connector-line"></div>
                    </div>
                  </div>

                  <div className="process-step" data-step="3">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-3">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 20 50 Q 35 20, 50 50 T 80 50" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <circle cx="20" cy="50" r="4" fill="currentColor"/>
                          <circle cx="50" cy="50" r="4" fill="currentColor"/>
                          <circle cx="80" cy="50" r="4" fill="currentColor"/>
                          <rect x="40" y="70" width="20" height="15" rx="2" fill="currentColor" opacity="0.3"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">Model Development</h3>
                        <p className="process-step-description">
                          We run thousands of experiments in parallel to develop a machine learning model. A model is the core of a machine learning system - trained on historical data it can predict the future trends or understand the semantics of a text.
                        </p>
                      </div>
                    </div>
                    <div className="process-connector">
                      <div className="process-connector-line"></div>
                    </div>
                  </div>

                  <div className="process-step" data-step="4">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-4">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <rect x="20" y="20" width="25" height="35" rx="2" fill="currentColor" opacity="0.3"/>
                          <rect x="55" y="20" width="25" height="35" rx="2" fill="currentColor" opacity="0.3"/>
                          <line x1="45" y1="37" x2="55" y2="37" stroke="currentColor" strokeWidth="3"/>
                          <rect x="30" y="65" width="40" height="20" rx="2" fill="currentColor" opacity="0.2"/>
                          <line x1="35" y1="72" x2="65" y2="72" stroke="currentColor" strokeWidth="2"/>
                          <line x1="35" y1="78" x2="60" y2="78" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">Full-stack application development</h3>
                        <p className="process-step-description">
                          We integrate the model with a REST API or a front-end application, developing all necessary features to access the model in an user-friendly way. Scalable and with the state-of-the-art security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage

export const Head = () => <title>About - Decision Labs</title>

