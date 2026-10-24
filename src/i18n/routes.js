const PUBLISHED_LOCALES = ['en', 'de']
const DEFAULT_LOCALE = 'en'
const LOCALE_STORAGE_KEY = 'dl-locale'

// French paths are reserved. Pages are created only for PUBLISHED_LOCALES.
const PAGES = [
  { key: 'home', paths: { en: '/', de: '/de/', fr: '/fr/' } },
  { key: 'about', paths: { en: '/about', de: '/de/ueber-uns', fr: '/fr/a-propos' }, nav: true },
  { key: 'blog', paths: { en: '/blog', de: '/de/blog', fr: '/fr/blog' }, nav: true },
  { key: 'contact', paths: { en: '/contact', de: '/de/kontakt', fr: '/fr/contact' }, nav: true },
  { key: 'customers', paths: { en: '/customers', de: '/de/kunden', fr: '/fr/clients' }, nav: true },
  { key: 'work', paths: { en: '/work', de: '/de/projekte', fr: '/fr/projets' }, nav: true },
  { key: 'newsletter', paths: { en: '/newsletter', de: '/de/newsletter', fr: '/fr/newsletter' } },
  { key: 'feed', paths: { en: '/feed', de: '/de/feed', fr: '/fr/fil' } },
  { key: 'impressum', paths: { en: '/impressum', de: '/impressum', fr: '/impressum' }, shared: true },
  { key: 'terms', paths: { en: '/terms', de: '/terms', fr: '/terms' }, shared: true },
]

const PAGE_COMPONENTS = {
  home: 'src/pages/index.jsx',
  about: 'src/pages/about.jsx',
  blog: 'src/pages/blog.jsx',
  contact: 'src/pages/contact.jsx',
  customers: 'src/pages/customers.jsx',
  work: 'src/pages/work.jsx',
  newsletter: 'src/pages/newsletter.jsx',
  feed: 'src/pages/feed.jsx',
}

function normalizePath(pathname = '/') {
  const withoutQuery = String(pathname).split('?')[0].split('#')[0]
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1)
  }
  return withoutQuery || '/'
}

function localeFromPath(pathname) {
  const path = normalizePath(pathname)
  if (path === '/de' || path.startsWith('/de/')) return 'de'
  if (path === '/fr' || path.startsWith('/fr/')) return 'fr'
  return DEFAULT_LOCALE
}

function findPage(pathname) {
  const path = normalizePath(pathname)
  return PAGES.find((page) =>
    Object.values(page.paths).some((candidate) => normalizePath(candidate) === path)
  ) || null
}

function localizedPath(pageKey, locale) {
  const page = PAGES.find((item) => item.key === pageKey)
  if (!page) return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`
  return page.paths[locale] || page.paths[DEFAULT_LOCALE]
}

function switchTarget(pathname, locale) {
  const page = findPage(pathname)
  if (!page) {
    if (/\/blog\/[^/]+$/.test(normalizePath(pathname))) return localizedPath('blog', locale)
    return localizedPath('home', locale)
  }
  if (page.shared) return `${normalizePath(pathname)}?lang=${locale}`
  return page.paths[locale] || page.paths[DEFAULT_LOCALE]
}

function localeHref(pageKey, locale) {
  const page = PAGES.find((item) => item.key === pageKey)
  const path = localizedPath(pageKey, locale)
  if (page?.shared && locale !== DEFAULT_LOCALE) {
    return `${normalizePath(path)}?lang=${locale}`
  }
  return path
}

function queryLocale(search = '') {
  const value = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search).get('lang')
  return PUBLISHED_LOCALES.includes(value) ? value : null
}

function readStoredLocale() {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return PUBLISHED_LOCALES.includes(value) ? value : null
  } catch (error) {
    return null
  }
}

function storeLocale(locale) {
  if (typeof window === 'undefined' || !PUBLISHED_LOCALES.includes(locale)) return
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch (error) {
    // Private browsing can block storage. The URL still carries the choice.
  }
}

module.exports = {
  PUBLISHED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  PAGES,
  PAGE_COMPONENTS,
  normalizePath,
  localeFromPath,
  findPage,
  localizedPath,
  switchTarget,
  localeHref,
  queryLocale,
  readStoredLocale,
  storeLocale,
}
