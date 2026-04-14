import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import Footer from '../components/Footer'

const DesignSystemPage = ({ location }) => {
  const pathname = location?.pathname || ''
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)

  // Detect background color behind header (throttled for performance)
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

  const colors = [
    { name: 'Black', variable: '--color-black', value: '#000', description: 'Primary text color' },
    { name: 'White', variable: '--color-white', value: '#fff', description: 'Background and light text' },
    { name: 'Gray', variable: '--color-gray', value: '#f5f5f5', description: 'Secondary background' },
    { name: 'Beige', variable: '--color-beige', value: '#faf8f5', description: 'Page background pattern' },
    { name: 'Secondary Text', variable: '--color-secondary-text', value: '#666', description: 'Muted text color' },
    { name: 'Process 1', variable: '--color-process-1', value: '#6366f1', description: 'Indigo - Process step 1' },
    { name: 'Process 2', variable: '--color-process-2', value: '#8b5cf6', description: 'Purple - Process step 2' },
    { name: 'Process 3', variable: '--color-process-3', value: '#ec4899', description: 'Pink - Process step 3' },
    { name: 'Process 4', variable: '--color-process-4', value: '#f59e0b', description: 'Amber - Process step 4' },
  ]

  const typographySamples = [
    { name: 'Heading 1', className: 'mission-text', example: 'Decision Labs', size: '2.5rem', weight: '600' },
    { name: 'Heading 2', className: 'process-section-title', example: 'Our Process', size: '2rem', weight: '600' },
    { name: 'Heading 3', className: 'card-title', example: 'Card Title', size: '1rem', weight: '400' },
    { name: 'Body Text', className: '', example: 'We build AI-driven products, train custom models, and create intelligent systems.', size: '1rem', weight: '400' },
    { name: 'Small Text', className: 'card-brand', example: 'Decision Labs', size: '0.875rem', weight: '400' },
    { name: 'Code', className: '', example: 'const example = "code";', size: '1rem', weight: '400', font: 'Fira Code' },
  ]

  return (
    <div className="page-container">
      <header className="header" ref={headerRef}>
        <Link to="/" className="logo" style={{ color: textColor }}>Decision Labs</Link>
        <nav className="nav">
          <Link to="/about" className={pathname === '/about' || pathname === '/about/' ? 'active' : ''}>About</Link>
          <Link to="/blog" className={pathname === '/blog' || pathname === '/blog/' ? 'active' : ''}>Blog</Link>
          <Link to="/contact" className={pathname === '/contact' || pathname === '/contact/' ? 'active' : ''}>Contact</Link>
          <Link to="/work" className={pathname === '/work' || pathname === '/work/' ? 'active' : ''}>Work</Link>
        </nav>
      </header>

      <main className="main-content" style={{ paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '3rem' }}>Design System</h1>

        {/* Colors Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem' }}>Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {colors.map((color) => (
              <div key={color.variable} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '100%',
                    height: '120px',
                    backgroundColor: color.value,
                    borderRadius: '12px',
                    border: color.value === '#fff' ? '1px solid #e0e0e0' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color.value === '#000' || color.value === '#666' ? '#fff' : '#000',
                    fontWeight: '600',
                  }}
                >
                  {color.value}
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{color.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', fontFamily: 'Fira Code, monospace' }}>
                    {color.variable}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '0.25rem' }}>
                    {color.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem' }}>Typography</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Font Families</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Inter</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', lineHeight: '1.6' }}>
                  The quick brown fox jumps over the lazy dog
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginTop: '0.5rem' }}>
                  Primary font for UI and body text
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Fira Code</div>
                <div style={{ fontFamily: 'Fira Code, monospace', fontSize: '1.5rem', lineHeight: '1.6' }}>
                  const example = "code";
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginTop: '0.5rem' }}>
                  Monospace font for code and technical content
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Type Scale</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {typographySamples.map((type, index) => (
                <div key={index} style={{ padding: '1rem', backgroundColor: 'var(--color-gray)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{type.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', fontFamily: 'Fira Code, monospace' }}>
                        {type.size} / {type.weight} {type.font && `(${type.font})`}
                      </div>
                    </div>
                  </div>
                  <div
                    className={type.className}
                    style={{
                      fontFamily: type.font === 'Fira Code' ? 'Fira Code, monospace' : 'inherit',
                    }}
                  >
                    {type.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem' }}>Components</h2>

          {/* Cards */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Cards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.5rem' }}>
              <div className="card card-primary" style={{ gridColumn: 'span 3', minHeight: '300px' }}>
                <div className="card-header">
                  <span className="card-title">Primary Card</span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.3' }}>
                    This is a primary card with black background and white text.
                  </p>
                </div>
                <div className="card-footer">
                  <span className="card-brand">Decision Labs</span>
                </div>
              </div>

              <div className="card card-secondary" style={{ gridColumn: 'span 3', minHeight: '300px' }}>
                <div className="card-header">
                  <span className="card-title">Secondary Card</span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.3' }}>
                    This is a secondary card with gray background and black text.
                  </p>
                </div>
                <div className="card-footer">
                  <span className="card-brand">Decision Labs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Process Cards */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Process Cards</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div className="card process-card process-card-1" style={{ minHeight: '250px' }}>
                <div className="card-header">
                  <span className="card-title">1</span>
                </div>
                <div className="card-body process-card-body">
                  <h3 className="process-card-title">Process Card 1</h3>
                  <p className="process-card-description">
                    Example of a process card with indigo background.
                  </p>
                </div>
              </div>

              <div className="card process-card process-card-2" style={{ minHeight: '250px' }}>
                <div className="card-header">
                  <span className="card-title">2</span>
                </div>
                <div className="card-body process-card-body">
                  <h3 className="process-card-title">Process Card 2</h3>
                  <p className="process-card-description">
                    Example of a process card with purple background.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--color-gray)', borderRadius: '12px' }}>
              <a href="#" style={{ fontSize: '1rem' }}>Standard Link</a>
              <a href="#" className="footer-link">Footer Link Style</a>
              <a href="#" className="rss-link">RSS Link Style (Uppercase)</a>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Navigation</h3>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-gray)', borderRadius: '12px' }}>
              <nav className="nav" style={{ alignItems: 'flex-start' }}>
                <a href="#" style={{ color: 'var(--color-black)' }}>About</a>
                <a href="#" className="active" style={{ color: 'var(--color-black)' }}>Blog</a>
                <a href="#" style={{ color: '#999' }}>Contact</a>
                <a href="#" style={{ color: '#999' }}>Work</a>
              </nav>
            </div>
          </div>

          {/* Buttons / Indicators */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Buttons & Indicators</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--color-gray)', borderRadius: '12px', flexWrap: 'wrap' }}>
              <button className="tab-indicator"></button>
              <button className="tab-indicator active"></button>
              <button className="tab-indicator"></button>
            </div>
          </div>

          {/* Logo */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Logo</h3>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-gray)', borderRadius: '12px' }}>
              <Link to="/" className="logo">Decision Labs</Link>
            </div>
          </div>
        </section>

        {/* Spacing & Layout */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem' }}>Spacing & Layout</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Grid System</h3>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-gray)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginBottom: '1rem', fontFamily: 'Fira Code, monospace' }}>
                  Grid: 6 columns with 14px-2rem gap
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} style={{ padding: '1rem', backgroundColor: 'var(--color-white)', borderRadius: '8px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Max Width</h3>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-gray)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', fontFamily: 'Fira Code, monospace' }}>
                  --max-width: 1200px
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Gutter</h3>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-gray)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', fontFamily: 'Fira Code, monospace' }}>
                  --gutter: 20px
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default DesignSystemPage

export const Head = () => <title>Design System - Decision Labs</title>
