import * as React from 'react'
import { translate } from './catalogs'
import { PUBLISHED_LOCALES, PAGES, localeFromPath, localizedPath } from './routes'

const SITE_URL = 'https://decision-labs.com'
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.png`

export function pageLocale(pageContext, location) {
  return pageContext?.locale || localeFromPath(location?.pathname || '/')
}

export function absoluteUrl(urlPath) {
  if (!urlPath || urlPath === '/') return `${SITE_URL}/`
  const withSlash = urlPath.endsWith('/') ? urlPath : `${urlPath}/`
  return `${SITE_URL}${withSlash}`
}

export function PageHead({ pageKey, pageContext, location, children }) {
  const locale = pageLocale(pageContext, location)
  const title = translate(locale, `${pageKey}.metaTitle`)
  const description = translate(locale, `${pageKey}.metaDescription`)
  const page = PAGES.find((item) => item.key === pageKey) || null
  const url = page ? absoluteUrl(localizedPath(pageKey, locale)) : null
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Decision Labs',
    url: SITE_URL,
    email: 'team@decision-labs.com',
    availableLanguage: PUBLISHED_LOCALES,
  }

  return (
    <>
      <html lang={locale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {page && !page.shared && PUBLISHED_LOCALES.map((code) => (
        <link
          key={code}
          rel="alternate"
          href={absoluteUrl(page.paths[code])}
          {...{ hreflang: code }}
        />
      ))}
      {page && !page.shared && (
        <link rel="alternate" href={absoluteUrl(page.paths.en)} {...{ hreflang: 'x-default' }} />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Decision Labs" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      {children}
    </>
  )
}
