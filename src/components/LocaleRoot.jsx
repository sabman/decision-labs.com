import * as React from 'react'
import { navigate } from 'gatsby'
import { I18nProvider } from '../i18n/I18nProvider'
import {
  findPage,
  localeFromPath,
  normalizePath,
  queryLocale,
  readStoredLocale,
  storeLocale,
  switchTarget,
} from '../i18n/routes'

function resolveLocale(pathname, search, storedLocale) {
  const page = findPage(pathname)
  const requested = queryLocale(search)
  if (page?.shared) return requested || storedLocale || 'en'
  return localeFromPath(pathname)
}

const PageInfoContext = React.createContext({})

export function usePageInfo() {
  return React.useContext(PageInfoContext)
}

const LocaleRoot = ({ location, pageContext, children }) => {
  const pathname = location?.pathname || '/'
  const search = location?.search || ''
  const [storedLocale, setStoredLocale] = React.useState(null)
  const locale = resolveLocale(pathname, search, storedLocale)

  React.useEffect(() => {
    const requested = queryLocale(search)
    setStoredLocale(readStoredLocale())
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
    document.documentElement.dataset.locale = locale
    const props = { locale }
    if (typeof window.gtag === 'function') {
      window.gtag('set', 'user_properties', props)
    }
    if (typeof window.plausible === 'function') {
      window.plausible('pageview', { props })
    }
  }, [locale, pathname])

  return (
    <PageInfoContext.Provider value={pageContext || {}}>
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </PageInfoContext.Provider>
  )
}

export default LocaleRoot
