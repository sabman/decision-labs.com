import * as React from 'react'
import '../styles/global.css'
import postsData from '../data/posts.json'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { categoryLabel, dateLocale, localizedField } from '../i18n/content'
import { PageHead } from '../i18n/PageHead'

const FeedPage = ({ location }) => {
  const { locale, t } = useI18n()
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
              <h1 className="feed-page-title">{t('feed.title')}</h1>
              <a href="/rss.xml" className="rss-link" aria-label={t('feed.rss')}>
                RSS
              </a>
            </div>
            <div className="feed-metrics">
              <div className="feed-metric feed-metric-item">
                <div className="feed-metric-number">{metrics.totalPosts}</div>
                <div className="feed-metric-label">{t('feed.totalPosts')}</div>
              </div>
              <div className="feed-metric feed-metric-item">
                <div className="feed-metric-number">{metrics.socialPosts}</div>
                <div className="feed-metric-label">{t('feed.socialPosts')}</div>
              </div>
              <div className="feed-metric feed-metric-item">
                <div className="feed-metric-number">{metrics.totalLikes}+</div>
                <div className="feed-metric-label">{t('feed.totalLikes')}</div>
              </div>
            </div>
            <div className="feed-filters">
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                {t('feed.all')}
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'social' ? 'active' : ''}`}
                onClick={() => setActiveFilter('social')}
              >
                {t('feed.social')}
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'talks' ? 'active' : ''}`}
                onClick={() => setActiveFilter('talks')}
              >
                {t('feed.talks')}
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveFilter('posts')}
              >
                {t('feed.posts')}
              </button>
              <button
                className={`feed-filter feed-filter-item ${activeFilter === 'launches' ? 'active' : ''}`}
                onClick={() => setActiveFilter('launches')}
              >
                {t('feed.launches')}
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
                  <span className="card-title">{categoryLabel(locale, post.metadata?.category || 'Blog')}</span>
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="card-icon"
                    aria-label={t('feed.viewPost')}
                  >
                    ↗
                  </a>
                </div>
                <div className="card-body blog-card-body">
                  <div className="blog-card-image">
                    <img src={post.image} alt={localizedField(post, 'title', locale)} />
                  </div>
                  <h2 className="blog-card-title">{localizedField(post, 'title', locale)}</h2>
                  <p className="blog-card-description">{localizedField(post, 'description', locale)}</p>
                </div>
                <div className="card-footer">
                  <span className="card-brand">
                    {new Date(post.date).toLocaleDateString(dateLocale(locale), {
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
            <p className="mission-text">{t('feed.empty')}</p>
          </div>
        )}
      </main>
    </SiteLayout>
  )
}

export default FeedPage

export const Head = (props) => (
  <PageHead pageKey="feed" {...props}>
    <link rel="alternate" type="application/rss+xml" title="Decision Labs RSS Feed" href="/rss.xml" />
  </PageHead>
)
