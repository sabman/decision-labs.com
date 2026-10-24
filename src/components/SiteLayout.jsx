import * as React from 'react'
import { Link, navigate } from 'gatsby'
import Footer from './Footer'
import useHeaderContrast from './useHeaderContrast'
import { I18nProvider, useI18n } from '../i18n/I18nProvider'
import {
  PAGES,
  PUBLISHED_LOCALES,
  findPage,
  localeFromPath,
  localeHref,
  normalizePath,
  queryLocale,
  readStoredLocale,
  storeLocale,
  switchTarget,
} from '../i18n/routes'
import { translate } from '../i18n/catalogs'

function resolveLocale(pathname, search, storedLocale) {
  const page = findPage(pathname)
  const requested = queryLocale(search)
  if (page?.shared) return requested || storedLocale || 'en'
  return localeFromPath(pathname)
}

const LocaleSwitcher = ({ pathname, locale }) => {
  const { t } = useI18n()

  return (
    <nav className="locale-switcher" aria-label={t('common.switcherLabel')}>
      {PUBLISHED_LOCALES.map((code, index) => (
        <React.Fragment key={code}>
          {index > 0 && <span className="locale-switcher-sep" aria-hidden="true">·</span>}
          <Link
            to={switchTarget(pathname, code)}
            hrefLang={code}
            lang={code}
            className={code === locale ? 'active' : ''}
            aria-current={code === locale ? 'true' : undefined}
            onClick={() => storeLocale(code)}
          >
            {code.toUpperCase()}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  )
}

const LocaleHint = ({ pathname, onDismiss }) => {
  const copy = translate('de', 'common')

  return (
    <p className="locale-hint">
      <span>{copy.hint}</span>{' '}
      <Link to={switchTarget(pathname, 'de')} hrefLang="de" onClick={() => storeLocale('de')}>
        {copy.hintAction}
      </Link>
      <button type="button" onClick={onDismiss}>{copy.hintDismiss}</button>
    </p>
  )
}

const SiteHeader = ({ location, locale }) => {
  const headerRef = React.useRef(null)
  const textColor = useHeaderContrast(headerRef)
  const { t } = useI18n()
  const pathname = location?.pathname || ''
  const [showHint, setShowHint] = React.useState(false)
  const navPages = PAGES.filter((page) => page.nav)

  React.useEffect(() => {
    if (locale !== 'en' || readStoredLocale()) return
    const language = (navigator.languages && navigator.languages[0]) || navigator.language || ''
    if (language.toLowerCase().startsWith('de')) setShowHint(true)
  }, [locale, pathname])

  return (
    <header className="header" ref={headerRef}>
      <Link to={localeHref('home', locale)} className="logo" style={{ color: textColor }}>
        Decision Labs
      </Link>
      <div className="header-actions" style={{ color: textColor }}>
        <LocaleSwitcher pathname={pathname} locale={locale} />
        {showHint && (
          <LocaleHint
            pathname={pathname}
            onDismiss={() => {
              storeLocale('en')
              setShowHint(false)
            }}
          />
        )}
        <nav className="nav">
          {navPages.map((page) => {
            const to = page.paths[locale] || page.paths.en
            const active = normalizePath(pathname) === normalizePath(to)
            return (
              <Link key={page.key} to={to} className={active ? 'active' : ''}>
                {t(`common.nav.${page.key}`)}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

const SiteLayout = ({ children, location, className = '' }) => {
  const pathname = location?.pathname || '/'
  const search = location?.search || ''
  const [storedLocale, setStoredLocale] = React.useState(null)
  const locale = resolveLocale(pathname, search, storedLocale)

  React.useEffect(() => {
    const requested = queryLocale(search)
    const stored = readStoredLocale()
    setStoredLocale(stored)

    if (requested) storeLocale(requested)

    const page = findPage(pathname)
    if (requested && !page?.shared) {
      const target = switchTarget(pathname, requested)
      if (target !== `${normalizePath(pathname)}${search}`) {
        navigate(target, { replace: true })
      }
    }
  }, [pathname, search])

  React.useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <I18nProvider locale={locale}>
      <div className={`page-container${className ? ` ${className}` : ''}`}>
        <SiteHeader location={location} locale={locale} />
        {children}
        <Footer />
      </div>
    </I18nProvider>
  )
}

export default SiteLayout
