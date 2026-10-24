const enCommon = require('./locales/en/common.json')
const deCommon = require('./locales/de/common.json')
const enHome = require('./locales/en/home.json')
const deHome = require('./locales/de/home.json')
const enAbout = require('./locales/en/about.json')
const deAbout = require('./locales/de/about.json')
const enWork = require('./locales/en/work.json')
const deWork = require('./locales/de/work.json')
const enCustomers = require('./locales/en/customers.json')
const deCustomers = require('./locales/de/customers.json')
const enContact = require('./locales/en/contact.json')
const deContact = require('./locales/de/contact.json')
const enNewsletter = require('./locales/en/newsletter.json')
const deNewsletter = require('./locales/de/newsletter.json')
const enNotFound = require('./locales/en/notFound.json')
const deNotFound = require('./locales/de/notFound.json')
const enFeed = require('./locales/en/feed.json')
const deFeed = require('./locales/de/feed.json')
const enBlog = require('./locales/en/blog.json')
const deBlog = require('./locales/de/blog.json')

const catalogs = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    work: enWork,
    customers: enCustomers,
    contact: enContact,
    newsletter: enNewsletter,
    notFound: enNotFound,
    feed: enFeed,
    blog: enBlog,
  },
  de: {
    common: deCommon,
    home: deHome,
    about: deAbout,
    work: deWork,
    customers: deCustomers,
    contact: deContact,
    newsletter: deNewsletter,
    notFound: deNotFound,
    feed: deFeed,
    blog: deBlog,
  },
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
