const { translate } = require('./catalogs')

const DATE_LOCALES = {
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
}

function dateLocale(locale) {
  return DATE_LOCALES[locale] || DATE_LOCALES.en
}

function localizedField(record, field, locale) {
  if (!record) return ''
  const suffix = locale === 'de' ? 'De' : locale === 'fr' ? 'Fr' : ''
  if (suffix && record[`${field}${suffix}`]) return record[`${field}${suffix}`]
  return record[field] || ''
}

function categoryLabel(locale, category) {
  if (!category) return ''
  const key = `common.categories.${category}`
  const value = translate(locale, key)
  return value === key ? category : value
}

module.exports = {
  dateLocale,
  localizedField,
  categoryLabel,
}
