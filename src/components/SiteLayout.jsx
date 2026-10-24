import * as React from 'react'
import { Link } from 'gatsby'
import Footer from './Footer'
import useHeaderContrast from './useHeaderContrast'

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
  { to: '/customers', label: 'Customers' },
  { to: '/work', label: 'Work' },
]

function isActive(pathname, to) {
  if (!pathname) return false
  return pathname === to || pathname === `${to}/`
}

const SiteLayout = ({ children, location, className = '' }) => {
  const headerRef = React.useRef(null)
  const textColor = useHeaderContrast(headerRef)
  const pathname = location?.pathname || ''

  return (
    <div className={`page-container${className ? ` ${className}` : ''}`}>
      <header className="header" ref={headerRef}>
        <Link to="/" className="logo" style={{ color: textColor }}>Decision Labs</Link>
        <nav className="nav">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={isActive(pathname, item.to) ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <Footer />
    </div>
  )
}

export default SiteLayout
