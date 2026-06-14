import * as React from 'react'
import { Link } from 'gatsby'
import { useForm, ValidationError } from '@formspree/react'
import '../styles/global.css'
import Footer from '../components/Footer'

const NewsletterForm = () => {
  const [state, handleSubmit] = useForm('xqejrwpy')

  if (state.succeeded) {
    return (
      <div className="contact-form-success" role="status">
        <h2 className="contact-form-title">You are subscribed</h2>
        <p className="contact-form-success-text">
          Thanks for subscribing. We will send occasional updates from Decision Labs.
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2 className="contact-form-title">Subscribe to Newsletter</h2>
      <input type="hidden" name="_subject" value="Newsletter signup" />
      <input type="hidden" name="form_type" value="newsletter" />

      <div className="contact-form-field">
        <label htmlFor="newsletter-name">
          Name <span className="contact-form-optional">(optional)</span>
        </label>
        <input id="newsletter-name" type="text" name="name" autoComplete="name" />
        <ValidationError prefix="Name" field="name" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="contact-form-field">
        <label htmlFor="newsletter-email">Email</label>
        <input id="newsletter-email" type="email" name="email" autoComplete="email" required />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="newsletter-consent">
        <input id="newsletter-consent" type="checkbox" name="consent" required />
        <label htmlFor="newsletter-consent">I agree to receive email updates from Decision Labs.</label>
      </div>

      <ValidationError errors={state.errors} className="contact-form-error" />

      <button type="submit" className="contact-form-submit" disabled={state.submitting}>
        {state.submitting ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  )
}

const NewsletterPage = ({ location }) => {
  const pathname = location?.pathname || ''
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)

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
            if (
              currentElement.classList &&
              (currentElement.classList.contains('card-secondary') ||
                currentElement.classList.contains('page-container'))
            ) {
              setTextColor('black')
              ticking = false
              return
            }
            currentElement = currentElement.parentElement
          }

          setTextColor('black')
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
        <Link to="/" className="logo" style={{ color: textColor }}>
          Decision Labs
        </Link>
        <nav className="nav">
          <Link to="/about" className={pathname === '/about' || pathname === '/about/' ? 'active' : ''}>
            About
          </Link>
          <Link to="/blog" className={pathname === '/blog' || pathname === '/blog/' ? 'active' : ''}>
            Blog
          </Link>
          <Link
            to="/contact"
            className={pathname === '/contact' || pathname === '/contact/' ? 'active' : ''}
          >
            Contact
          </Link>
          <Link
            to="/customers"
            className={pathname === '/customers' || pathname === '/customers/' ? 'active' : ''}
          >
            Customers
          </Link>
          <Link to="/work" className={pathname === '/work' || pathname === '/work/' ? 'active' : ''}>
            Work
          </Link>
        </nav>
      </header>

      <main className="main-content newsletter-content">
        <div className="content-cards newsletter-cards">
          <div className="card card-primary newsletter-main-card">
            <h1 className="contact-page-title">Newsletter</h1>
            <div className="card-body">
              <p className="mission-text newsletter-lede">
                Monthly insights on geospatial data products, AI workflows, and practical lessons from our client work.
              </p>
            </div>
          </div>

          <div className="card card-secondary newsletter-form-card">
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NewsletterPage

export const Head = () => <title>Newsletter - Decision Labs</title>
