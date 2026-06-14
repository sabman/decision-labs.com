const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const CUSTOMERS_DIR = path.join(__dirname, '../src/images/customers')
const MAX_SIZE = 320

const RASTER_LOGOS = [
  { file: 'morgan-stanley.jpg', width: 320, height: 320 },
  { file: 'hugging-face.png', width: 320, height: 85 },
  { file: 'australian-government.jpg', width: 320, height: 240 },
]

async function optimizeRasterLogo({ file, width, height }) {
  const inputPath = path.join(CUSTOMERS_DIR, file)

  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️  Skipping missing logo: ${file}`)
    return null
  }

  const baseName = file.replace(/\.[^.]+$/, '')
  const webpPath = path.join(CUSTOMERS_DIR, `${baseName}.webp`)
  const ext = path.extname(file).slice(1).toLowerCase()
  const tempPath = `${inputPath}.optimized`

  const resized = sharp(inputPath).resize(MAX_SIZE, MAX_SIZE, {
    fit: 'inside',
    withoutEnlargement: true,
  })

  await resized.clone().webp({ quality: 82, effort: 4 }).toFile(webpPath)

  if (ext === 'jpg' || ext === 'jpeg') {
    await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(tempPath)
  } else if (ext === 'png') {
    await resized.clone().png({ compressionLevel: 9, palette: true }).toFile(tempPath)
  } else {
    throw new Error(`Unsupported raster format: ${file}`)
  }

  fs.renameSync(tempPath, inputPath)

  const webpSize = fs.statSync(webpPath).size
  const fallbackSize = fs.statSync(inputPath).size

  return {
    file,
    webpPath: `${baseName}.webp`,
    width,
    height,
    webpSize,
    fallbackSize,
  }
}

async function optimizeSvgLogo(file) {
  const inputPath = path.join(CUSTOMERS_DIR, file)

  if (!fs.existsSync(inputPath)) {
    return null
  }

  const originalSize = fs.statSync(inputPath).size
  let svg = fs.readFileSync(inputPath, 'utf8')

  svg = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()

  fs.writeFileSync(inputPath, svg, 'utf8')

  return {
    file,
    size: fs.statSync(inputPath).size,
    saved: originalSize - fs.statSync(inputPath).size,
  }
}

async function optimizeCustomerLogos() {
  const rasterResults = []

  for (const logo of RASTER_LOGOS) {
    rasterResults.push(await optimizeRasterLogo(logo))
  }

  const svgResults = []
  for (const file of ['esa.svg', 'naver.svg']) {
    const result = await optimizeSvgLogo(file)
    if (result) svgResults.push(result)
  }

  console.log('✅ Customer logos optimized for web:')
  rasterResults.filter(Boolean).forEach((result) => {
    console.log(
      `   ${result.file} → ${result.fallbackSize} bytes fallback, ${result.webpSize} bytes webp (${result.width}x${result.height})`
    )
  })
  svgResults.forEach((result) => {
    console.log(`   ${result.file} → ${result.size} bytes (${result.saved} bytes saved)`)
  })
}

module.exports = optimizeCustomerLogos

if (require.main === module) {
  optimizeCustomerLogos().catch((error) => {
    console.error('❌ Error optimizing customer logos:', error.message)
    process.exit(1)
  })
}
