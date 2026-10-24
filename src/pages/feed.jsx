import * as React from 'react'
import '../styles/global.css'
import postsData from '../data/posts.json'
import SiteLayout from '../components/SiteLayout'

const FeedPage = ({ location }) => {
  const allPosts = postsData.sort((a, b) => new Date(b.date) - new Date(a.date))
  const [activeFilter, setActiveFilter] = React.useState('all')
  
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
    <SiteLayout location={location}>

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
    </SiteLayout>
  )
}

export default FeedPage

export const Head = () => (
  <>
    <title>Feed - Decision Labs</title>
    <link rel="alternate" type="application/rss+xml" title="Decision Labs RSS Feed" href="/rss.xml" />
  </>
)
