import * as React from 'react'
import { Link } from 'gatsby'
import { FileText, Mic, Handshake, BookOpen, Radio } from 'lucide-react'
import '../styles/global.css'
import postsData from '../data/posts.json'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { categoryLabel, localizedField } from '../i18n/content'
import { PageHead } from '../i18n/PageHead'

const IndexPage = ({ location }) => {
  const { locale, t } = useI18n()
  const [activeIndex, setActiveIndex] = React.useState(0)

  const featuredPosts = postsData.filter(post => post.featured === true)
  const postsToShow = featuredPosts.length > 0
    ? featuredPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
    : postsData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

  const currentPost = postsToShow[activeIndex]
  const currentTitle = localizedField(currentPost, 'title', locale)
  const currentDescription = localizedField(currentPost, 'description', locale)
  const currentPostImage = currentPost?.image && !currentPost.image.includes('via.placeholder.com')
    ? currentPost.image
    : null

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

  React.useEffect(() => {
    if (postsToShow.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % postsToShow.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [postsToShow.length])

  return (
    <SiteLayout location={location} className="landing-page">
      <main className="main-content">
        <div className="content-cards">
          <div className="card card-primary">
            <div className="card-header">
            </div>
            <div className="card-body">
              <p className="mission-text">
                {t('home.mission')}
              </p>
            </div>
          </div>

          <div
            className={`card card-secondary${currentPostImage ? ' card-has-bg-image' : ''}`}
            style={currentPostImage ? { backgroundImage: `url(${currentPostImage})` } : {}}
          >
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
                        <span>{categoryLabel(locale, currentPost.metadata.category)}</span>
                      </span>
                    ) : (
                      <span className="card-title">{t('home.featured')}</span>
                    )}
                  </div>
                  <div className="card-body featured-post-body">
                    <div className="featured-post-content">
                      <h3 className="featured-post-title">{currentTitle}</h3>
                      <p className="featured-post-description">{currentDescription}</p>
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
                        <span>{categoryLabel(locale, currentPost.metadata.category)}</span>
                      </span>
                    ) : (
                      <span className="card-title">{t('home.featured')}</span>
                    )}
                  </div>
                  <div className="card-body featured-post-body">
                    <div className="featured-post-content">
                      <h3 className="featured-post-title">{currentTitle}</h3>
                      <p className="featured-post-description">{currentDescription}</p>
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
                      <span>{categoryLabel(locale, currentPost.metadata.category)}</span>
                    </span>
                  ) : (
                    <span className="card-title">{t('home.featured')}</span>
                  )}
                </div>
                <div className="card-body featured-post-body">
                  {currentPost ? (
                    <div className="featured-post-content">
                      <h3 className="featured-post-title">{currentTitle}</h3>
                      <p className="featured-post-description">{currentDescription}</p>
                    </div>
                  ) : (
                    <p className="project-text">{t('home.empty')}</p>
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
                      aria-label={t('home.viewPost').replace('{n}', String(index + 1))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default IndexPage

export const Head = (props) => <PageHead pageKey="home" {...props} />
