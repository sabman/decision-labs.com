const fs = require('fs')
const path = require('path')

const SITE_URL = 'https://decision-labs.com'
const ROOT = path.join(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const LLM_DIR = path.join(PUBLIC_DIR, 'llm')

const ABOUT_PROCESS = [
  {
    title: 'Scoping & Architecture Design',
    description:
      'First, we need to understand your problem better. Once we determine there is a fit for Machine Learning, we will work closely together to prepare a roadmap, review the scientific literature, and determine requirements.',
  },
  {
    title: 'Data Collection & Exploration',
    description:
      "Machine Learning needs data. If you have data needed to train the models, we will perform an exploratory analysis phase to find patterns and correlations. If you don't, we will collect the data for you using online sources (if possible).",
  },
  {
    title: 'Model Development',
    description:
      'We run thousands of experiments in parallel to develop a machine learning model. A model is the core of a machine learning system - trained on historical data it can predict the future trends or understand the semantics of a text.',
  },
  {
    title: 'Full-stack application development',
    description:
      'We integrate the model with a REST API or a front-end application, developing all necessary features to access the model in an user-friendly way. Scalable and with the state-of-the-art security.',
  },
]

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'))
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function pageHeader(title, htmlPath, description) {
  return `# ${title}

> ${description}

- HTML: ${SITE_URL}${htmlPath}
- LLM: ${SITE_URL}/llm${htmlPath === '/' ? '/index' : htmlPath}.md

`
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return { frontmatter: {}, body: raw }
  }

  const frontmatter = {}
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    frontmatter[key] = value
  })

  return { frontmatter, body: match[2] }
}

function normalizeMarkdownBody(body) {
  return body
    .replace(/\r\n/g, '\n')
    .replace(/!\[([^\]]*)\]\((\/[^)]+)\)/g, `![$1](${SITE_URL}$2)`)
    .replace(/<iframe[^>]*src="([^"]+)"[^>]*>\s*<\/iframe>/gi, (_, src) => `\n\n[Video: ${src}](${src})\n\n`)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function loadInternalBlogPosts() {
  const blogDir = path.join(ROOT, 'src', 'blog')
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.md') && file !== 'placeholder.md')
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf8')
      const { frontmatter, body } = parseFrontmatter(raw)
      const slug = frontmatter.slug || file.replace(/\.md$/, '')

      return {
        slug,
        title: frontmatter.title || slug,
        date: frontmatter.date || '',
        author: frontmatter.author || 'Decision Labs',
        category: frontmatter.category || frontmatter.metadata?.category || 'Blog',
        description: frontmatter.description || '',
        body: normalizeMarkdownBody(body),
      }
    })
}

function buildIndexPage(posts) {
  const featured = posts
    .filter((post) => post.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const featuredList = featured
    .map((post) => {
      const link = post.linkType === 'internal' || (post.link && post.link.startsWith('/'))
        ? `${SITE_URL}${post.link}`
        : post.link
      return `- **${post.title}** (${post.date}) — ${post.description}\n  - Link: ${link}`
    })
    .join('\n')

  return `${pageHeader(
    'Decision Labs',
    '/',
    'AI-driven products, custom ML models, and geospatial infrastructure from concept to deployment.'
  )}## Summary

Decision Labs builds AI-driven products, trains custom models, and creates intelligent systems that turn complex data into actionable insights. We also operate Geobase, a Postgres-native geospatial platform used by enterprise and government teams.

## Featured content

${featuredList || '- No featured content listed.'}

## Key links

- Work and products: ${SITE_URL}/work
- Customers: ${SITE_URL}/customers
- Blog: ${SITE_URL}/blog
- Contact: ${SITE_URL}/contact
- Book a call: https://cal.com/decision-labs
- Email: team@decision-labs.com
`
}

function buildAboutPage() {
  const process = ABOUT_PROCESS.map(
    (step, index) => `### ${index + 1}. ${step.title}\n\n${step.description}`
  ).join('\n\n')

  return `${pageHeader(
    'About Decision Labs',
    '/about',
    'Consulting on digital transformation, analytics, and data science capabilities.'
  )}## Mission

We help our clients achieve efficiencies through digital transformation, develop analytics and data science capabilities.

## Our process

${process}
`
}

function buildWorkPage(projects) {
  const projectList = projects
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((project) => {
      const tech = project.metadata?.technologies?.join(', ') || ''
      return `### ${project.title}

${project.description}

- URL: ${project.link}
- Category: ${project.metadata?.category || 'Product'}
- Technologies: ${tech}`
    })
    .join('\n\n')

  return `${pageHeader(
    'Work',
    '/work',
    'Products and platforms built by Decision Labs, including Geobase, EarthGPT, Verisat.ai, and GeoAI.js.'
  )}## Metrics

- 12+ AI products
- 50+ models trained
- 3 research partnerships

## Projects

${projectList}
`
}

function buildCustomersPage(customers) {
  const customerList = customers
    .map((customer) => `- **${customer.name}** — ${customer.category}`)
    .join('\n')

  return `${pageHeader(
    'Customers',
    '/customers',
    'Organizations that work with Decision Labs on AI, geospatial infrastructure, and analytics.'
  )}## Customers

${customerList}

## CartoDB to Geobase migrations

Many teams have moved from CartoDB to Geobase for Postgres-native geospatial infrastructure — lower cost, full data ownership, and modern AI workflows.
`
}

function buildContactPage() {
  return `${pageHeader(
    'Contact',
    '/contact',
    'Reach Decision Labs to discuss AI, geospatial, or analytics projects.'
  )}## Get in touch

Let's discuss how we can help transform your data into actionable insights.

- Email: team@decision-labs.com
- Book a call: https://cal.com/decision-labs (30-minute consultation, free, no commitment)
- GitHub: https://github.com/decision-labs/
- LinkedIn: https://www.linkedin.com/company/spacialdb-ug-decision-labs/
- Twitter/X: https://twitter.com/geobaseapp
- Newsletter: ${SITE_URL}/newsletter
`
}

function buildNewsletterPage() {
  return `${pageHeader(
    'Newsletter',
    '/newsletter',
    'Monthly insights on geospatial data products, AI workflows, and client work.'
  )}Subscribe at ${SITE_URL}/newsletter for monthly updates on geospatial data products, AI workflows, and practical lessons from our client work.
`
}

function buildFeedPage() {
  return `${pageHeader(
    'Feed',
    '/feed',
    'Combined feed of Decision Labs blog posts and updates.'
  )}The feed page aggregates recent posts and updates from Decision Labs. RSS is also available at ${SITE_URL}/rss.xml.
`
}

function buildImpressumPage() {
  return `${pageHeader(
    'Impressum',
    '/impressum',
    'Legal imprint for SpacialDB UG (Decision Labs), Berlin, Germany.'
  )}## Handelsregister

HRB 143970 B

Registergericht: Amtsgericht Charlottenburg (Berlin)

Vertreten durch: Kashif Rasul Shoaib Burq

## Kontakt

Telefon: 015778921979

E-Mail: support@decision-labs.com

## Umsatzsteuer-ID

Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE286113991
`
}

function buildTermsPage() {
  return `${pageHeader(
    'Terms & Conditions',
    '/terms',
    'Privacy policy and terms for decision-labs.com (German legal text on the website).'
  )}This page contains German-language terms, privacy policy, and data protection information for SpacialDB UG (Decision Labs).

For the complete legal text, use the HTML version at ${SITE_URL}/terms.

Operator: SpacialDB UG, Chausseestr 105, 10115 Berlin, Germany.
`
}

function buildBlogIndexPage(postsJson, internalPosts) {
  const externalPosts = postsJson
    .filter((post) => post.link && post.link.startsWith('http'))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const internalEntries = internalPosts
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/llm/blog/${post.slug}.md) (${post.date}) — ${post.category}\n  - HTML: ${SITE_URL}/blog/${post.slug}`
    )
    .join('\n')

  const externalEntries = externalPosts
    .map((post) => {
      const category = post.metadata?.category || 'Blog'
      return `- **${post.title}** (${post.date}) — ${category}\n  - ${post.description}\n  - Link: ${post.link}`
    })
    .join('\n')

  return `${pageHeader(
    'Blog',
    '/blog',
    'Posts, talks, podcasts, and partnerships from Decision Labs.'
  )}## Internal posts (full LLM markdown available)

${internalEntries || '- No internal posts.'}

## External posts and media

${externalEntries || '- No external posts.'}
`
}

function buildBlogPostPage(post) {
  return `${pageHeader(
    post.title,
    `/blog/${post.slug}`,
    post.description || `Blog post by ${post.author}.`
  )}- Published: ${post.date}
- Author: ${post.author}
- Category: ${post.category}

${post.body}
`
}

function buildLlmsTxt(pages, blogPosts) {
  const pageLinks = pages
    .map((page) => `- [${page.title}](${SITE_URL}${page.llmPath}): ${page.summary}`)
    .join('\n')

  const blogLinks = blogPosts
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/llm/blog/${post.slug}.md): ${post.description || post.category}`
    )
    .join('\n')

  return `# Decision Labs

> Decision Labs is a consultancy and product studio in decision science, AI/ML, and geospatial infrastructure. We build Geobase, EarthGPT, Verisat.ai, and GeoAI.js, and work with enterprise and government clients worldwide.

SpacialDB UG (Decision Labs) · Berlin, Germany · team@decision-labs.com · ${SITE_URL}

## Pages

${pageLinks}

## Blog

- [Blog index](${SITE_URL}/llm/blog.md): All posts, talks, podcasts, and external links
${blogLinks}

## Optional

- [Impressum](${SITE_URL}/llm/impressum.md): German legal imprint (SpacialDB UG)
- [Terms & privacy](${SITE_URL}/llm/terms.md): Terms summary; full legal text on the website

## Full export

- [llms-full.txt](${SITE_URL}/llms-full.txt): Complete markdown export of all LLM pages above

## HTML sitemap

- [sitemap.xml](${SITE_URL}/sitemap.xml): Machine-readable sitemap including HTML and LLM URLs
`
}

function buildSitemapXml(urls) {
  const today = new Date().toISOString().slice(0, 10)
  const entries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || today}</lastmod>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`
}

async function generateLlmFiles() {
  const customers = readJson('src/data/customers.json')
  const projects = readJson('src/data/projects.json')
  const postsJson = readJson('src/data/posts.json')
  const internalPosts = loadInternalBlogPosts()

  ensureDir(PUBLIC_DIR)
  ensureDir(LLM_DIR)
  ensureDir(path.join(LLM_DIR, 'blog'))

  const generatedPages = [
    {
      file: 'index.md',
      title: 'Home',
      htmlPath: '/',
      llmPath: '/llm/index.md',
      summary: 'Company overview, featured content, and key links',
      content: buildIndexPage(postsJson),
    },
    {
      file: 'about.md',
      title: 'About',
      htmlPath: '/about',
      llmPath: '/llm/about.md',
      summary: 'Mission and ML consulting process',
      content: buildAboutPage(),
    },
    {
      file: 'work.md',
      title: 'Work',
      htmlPath: '/work',
      llmPath: '/llm/work.md',
      summary: 'Geobase, EarthGPT, Verisat.ai, GeoAI.js, and other products',
      content: buildWorkPage(projects),
    },
    {
      file: 'customers.md',
      title: 'Customers',
      htmlPath: '/customers',
      llmPath: '/llm/customers.md',
      summary: 'Enterprise and government customers including Morgan Stanley, Hugging Face, ESA, Naver',
      content: buildCustomersPage(customers),
    },
    {
      file: 'contact.md',
      title: 'Contact',
      htmlPath: '/contact',
      llmPath: '/llm/contact.md',
      summary: 'Email, booking link, and social channels',
      content: buildContactPage(),
    },
    {
      file: 'blog.md',
      title: 'Blog',
      htmlPath: '/blog',
      llmPath: '/llm/blog.md',
      summary: 'Index of blog posts, talks, and external media',
      content: buildBlogIndexPage(postsJson, internalPosts),
    },
    {
      file: 'newsletter.md',
      title: 'Newsletter',
      htmlPath: '/newsletter',
      llmPath: '/llm/newsletter.md',
      summary: 'Monthly newsletter signup and description',
      content: buildNewsletterPage(),
    },
    {
      file: 'feed.md',
      title: 'Feed',
      htmlPath: '/feed',
      llmPath: '/llm/feed.md',
      summary: 'Combined content feed and RSS pointer',
      content: buildFeedPage(),
    },
    {
      file: 'impressum.md',
      title: 'Impressum',
      htmlPath: '/impressum',
      llmPath: '/llm/impressum.md',
      summary: 'German legal imprint for SpacialDB UG',
      content: buildImpressumPage(),
    },
    {
      file: 'terms.md',
      title: 'Terms & Conditions',
      htmlPath: '/terms',
      llmPath: '/llm/terms.md',
      summary: 'Terms and privacy summary with link to full legal text',
      content: buildTermsPage(),
    },
  ]

  const blogPages = internalPosts.map((post) => ({
    file: path.join('blog', `${post.slug}.md`),
    content: buildBlogPostPage(post),
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
  }))

  const allMarkdown = []

  for (const page of generatedPages) {
    const outputPath = path.join(LLM_DIR, page.file)
    fs.writeFileSync(outputPath, page.content, 'utf8')
    allMarkdown.push(page.content)
  }

  for (const post of blogPages) {
    const outputPath = path.join(LLM_DIR, post.file)
    fs.writeFileSync(outputPath, post.content, 'utf8')
    allMarkdown.push(post.content)
  }

  const llmsTxt = buildLlmsTxt(generatedPages, internalPosts)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt, 'utf8')
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llm.txt'), llmsTxt, 'utf8')

  const llmsFull = allMarkdown.join('\n\n---\n\n')
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFull, 'utf8')

  const sitemapUrls = [
    { loc: `${SITE_URL}/` },
    ...generatedPages.map((page) => ({ loc: `${SITE_URL}${page.htmlPath}/` })),
    ...generatedPages.map((page) => ({ loc: `${SITE_URL}${page.llmPath}` })),
    ...blogPages.map((post) => ({ loc: `${SITE_URL}/blog/${post.slug}/`, lastmod: post.date })),
    ...blogPages.map((post) => ({ loc: `${SITE_URL}/llm/blog/${post.slug}.md`, lastmod: post.date })),
    { loc: `${SITE_URL}/llms.txt` },
    { loc: `${SITE_URL}/llm.txt` },
    { loc: `${SITE_URL}/llms-full.txt` },
    { loc: `${SITE_URL}/rss.xml` },
  ]

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), buildSitemapXml(sitemapUrls), 'utf8')

  console.log(
    `✅ LLM files generated: llms.txt, llm.txt, llms-full.txt, sitemap.xml, ${generatedPages.length + blogPages.length} markdown pages in /llm/`
  )
}

module.exports = generateLlmFiles

if (require.main === module) {
  generateLlmFiles().catch((error) => {
    console.error('❌ Error generating LLM files:', error.message)
    process.exit(1)
  })
}
