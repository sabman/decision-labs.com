import React from 'react'
import ContourBackground from './src/components/ContourBackground'
import LocaleRoot from './src/components/LocaleRoot'
import { localeFromPath } from './src/i18n/routes'

export const onRenderBody = ({ pathname, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: localeFromPath(pathname) })
}

export const wrapPageElement = ({ element, props }) => {
  return (
    <>
      <ContourBackground />
      <LocaleRoot location={props.location} pageContext={props.pageContext}>{element}</LocaleRoot>
    </>
  )
}
