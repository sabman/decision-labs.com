import * as React from 'react'
import { translate } from './catalogs'

const I18nContext = React.createContext({
  locale: 'en',
  t: (key) => translate('en', key),
})

export function I18nProvider({ locale, children }) {
  const value = React.useMemo(() => ({
    locale,
    t: (key) => translate(locale, key),
  }), [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return React.useContext(I18nContext)
}
