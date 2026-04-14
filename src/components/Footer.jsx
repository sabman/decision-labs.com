import * as React from 'react'
import '../styles/global.css'

const Footer = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  const footerRef = React.useRef(null)

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
            <h3 className="footer-column-title">Legal</h3>
            <a href="/impressum" className="footer-link">Impressum</a>
            <a href="/terms" className="footer-link">Terms & Conditions</a>
            <p className="footer-copyright">© 2025 SpacialDB UG. All rights reserved.</p>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Contact</h3>
            <a href="mailto:team@decision-labs.com" className="footer-link footer-link-external">team@decision-labs.com</a>
            <a href="/contact" className="footer-link">Book a Call</a>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Follow</h3>
            <a href="https://linkedin.com/company/decision-labs" target="_blank" rel="noopener noreferrer" className="footer-link footer-link-external">LinkedIn</a>
            <a href="https://github.com/decision-labs" target="_blank" rel="noopener noreferrer" className="footer-link footer-link-external">GitHub</a>
            <a href="/feed" className="footer-link footer-link-follow">Feed</a>

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
