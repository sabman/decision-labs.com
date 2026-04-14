import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import projectsData from '../data/projects.json'
import Footer from '../components/Footer'

// Import project images
import geobaseImage from '../images/geobase-hero.png'
import earthgptImage from '../images/earthgpt-hero.jpg'
import verisatImage from '../images/verisat-heropng.png'
import geoaiImage from '../images/geoai-hero.png'

// Map project IDs to images
const projectImages = {
  '1': geobaseImage,
  '2': earthgptImage,
  '3': verisatImage,
  '4': geoaiImage,
}

// Work Card Component
const WorkCard = ({ project, projectImage }) => {
  const videoRef = React.useRef(null)
  
  const handleMouseEnter = () => {
    if (videoRef.current && project.metadata?.demo) {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
      })
    }
  }
  
  const handleMouseLeave = () => {
    if (videoRef.current && project.metadata?.demo) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }
  
  return (
    <div 
      className="card card-primary work-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="work-card-content">
        <div className="work-card-text">
          <div className="card-body work-card-body">
            <h2 className="work-card-title">{project.title}</h2>
            <p className="work-card-description">{project.description}</p>
          </div>
          <div className="card-footer">
            <div className="work-card-footer-content">
              <span className="card-brand">
                {new Date(project.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="work-card-image-wrapper">
          <img 
            src={projectImage} 
            alt={project.title}
            className="work-card-image"
          />
          {project.metadata?.demo && (
            <video
              ref={videoRef}
              className="work-card-video"
              src={project.metadata.demo}
              loop
              muted
              playsInline
              preload="metadata"
            />
          )}
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="work-card-link"
            aria-label="View project"
          >
            view project ↗
          </a>
        </div>
      </div>
    </div>
  )
}

const WorkPage = ({ location }) => {
  const pathname = location?.pathname || ''
  const projects = projectsData.sort((a, b) => new Date(b.date) - new Date(a.date))
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


  // Load-in effects for metrics
  React.useEffect(() => {
    const metricItems = document.querySelectorAll('.work-metric-item')
    
    if (metricItems.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, index * 150) // Stagger the animations
        }
      })
    }, observerOptions)

    metricItems.forEach((item) => {
      observer.observe(item)
    })

    return () => {
      metricItems.forEach((item) => {
        observer.unobserve(item)
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

      <main className="main-content work-content">
        <div className="content-cards work-cards">
          <div className="card card-primary work-hero-card">
            <div className="work-hero-header">
              <h1 className="work-page-title">Work</h1>
              <div className="work-metrics">
                <div className="work-metric work-metric-item">
                  <span className="work-metric-number">12+</span>
                  <span className="work-metric-label">AI Products</span>
                </div>
                <div className="work-metric work-metric-item">
                  <span className="work-metric-number">50+</span>
                  <span className="work-metric-label">Models Trained</span>
                </div>
                <div className="work-metric work-metric-item">
                  <span className="work-metric-number">3</span>
                  <span className="work-metric-label">Research Partnerships</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {projects.length > 0 ? (
          <div className="work-projects-grid">
            {projects.map((project) => {
              const projectImage = projectImages[project.id] || project.image
              return (
                <WorkCard 
                  key={project.id}
                  project={project}
                  projectImage={projectImage}
                />
              )
            })}
          </div>
        ) : (
          <div className="work-empty">
            <p className="mission-text">No projects yet. Check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default WorkPage

export const Head = () => <title>Work - Decision Labs</title>

