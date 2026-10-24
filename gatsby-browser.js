import React from 'react'
import ContourBackground from './src/components/ContourBackground'
import { localeFromPath } from './src/i18n/routes'

export const onRouteUpdate = ({ location }) => {
  document.documentElement.lang = localeFromPath(location.pathname)
}

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <ContourBackground />
      {element}
    </>
  )
}
