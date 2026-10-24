const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const localesDir = path.join(ROOT, 'src', 'i18n', 'locales')

function collect(value, prefix, output) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${prefix}[${index}]`, output))
    return
  }
  if (value && typeof value === 'object') {
    Object.keys(value).sort().forEach((key) => {
      const next = prefix ? `${prefix}.${key}` : key
      output.push(next)
      collect(value[key], next, output)
    })
  }
}

function keysOf(filePath) {
  const output = []
  collect(JSON.parse(fs.readFileSync(filePath, 'utf8')), '', output)
  return output
}

function checkLocaleParity() {
  const source = 'en'
  const sourceDir = path.join(localesDir, source)
  const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.json'))
  const locales = fs.readdirSync(localesDir).filter((name) => name !== source && fs.statSync(path.join(localesDir, name)).isDirectory())
  const missing = []

  locales.forEach((locale) => {
    files.forEach((file) => {
      const target = path.join(localesDir, locale, file)
      if (!fs.existsSync(target)) {
        missing.push(`${locale}/${file} is missing`)
        return
      }
      const sourceKeys = new Set(keysOf(path.join(sourceDir, file)))
      const targetKeys = new Set(keysOf(target))
      sourceKeys.forEach((key) => {
        if (!targetKeys.has(key)) missing.push(`${locale}/${file} missing ${key}`)
      })
    })
  })

  if (missing.length) {
    console.error(`❌ Locale key parity failed:\n${missing.map((item) => `  - ${item}`).join('\n')}`)
    process.exit(1)
  }

  console.log(`✅ Locale keys match across ${locales.join(', ')}`)
}

if (require.main === module) {
  checkLocaleParity()
}

module.exports = checkLocaleParity
