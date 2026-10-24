import * as React from 'react'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { dateLocale, localizedField } from '../i18n/content'
import { PageHead } from '../i18n/PageHead'
import projectsData from '../data/projects.json'

// Import project images
import geobaseImage from '../images/geobase-hero.png'
import earthgptImage from '../images/earthgpt-hero.jpg'
import verisatImage from '../images/verisat-heropng.png'
import geoaiImage from '../images/geoai-hero.png'
import edgeImage from '../images/edge-hero.png'

// Map project IDs to images
const projectImages = {
  '1': geobaseImage,
  '2': earthgptImage,
  '3': verisatImage,
  '4': geoaiImage,
  '5': edgeImage,
}

// Work Card Component
const WorkCard = ({ project, projectImage }) => {
  const { locale, t } = useI18n()
  const videoRef = React.useRef(null)
  const title = localizedField(project, 'title', locale)
  const description = localizedField(project, 'description', locale)
  
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
      className={`card card-primary work-card${project.featured ? ' work-card-featured' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="work-card-content">
        <div className="work-card-text">
          <div className="card-body work-card-body">
            {project.featured && (
              <span className="work-card-badge">{t('work.badge')}</span>
            )}
            <h2 className="work-card-title">{title}</h2>
            <p className="work-card-description">{description}</p>
          </div>
          <div className="card-footer">
            <div className="work-card-footer-content">
              <span className="card-brand">
                {new Date(project.date).toLocaleDateString(dateLocale(locale), {
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
            alt={title}
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
            aria-label={t('work.viewProjectAria')}
          >
            {t('work.viewProject')} ↗
          </a>
        </div>
      </div>
    </div>
  )
}

const WorkPage = ({ location }) => {
  const { t } = useI18n()
  const projects = [...projectsData].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1
    }
    return new Date(b.date) - new Date(a.date)
  })

  return (
    <SiteLayout location={location}>

      <main className="main-content work-content">
        <div className="content-cards work-cards">
          <div className="card card-primary work-hero-card">
            <div className="work-hero-header">
              <h1 className="work-page-title">{t('work.title')}</h1>
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
            <p className="mission-text">{t('work.empty')}</p>
          </div>
        )}
      </main>
    </SiteLayout>
  )
}

export default WorkPage

export const Head = (props) => <PageHead pageKey="work" {...props} />

