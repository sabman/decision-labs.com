const enCommon = require('./locales/en/common.json')
const deCommon = require('./locales/de/common.json')

const catalogs = {
  en: { common: enCommon },
  de: { common: deCommon },
}

function lookup(locale, key) {
  const [namespace, ...rest] = key.split('.')
  let node = catalogs[locale]?.[namespace]
  if (!rest.length) return node
  for (const part of rest) {
    if (node == null || typeof node !== 'object') return undefined
    node = node[part]
  }
  return node
}

function translate(locale, key) {
  const value = lookup(locale, key)
  if (value !== undefined) return value
  const fallback = lookup('en', key)
  return fallback === undefined ? key : fallback
}

module.exports = {
  catalogs,
  translate,
}
