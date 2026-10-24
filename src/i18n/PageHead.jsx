import * as React from 'react'
import { translate } from './catalogs'
import { localeFromPath, localizedPath } from './routes'

const SITE_URL = 'https://decision-labs.com'
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.png`

export function pageLocale(pageContext, location) {
  return pageContext?.locale || localeFromPath(location?.pathname || '/')
}

export function PageHead({ pageKey, pageContext, location, children }) {
  const locale = pageLocale(pageContext, location)
  const title = translate(locale, `${pageKey}.metaTitle`)
  const description = translate(locale, `${pageKey}.metaDescription`)
  const path = localizedPath(pageKey, locale)
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`

  return (
    <>
      <html lang={locale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Decision Labs" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      {children}
    </>
  )
}
