import * as React from 'react'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { PageHead } from '../i18n/PageHead'

const AboutPage = ({ location }) => {
  const { t } = useI18n()
  const steps = t('about.steps')
  // Scroll-triggered animations for process steps
  React.useEffect(() => {
    const processSteps = document.querySelectorAll('.process-step')
    
    if (processSteps.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Animate the connector line after a short delay
          const connector = entry.target.querySelector('.process-connector')
          if (connector) {
            setTimeout(() => {
              connector.classList.add('animate')
            }, 300)
          }
        }
      })
    }, observerOptions)

    processSteps.forEach((step) => {
      observer.observe(step)
    })

    return () => {
      processSteps.forEach((step) => {
        observer.unobserve(step)
      })
    }
  }, [])
  
  return (
    <SiteLayout location={location}>
      <main className="main-content about-content">
        <div className="content-cards about-cards">
          <div className="card card-primary about-main-card">
            <h1 className="about-page-title">{t('about.title')}</h1>
            <div className="card-body">
              <p className="mission-text">{t('about.mission')}</p>
            </div>
          </div>
        </div>

        <div className="about-process-section">
          <div className="content-cards about-cards">
            <div className="card card-secondary process-timeline-card">
              <div className="card-header">
                <span className="card-title">{t('about.processTitle')}</span>
              </div>
              <div className="card-body process-timeline-body">
                <div className="process-timeline">
                  <div className="process-step" data-step="1">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-1">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <rect x="20" y="20" width="60" height="60" rx="5" fill="currentColor" opacity="0.2"/>
                          <line x1="30" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="3"/>
                          <line x1="30" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="3"/>
                          <line x1="30" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="3"/>
                          <circle cx="75" cy="50" r="8" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">{steps[0].title}</h3>
                        <p className="process-step-description">{steps[0].description}</p>
                      </div>
                    </div>
                    <div className="process-connector">
                      <div className="process-connector-line"></div>
                    </div>
                  </div>

                  <div className="process-step" data-step="2">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-2">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.3"/>
                          <circle cx="50" cy="30" r="8" fill="currentColor" opacity="0.5"/>
                          <circle cx="70" cy="30" r="8" fill="currentColor" opacity="0.7"/>
                          <rect x="25" y="50" width="50" height="30" rx="3" fill="currentColor" opacity="0.2"/>
                          <line x1="35" y1="60" x2="65" y2="60" stroke="currentColor" strokeWidth="2"/>
                          <line x1="35" y1="70" x2="60" y2="70" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">{steps[1].title}</h3>
                        <p className="process-step-description">{steps[1].description}</p>
                      </div>
                    </div>
                    <div className="process-connector">
                      <div className="process-connector-line"></div>
                    </div>
                  </div>

                  <div className="process-step" data-step="3">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-3">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 20 50 Q 35 20, 50 50 T 80 50" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <circle cx="20" cy="50" r="4" fill="currentColor"/>
                          <circle cx="50" cy="50" r="4" fill="currentColor"/>
                          <circle cx="80" cy="50" r="4" fill="currentColor"/>
                          <rect x="40" y="70" width="20" height="15" rx="2" fill="currentColor" opacity="0.3"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">{steps[2].title}</h3>
                        <p className="process-step-description">{steps[2].description}</p>
                      </div>
                    </div>
                    <div className="process-connector">
                      <div className="process-connector-line"></div>
                    </div>
                  </div>

                  <div className="process-step" data-step="4">
                    <div className="process-step-content">
                      <div className="process-illustration illustration-4">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <rect x="20" y="20" width="25" height="35" rx="2" fill="currentColor" opacity="0.3"/>
                          <rect x="55" y="20" width="25" height="35" rx="2" fill="currentColor" opacity="0.3"/>
                          <line x1="45" y1="37" x2="55" y2="37" stroke="currentColor" strokeWidth="3"/>
                          <rect x="30" y="65" width="40" height="20" rx="2" fill="currentColor" opacity="0.2"/>
                          <line x1="35" y1="72" x2="65" y2="72" stroke="currentColor" strokeWidth="2"/>
                          <line x1="35" y1="78" x2="60" y2="78" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="process-step-text">
                        <h3 className="process-step-title">{steps[3].title}</h3>
                        <p className="process-step-description">{steps[3].description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default AboutPage

export const Head = (props) => <PageHead pageKey="about" {...props} />

