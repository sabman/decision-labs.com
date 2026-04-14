import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import postsData from '../data/posts.json'
import Footer from '../components/Footer'

const FeedPage = ({ location }) => {
  const pathname = location?.pathname || ''
  const allPosts = postsData.sort((a, b) => new Date(b.date) - new Date(a.date))
  const [activeFilter, setActiveFilter] = React.useState('all')
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)
  
  // Filter posts based on active filter
  const posts = React.useMemo(() => {
    if (activeFilter === 'all') {
      return allPosts
    }
    // Map filter to category
    const categoryMap = {
      'social': ['Twitter', 'Social', 'Social Media'],
      'talks': ['Talk', 'Presentation', 'Conference'],
      'posts': ['Blog', 'Article', 'Post'],
      'launches': ['Launch', 'Release', 'Announcement']
    }
    const categories = categoryMap[activeFilter] || []
    return allPosts.filter(post => {
      const category = post.metadata?.category || 'Blog'
      return categories.some(cat => category.toLowerCase().includes(cat.toLowerCase()))
    })
  }, [allPosts, activeFilter])
  
  // Calculate metrics
  const metrics = React.useMemo(() => {
    const totalPosts = allPosts.length
    const socialPosts = allPosts.filter(post => {
      const category = post.metadata?.category || ''
      return ['Twitter', 'Social', 'Social Media'].some(cat => 
        category.toLowerCase().includes(cat.toLowerCase())
      )
    }).length
    const totalLikes = allPosts.reduce((sum, post) => {
      return sum + (post.metadata?.likes || 0)
    }, 0)
    
    return {
      totalPosts,
      socialPosts,
      totalLikes
    }
  }, [allPosts])

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

  // Load-in effects for filter buttons and metrics
  React.useEffect(() => {
    const filterItems = document.querySelectorAll('.feed-filter-item, .feed-metric-item')
    
    if (filterItems.length === 0) return

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
          }, index * 100) // Stagger the animations
        }
      })
    }, observerOptions)

    filterItems.forEach((item) => {
      observer.observe(item)
    })

    return () => {
      filterItems.forEach((item) => {
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

      <main className="main-content feed-content">
        <div className="content-cards feed-cards">
          <div className="card card-primary feed-hero-card">
            <div className="feed-hero-header">
              <h1 className="feed-page-title">Feed</h1>
              <a href="/rss.xml" className="rss-link" aria-label="RSS Feed">
                RSS
              </a>
            </div>
            <div className="feed-metrics">
              <div className="feed-metric feed-metric-item">
                <div className="feed-metric-number">{metrics.totalPosts}</div>
                <div className="feed-metric-label">TOTAL POSTS</div>
              </div>
              <div className="feed-metric feed-metric-item">
                <div className="feed-metric-number">{metrics.socialPosts}</div>
                <div className="feed-metric-label">SOCIAL POSTS</div>
              </div>
              <div className="feed-metric feed-metric-item">
                <div className="feed-metric-number">{metrics.totalLikes}+</div>
                <div className="feed-metric-label">TOTAL LIKES</div>
              </div>
            </div>
            <div className="feed-filters">
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'social' ? 'active' : ''}`}
                onClick={() => setActiveFilter('social')}
              >
                Social
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'talks' ? 'active' : ''}`}
                onClick={() => setActiveFilter('talks')}
              >
                Talks
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveFilter('posts')}
              >
                Posts
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'launches' ? 'active' : ''}`}
                onClick={() => setActiveFilter('launches')}
              >
                Launches
              </button>
            </div>
          </div>
        </div>
        {posts.length > 0 ? (
          <div className="blog-posts-grid">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className={`card ${post.featured ? 'card-primary featured' : 'card-secondary'}`}
              >
                <div className="card-header">
                  <span className="card-title">{post.metadata?.category || 'Blog'}</span>
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="card-icon"
                    aria-label="View post"
                  >
                    ↗
                  </a>
                </div>
                <div className="card-body blog-card-body">
                  <div className="blog-card-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-description">{post.description}</p>
                </div>
                <div className="card-footer">
                  <span className="card-brand">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                    {post.metadata?.readTime && ` • ${post.metadata.readTime}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <p className="mission-text">No posts yet. Check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default FeedPage

export const Head = () => (
  <>
    <title>Feed - Decision Labs</title>
    <link rel="alternate" type="application/rss+xml" title="Decision Labs RSS Feed" href="/rss.xml" />
  </>
)
