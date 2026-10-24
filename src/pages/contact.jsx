import * as React from 'react'
import { Link } from 'gatsby'
import { Mail, Calendar } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { localeHref } from '../i18n/routes'
import { PageHead } from '../i18n/PageHead'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import '../styles/global.css'

const ContactPage = ({ location }) => {
  const { locale, t } = useI18n()

  return (
    <SiteLayout location={location}>

      <main className="main-content contact-content">
        <div className="content-cards contact-cards">
          <div className="card card-primary contact-main-card">
            <h1 className="contact-page-title">{t('contact.title')}</h1>
            <div className="card-body">
              <p className="mission-text">{t('contact.intro')}</p>
            </div>
            <div className="card-footer">
            </div>
          </div>

          <div className="contact-links-container">
            <div className="contact-links-grid">
              <a href="https://github.com/decision-labs/" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaGithub size={24} />
                </div>
                <div className="contact-link-label">GitHub</div>
              </a>
              <a href="mailto:team@decision-labs.com" className="contact-link-card">
                <div className="contact-link-icon">
                  <Mail size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">{t('contact.email')}</div>
              </a>
              <a href="https://www.linkedin.com/company/spacialdb-ug-decision-labs/" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaLinkedin size={24} />
                </div>
                <div className="contact-link-label">LinkedIn</div>
              </a>
              <a href="https://twitter.com/geobaseapp" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaXTwitter size={24} />
                </div>
                <div className="contact-link-label">Twitter</div>
              </a>
              <a href="https://cal.com/decision-labs" className="contact-link-card contact-link-card-wide" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <Calendar size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">{t('contact.book')}</div>
                <div className="contact-link-helper">{t('contact.bookHelper')}</div>
              </a>
              <Link to={localeHref('newsletter', locale)} className="contact-link-card contact-link-card-wide">
                <div className="contact-link-icon">
                  <Mail size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">{t('contact.newsletter')}</div>
                <div className="contact-link-helper">{t('contact.newsletterHelper')}</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default ContactPage

export const Head = (props) => <PageHead pageKey="contact" {...props} />

