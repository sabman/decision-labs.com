import React from 'react'
import ContourBackground from './src/components/ContourBackground'
import { localeFromPath } from './src/i18n/routes'

export const onRenderBody = ({ pathname, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: localeFromPath(pathname) })
}

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <ContourBackground />
      {element}
    </>
  )
}
