import * as React from 'react'
import { Link, graphql } from 'gatsby'
import { FileText, Mic, Handshake, BookOpen, Grid } from 'lucide-react'
import '../styles/global.css'
import Footer from '../components/Footer'
import postsData from '../data/posts.json'

const BlogPage = ({ location, data }) => {
  const pathname = location?.pathname || ''
  
  // Architecture:
  // - Internal posts: Auto-detected from markdown files in src/blog/
  //   (posts without links OR with linkType: "internal")
  // - External posts: Loaded from src/data/posts.json
  //   (posts with external links like YouTube, Twitter, external blogs)
  
  // Get internal posts from markdown files (auto-detected from src/blog/)
  // Internal posts: no link OR linkType is explicitly 'internal'
  const markdownPosts = (data?.allMarkdownRemark?.nodes || [])
    .map(node => {
      const hasLink = node.frontmatter.link && node.frontmatter.link.trim() !== ''
      const linkType = node.frontmatter.linkType
      const slug = node.frontmatter.slug || node.fields?.slug || node.id
      
      // Skip placeholder files
      if (slug === 'placeholder' || node.frontmatter.title === 'Placeholder') {
        return null
      }
      
      // Internal if: no link, or linkType is explicitly 'internal'
      const isInternal = !hasLink || linkType === 'internal'
      
      // Get category from frontmatter
      const category = node.frontmatter.category || 'Blog'
      
      return {
        id: node.id,
        title: node.frontmatter.title,
        description: node.excerpt,
        image: node.frontmatter.image,
        link: node.frontmatter.link || '',
        linkType: isInternal ? 'internal' : 'external',
        isInternal: isInternal,
        slug: slug,
        date: node.frontmatter.date,
        author: node.frontmatter.author,
        featured: node.frontmatter.featured || false,
        metadata: {
          category: category,
          readTime: node.frontmatter.readTime,
        },
      }
    })
    .filter(post => post !== null && post.isInternal) // Only include internal posts from markdown, excluding placeholder
  
  // Get external posts from posts.json
  // External posts: have a link (assumed to be external sources like YouTube, Twitter, external blogs)
  const jsonPosts = postsData
    .filter(post => {
      // Only include posts that have a link (external posts)
      const hasLink = post.link && post.link.trim() !== ''
      // If linkType is explicitly 'internal', skip it (should be in markdown instead)
      return hasLink && post.linkType !== 'internal'
    })
    .map(post => {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        image: post.image,
        link: post.link,
        linkType: 'external',
        isInternal: false,
        slug: post.slug || post.id,
        date: post.date,
        author: post.author || 'Decision Labs',
        featured: post.featured || false,
        metadata: {
          category: post.metadata?.category || 'Blog',
          readTime: post.metadata?.readTime,
        },
      }
    })
  
  // Combine and sort all posts by date
  const allPosts = [...markdownPosts, ...jsonPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  
  const [activeFilter, setActiveFilter] = React.useState('all')
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)
  
  // Get unique categories from all posts
  const categories = React.useMemo(() => {
    const categorySet = new Set()
    allPosts.forEach(post => {
      const category = post.metadata?.category || 'Blog'
      if (category) {
        categorySet.add(category)
      }
    })
    return Array.from(categorySet).sort()
  }, [allPosts])
  
  // Filter posts based on active filter
  const posts = React.useMemo(() => {
    if (activeFilter === 'all') {
      return allPosts
    }
    return allPosts.filter(post => {
      const postCategory = post.metadata?.category || 'Blog'
      return postCategory === activeFilter
    })
  }, [allPosts, activeFilter])

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

  // Load-in effects for filter buttons
  React.useEffect(() => {
    const filterItems = document.querySelectorAll('.blog-filter-item')
    
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
  }, [activeFilter]) // Re-run when filter changes to ensure visibility

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

  // Get icon component for filter
  const getFilterIcon = (filter) => {
    const iconProps = { size: 16 }
    if (filter === 'all') {
      return <Grid {...iconProps} />
    }
    return getCategoryIcon(filter)
  }

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

      <main className="main-content blog-content">
        <div className="content-cards blog-cards">
          <div className="card card-primary blog-hero-card">
            <div className="blog-hero-header">
              <h1 className="blog-page-title">Blog</h1>
              <a href="/rss.xml" className="rss-link" aria-label="RSS Feed">
                RSS
              </a>
            </div>
            <div className="blog-filters">
              <button
                className={`blog-filter blog-filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                {getFilterIcon('all')}
                <span>All</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`blog-filter blog-filter-item ${activeFilter === category ? 'active' : ''}`}
                  onClick={() => setActiveFilter(category)}
                >
                  {getFilterIcon(category)}
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {posts.length > 0 ? (
          <div className="blog-posts-grid">
            {posts.map((post) => {
              const CardWrapper = post.isInternal ? Link : 'a'
              const cardProps = post.isInternal 
                ? { to: `/blog/${post.slug}` }
                : { href: post.link, target: '_blank', rel: 'noopener noreferrer' }
              
              return (
                <CardWrapper
                  key={post.id}
                  {...cardProps}
                  className={`card ${post.featured ? 'card-primary' : 'card-secondary'} blog-card ${post.isInternal ? 'blog-card-internal' : 'blog-card-external'}`}
                  aria-label={`View ${post.title}`}
                >
                  <div className="card-body blog-card-body">
                    <div className="card-header">
                      <span></span>
                      <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getCategoryIcon(post.metadata?.category || 'Post')}
                        <span>{post.metadata?.category || 'Post'}</span>
                      </span>
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-description">{post.description}</p>
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
                </CardWrapper>
              )
            })}
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

export default BlogPage

export const query = graphql`
  query {
    allMarkdownRemark {
      nodes {
        id
        excerpt(pruneLength: 120)
        fields {
          slug
        }
        frontmatter {
          title
          date
          author
          category
          readTime
          featured
          image
          link
          linkType
          slug
        }
      }
    }
  }
`

export const Head = () => (
  <>
    <title>Blog - Decision Labs</title>
    <link rel="alternate" type="application/rss+xml" title="Decision Labs RSS Feed" href="/rss.xml" />
  </>
)

