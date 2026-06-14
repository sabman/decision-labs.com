import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import customersData from '../data/customers.json'
import Footer from '../components/Footer'
import CustomerLogo from '../components/CustomerLogo'

const CustomersPage = ({ location }) => {
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
            if (currentElement.classList && (
              currentElement.classList.contains('card-secondary') ||
              currentElement.classList.contains('page-container')
            )) {
              setTextColor('black')
              ticking = false
              return
            }
            currentElement = currentElement.parentElement
          }

          const bgColor = window.getComputedStyle(elementBelow).backgroundColor
          if (bgColor) {
            const rgb = bgColor.match(/\d+/g)
            if (rgb && rgb.length >= 3) {
              const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3
              setTextColor(brightness < 128 ? 'white' : 'black')
            } else {
              setTextColor('black')
            }
          } else {
            setTextColor('black')
          }
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
        <Link to="/" className="logo" style={{ color: textColor }}>Decision Labs</Link>
        <nav className="nav">
          <Link to="/about" className={pathname === '/about' || pathname === '/about/' ? 'active' : ''}>About</Link>
          <Link to="/blog" className={pathname === '/blog' || pathname === '/blog/' ? 'active' : ''}>Blog</Link>
          <Link to="/contact" className={pathname === '/contact' || pathname === '/contact/' ? 'active' : ''}>Contact</Link>
          <Link to="/customers" className={pathname === '/customers' || pathname === '/customers/' ? 'active' : ''}>Customers</Link>
          <Link to="/work" className={pathname === '/work' || pathname === '/work/' ? 'active' : ''}>Work</Link>
        </nav>
      </header>

      <main className="main-content customers-content">
        <div className="content-cards customers-cards">
          <div className="card card-primary customers-hero-card">
            <h1 className="customers-page-title">Customers</h1>
            <div className="card-body">
              <p className="mission-text">
                We work with leading organizations across finance, government, space, and technology — from custom AI products to geospatial infrastructure on Geobase.
              </p>
            </div>
          </div>
        </div>

        <div className="customers-grid">
          {customersData.map((customer) => (
            <div key={customer.id} className="card card-secondary customer-card">
              <div className="customer-card-body">
                <div className="customer-logo">
                  <CustomerLogo customerId={customer.id} name={customer.name} />
                </div>
                <h2 className="customer-name">{customer.name}</h2>
                <span className="customer-category">{customer.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="content-cards customers-cards">
          <div className="card card-secondary customers-migration-card">
            <div className="card-body">
              <p className="mission-text">
                Many teams have moved from CartoDB to Geobase for Postgres-native geospatial infrastructure — lower cost, full data ownership, and modern AI workflows.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CustomersPage

export const Head = () => <title>Customers - Decision Labs</title>
