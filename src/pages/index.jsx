import * as React from 'react'
import { Link } from 'gatsby'
import { FileText, Mic, Handshake, BookOpen } from 'lucide-react'
import '../styles/global.css'
import postsData from '../data/posts.json'
import Footer from '../components/Footer'

const IndexPage = ({ location }) => {
  const pathname = location?.pathname || ''
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)
  
  // Get featured posts, or if none, get recent posts
  const featuredPosts = postsData.filter(post => post.featured === true)
  const postsToShow = featuredPosts.length > 0 
    ? featuredPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
    : postsData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  
  const currentPost = postsToShow[activeIndex]

  // Get icon component for category
  const getCategoryIcon = (category) => {
    const iconProps = { size: 16, style: { display: 'inline-block', verticalAlign: 'middle' } }
    switch (category) {
      case 'Blog':
        return <FileText {...iconProps} />
      case 'Talk':
        return <Mic {...iconProps} />
      case 'Partnership':
        return <Handshake {...iconProps} />
      default:
        return <BookOpen {...iconProps} />
    }
  }

  React.useEffect(() => {
    if (postsToShow.length <= 1) return
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % postsToShow.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [postsToShow.length])

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
    <div className="page-container landing-page">
      <header className="header" ref={headerRef}>
        <Link to="/" className="logo" style={{ color: textColor }}>Decision Labs</Link>
        <nav className="nav">
          <Link to="/about" className={pathname === '/about' || pathname === '/about/' ? 'active' : ''}>About</Link>
          <Link to="/blog" className={pathname === '/blog' || pathname === '/blog/' ? 'active' : ''}>Blog</Link>
          <Link to="/contact" className={pathname === '/contact' || pathname === '/contact/' ? 'active' : ''}>Contact</Link>
          <Link to="/work" className={pathname === '/work' || pathname === '/work/' ? 'active' : ''}>Work</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="content-cards">
          <div className="card card-primary">
            <div className="card-header">
            </div>
            <div className="card-body">
              <p className="mission-text">
                We build AI-driven products, train custom models, and create intelligent systems that turn complex data into actionable insights. From concept to deployment.
              </p>
            </div>
          </div>

          <div className="card card-secondary">
            {currentPost?.link ? (
              currentPost.link.startsWith('/') ? (
                <Link
                  to={currentPost.link}
                  className="card-clickable"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
                >
                  <div className="card-header">
                    {currentPost?.metadata?.category ? (
                      <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getCategoryIcon(currentPost.metadata.category)}
                        <span>{currentPost.metadata.category}</span>
                      </span>
                    ) : (
                      <span className="card-title">Featured</span>
                    )}
                  </div>
                  <div className="card-body featured-post-body">
                    <div className="featured-post-content">
                      <h3 className="featured-post-title">{currentPost.title}</h3>
                      <p className="featured-post-description">{currentPost.description}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <a
                  href={currentPost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-clickable"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
                >
                  <div className="card-header">
                    {currentPost?.metadata?.category ? (
                      <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getCategoryIcon(currentPost.metadata.category)}
                        <span>{currentPost.metadata.category}</span>
                      </span>
                    ) : (
                      <span className="card-title">Featured</span>
                    )}
                  </div>
                  <div className="card-body featured-post-body">
                    <div className="featured-post-content">
                      <h3 className="featured-post-title">{currentPost.title}</h3>
                      <p className="featured-post-description">{currentPost.description}</p>
                    </div>
                  </div>
                </a>
              )
            ) : (
              <>
                <div className="card-header">
                  {currentPost?.metadata?.category ? (
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getCategoryIcon(currentPost.metadata.category)}
                      <span>{currentPost.metadata.category}</span>
                    </span>
                  ) : (
                    <span className="card-title">Featured</span>
                  )}
                </div>
                <div className="card-body featured-post-body">
                  {currentPost ? (
                    <div className="featured-post-content">
                      <h3 className="featured-post-title">{currentPost.title}</h3>
                      <p className="featured-post-description">{currentPost.description}</p>
                    </div>
                  ) : (
                    <p className="project-text">No posts available</p>
                  )}
                </div>
              </>
            )}
            <div className="card-footer">
              {postsToShow.length > 1 && (
                <div className="featured-post-tabs">
                  {postsToShow.map((_, index) => (
                    <button
                      key={index}
                      className={`tab-indicator ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`View post ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </main>
    <Footer />
    </div>
  )
}

export default IndexPage

export const Head = () => <title>Decision Labs</title>
