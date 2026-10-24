import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import { useI18n } from '../i18n/I18nProvider'
import { localeHref } from '../i18n/routes'

const Footer = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  const footerRef = React.useRef(null)
  const { locale, t } = useI18n()
  const currentYear = new Date().getFullYear()
  const copyrightYears = currentYear > 2012 ? `2012-${currentYear}` : '2012'

  React.useEffect(() => {
    let ticking = false
    const checkVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!footerRef.current) {
            ticking = false
            return
          }

          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop

          const isShortPage = documentHeight <= windowHeight + 100

          if (isShortPage) {
            setIsVisible(scrollTop > 10)
          } else {
            const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
            setIsVisible(distanceFromBottom < 500)
          }
          ticking = false
        })
        ticking = true
      }
    }

    const timeoutId = setTimeout(checkVisibility, 100)
    checkVisibility()

    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  return (
    <footer
      ref={footerRef}
      className={`site-footer ${isVisible ? 'visible' : ''}`}
    >
      <div className="footer-content">
        <div className="footer-columns">
          <div className="footer-column">
            <h3 className="footer-column-title">{t('common.footer.legal')}</h3>
            <Link to={localeHref('impressum', locale)} className="footer-link">{t('common.footer.impressum')}</Link>
            <Link to={localeHref('terms', locale)} className="footer-link">{t('common.footer.terms')}</Link>
            <p className="footer-copyright">© {copyrightYears} SpacialDB UG. {t('common.footer.rights')}</p>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">{t('common.footer.contact')}</h3>
            <a href="mailto:team@decision-labs.com" className="footer-link footer-link-external">team@decision-labs.com</a>
            <Link to={localeHref('contact', locale)} className="footer-link">{t('common.footer.book')}</Link>
            <Link to={localeHref('newsletter', locale)} className="footer-link">{t('common.footer.newsletter')}</Link>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">{t('common.footer.follow')}</h3>
            <a href="https://www.linkedin.com/company/spacialdb-ug-decision-labs" target="_blank" rel="noopener noreferrer" className="footer-link footer-link-external">LinkedIn</a>
            <a href="https://github.com/decision-labs/" target="_blank" rel="noopener noreferrer" className="footer-link footer-link-external">GitHub</a>
            <Link to={localeHref('feed', locale)} className="footer-link footer-link-follow">{t('common.footer.feed')}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
        </div>
      </div>
    </footer>
  )
}

export default Footer
