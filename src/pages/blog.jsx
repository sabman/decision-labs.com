import * as React from 'react'
import { Link, graphql } from 'gatsby'
import SiteLayout from '../components/SiteLayout'
import { PageHead, pageLocale } from '../i18n/PageHead'
import { useI18n } from '../i18n/I18nProvider'
import { categoryLabel, dateLocale } from '../i18n/content'
import { localeHref } from '../i18n/routes'
import { FileText, Mic, Handshake, BookOpen, Grid, Radio } from 'lucide-react'
import '../styles/global.css'
import postsData from '../data/posts.json'

const BlogPage = ({ location, data }) => {
  const { locale, t } = useI18n()
  const nodes = data?.allMarkdownRemark?.nodes || []
  const translationsBySlug = new Map(
    nodes
      .filter((node) => node.frontmatter.locale === locale && node.frontmatter.translationOf)
      .map((node) => [node.frontmatter.translationOf, node])
  )
  
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

      if (node.frontmatter.locale && node.frontmatter.locale !== 'en') {
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
      case 'Podcast':
        return <Radio {...iconProps} />
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
    <SiteLayout location={location}>

      <main className="main-content blog-content">
        <div className="content-cards blog-cards">
          <div className="card card-primary blog-hero-card">
            <div className="blog-hero-header">
              <h1 className="blog-page-title">{t('blog.title')}</h1>
              <a href={locale === 'de' ? '/de/rss.xml' : '/rss.xml'} className="rss-link" aria-label={t('blog.rss')}>
                RSS
              </a>
            </div>
            <div className="blog-filters">
              <button
                className={`blog-filter blog-filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                {getFilterIcon('all')}
                <span>{t('blog.all')}</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`blog-filter blog-filter-item ${activeFilter === category ? 'active' : ''}`}
                  onClick={() => setActiveFilter(category)}
                >
                  {getFilterIcon(category)}
                  <span>{categoryLabel(locale, category)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {posts.length > 0 ? (
          <div className="blog-posts-grid">
            {posts.map((post) => {
              const translation = translationsBySlug.get(post.slug)
              const title = translation?.frontmatter.title || post.title
              const description = translation?.excerpt || post.description
              const readTime = translation?.frontmatter.readTime || post.metadata?.readTime
              const CardWrapper = post.isInternal ? Link : 'a'
              const cardProps = post.isInternal
                ? { to: translation ? `${localeHref('blog', locale).replace(/\/$/, '')}/${post.slug}` : `/blog/${post.slug}` }
                : { href: post.link, target: '_blank', rel: 'noopener noreferrer' }
              const showEnglishBadge = locale !== 'en' && post.isInternal && !translation
              const category = post.metadata?.category || 'Post'
              
              return (
                <CardWrapper
                  key={post.id}
                  {...cardProps}
                  className={`card ${post.featured ? 'card-primary' : 'card-secondary'} blog-card ${post.isInternal ? 'blog-card-internal' : 'blog-card-external'}${post.image ? ' blog-card-has-image' : ''}`}
                  aria-label={t('blog.viewPost').replace('{title}', title)}
                >
                  {post.image && !post.image.includes('via.placeholder.com') && (
                    <div className="blog-card-image-wrap">
                      <img src={post.image} alt="" className="blog-card-image" loading="lazy" />
                    </div>
                  )}
                  <div className="card-body blog-card-body">
                    <div className="card-header">
                      <span></span>
                      <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getCategoryIcon(category)}
                        <span>{categoryLabel(locale, category)}</span>
                        {showEnglishBadge && <span className="blog-lang-badge">{t('blog.englishBadge')}</span>}
                        {!post.isInternal && <span className="blog-lang-badge">{t('blog.external')}</span>}
                      </span>
                    </div>
                    <h2 className="blog-card-title">{title}</h2>
                    <p className="blog-card-description">{description}</p>
                    <div className="card-footer">
                      <span className="card-brand">
                        {new Date(post.date).toLocaleDateString(dateLocale(locale), {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {readTime && ` • ${readTime}`}
                      </span>
                    </div>
                  </div>
                </CardWrapper>
              )
            })}
          </div>
        ) : (
          <div className="blog-empty">
            <p className="mission-text">{t('blog.empty')}</p>
          </div>
        )}
      </main>
    </SiteLayout>
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
          locale
          translationOf
        }
      }
    }
  }
`

export const Head = (props) => {
  const locale = pageLocale(props.pageContext, props.location)
  const rss = locale === 'de' ? '/de/rss.xml' : '/rss.xml'
  return (
    <PageHead pageKey="blog" {...props}>
      <link rel="alternate" type="application/rss+xml" title="Decision Labs RSS Feed" href={rss} />
    </PageHead>
  )
}

