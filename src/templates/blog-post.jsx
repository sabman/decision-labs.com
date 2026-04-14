import * as React from 'react'
import { Link, graphql } from 'gatsby'
import '../styles/global.css'
import Footer from '../components/Footer'

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const { title, date, author, category, readTime, image } = post.frontmatter
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

      <main className="main-content blog-post-content">
        <article className="blog-post">
          <div className="blog-post-card">
            <div className="blog-post-header">
              <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
              <span className="blog-post-category">{category || 'Blog'}</span>
            </div>
            
            <h1 className="blog-post-title">{title}</h1>
            
            <div className="blog-post-meta">
              <span className="blog-post-date">
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {readTime && <span className="blog-post-read-time">• {readTime}</span>}
              {author && <span className="blog-post-author">• {author}</span>}
            </div>

            {image && (
              <div className="blog-post-image">
                <img src={image} alt={title} />
              </div>
            )}

            <div 
              className="blog-post-body"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 200)
      html
      frontmatter {
        title
        date
        author
        category
        readTime
        image
      }
    }
  }
`

export const Head = ({ data }) => (
  <>
    <title>{data.markdownRemark.frontmatter.title} - Decision Labs Blog</title>
    <meta name="description" content={data.markdownRemark.excerpt} />
  </>
)
