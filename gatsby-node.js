const fs = require('fs')
const path = require('path')
const { PAGES, PAGE_COMPONENTS, PUBLISHED_LOCALES } = require('./src/i18n/routes')
const fetchTwitterPosts = require('./scripts/fetch-twitter-posts')
const fetchWordpressPosts = require('./scripts/fetch-wordpress-posts')
const generateLlmFiles = require('./scripts/generate-llm-files')
const optimizeCustomerLogos = require('./scripts/optimize-customer-logos')

// Create pages for internal blog posts
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          id
          frontmatter {
            linkType
            link
            slug
            title
            locale
            translationOf
          }
          fields {
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const blogPostTemplate = path.resolve(`./src/templates/blog-post.jsx`)
  const posts = result.data.allMarkdownRemark.nodes
  const germanBySlug = new Map()
  posts.forEach((post) => {
    if (post.frontmatter.locale === 'de' && post.frontmatter.translationOf) {
      germanBySlug.set(post.frontmatter.translationOf, post)
    }
  })

  posts.forEach((post) => {
    // Skip placeholder files
    const slug = post.frontmatter.slug || post.fields?.slug || post.id
    if (slug === 'placeholder' || post.frontmatter.title === 'Placeholder') {
      return
    }

    if (post.frontmatter.locale === 'de' && post.frontmatter.translationOf) {
      createPage({
        path: `/de/blog/${post.frontmatter.translationOf}`,
        component: blogPostTemplate,
        context: {
          id: post.id,
          locale: 'de',
          alternates: {
            en: `/blog/${post.frontmatter.translationOf}`,
            de: `/de/blog/${post.frontmatter.translationOf}`,
          },
        },
      })
      return
    }

    // Determine if this is an internal post
    // Internal if: linkType is 'internal', or no/empty link field, or linkType is not 'external'
    const hasExternalLink = post.frontmatter.link && post.frontmatter.link.trim() !== '' && post.frontmatter.link.startsWith('http')
    const isInternal = 
      post.frontmatter.linkType === 'internal' || 
      !hasExternalLink ||
      (post.frontmatter.linkType !== 'external' && !hasExternalLink)

    if (isInternal) {
      const postPath = `/blog/${slug}`

      createPage({
        path: postPath,
        component: blogPostTemplate,
        context: {
          id: post.id,
          locale: 'en',
          alternates: germanBySlug.has(slug)
            ? {
              en: `/blog/${slug}`,
              de: `/de/blog/${slug}`,
            }
            : { en: `/blog/${slug}` },
        },
      })
    }
  })

  PUBLISHED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
    PAGES.filter((page) => !page.shared && PAGE_COMPONENTS[page.key]).forEach((page) => {
      createPage({
        path: page.paths[locale],
        component: path.resolve(__dirname, PAGE_COMPONENTS[page.key]),
        context: {
          locale,
          pageKey: page.key,
        },
      })
    })
  })
}

// Create slug field for markdown files
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent)
    const slug = createFilePath({ node, getNode, basePath: `blog` })
    
    createNodeField({
      name: `slug`,
      node,
      value: slug.replace(/^\/blog\//, '').replace(/\/$/, ''),
    })
  }
}

function readFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const frontmatter = {}
  if (!match) return frontmatter
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    let value = line.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    frontmatter[line.slice(0, idx).trim()] = value
  })
  return frontmatter
}

function writeGermanRss(publicDir) {
  const dir = path.join(__dirname, 'src', 'blog', 'de')
  if (!fs.existsSync(dir)) return
  const posts = fs.readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const frontmatter = readFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'))
      const slug = frontmatter.translationOf || frontmatter.slug
      if (!slug || !frontmatter.title) return null
      return { ...frontmatter, slug }
    })
    .filter(Boolean)

  if (posts.length === 0) return

  const siteUrl = 'https://decision-labs.com'
  const items = posts.map((post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/de/blog/${post.slug}</link>
      <guid isPermaLink="false">${siteUrl}/de/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post.author || 'Decision Labs'}</author>
    </item>`).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Decision Labs Blog</title>
    <link>${siteUrl}/de/blog</link>
    <description>Beiträge von Decision Labs.</description>
    <language>de</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/de/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  const deDir = path.join(publicDir, 'de')
  fs.mkdirSync(deDir, { recursive: true })
  fs.writeFileSync(path.join(deDir, 'rss.xml'), rss, 'utf8')
  console.log(`✅ German RSS feed generated with ${posts.length} posts`)
}

// Helper function to generate RSS feed from markdown files
async function generateRSSFeed(graphql) {
  try {
    const result = await graphql(`
      query {
        allMarkdownRemark {
          nodes {
            id
            excerpt(pruneLength: 200)
            fields {
              slug
            }
            frontmatter {
              title
              date
              author
              category
              link
              linkType
              slug
              locale
            }
          }
        }
      }
    `)

    if (result.errors) {
      throw result.errors
    }

    const posts = result.data.allMarkdownRemark.nodes
    
    // Filter out invalid/placeholder markdown posts
    const validPosts = posts.filter(post => {
      if (!post || !post.frontmatter || !post.frontmatter.title || !post.frontmatter.date) {
        return false
      }
      const slug = post.frontmatter.slug || post.fields?.slug || post.id
      if (post.frontmatter.locale && post.frontmatter.locale !== 'en') return false
      return slug !== 'placeholder' && post.frontmatter.title !== 'Placeholder'
    })

    // Include external feed posts from posts.json (e.g. WordPress, YouTube, partner blogs)
    const postsJsonPath = path.join(__dirname, 'src', 'data', 'posts.json')
    let externalPosts = []
    try {
      const postsJson = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'))
      externalPosts = postsJson.filter(post =>
        post && post.title && post.date && post.link && post.link.trim() !== ''
      )
    } catch (error) {
      console.warn(`⚠️  Could not read posts.json for RSS merge: ${error.message}`)
    }
    
    const siteUrl = 'https://decision-labs.com'
    const buildDate = new Date().toUTCString()

    const markdownRssItems = validPosts.map((post) => {
      try {
        const pubDate = new Date(post.frontmatter.date).toUTCString()
        if (isNaN(new Date(post.frontmatter.date).getTime())) {
          console.warn(`⚠️  Invalid date for post "${post.frontmatter.title}": ${post.frontmatter.date}`)
          return null
        }

        const title = post.frontmatter.title || 'Untitled'
        const description = post.excerpt || ''
        
        // Determine link - use internal slug if internal, otherwise use external link
        const hasExternalLink = post.frontmatter.link && post.frontmatter.link.trim() !== '' && post.frontmatter.link.startsWith('http')
        const linkType = post.frontmatter.linkType || (hasExternalLink ? 'external' : 'internal')
        const isInternal = linkType === 'internal' || (!hasExternalLink && linkType !== 'external')
        const slug = post.frontmatter.slug || post.fields?.slug || post.id
        const link = isInternal 
          ? `${siteUrl}/blog/${slug}`
          : (post.frontmatter.link || `${siteUrl}/blog/${post.id}`)
        
        const author = post.frontmatter.author || 'Decision Labs'
        const category = post.frontmatter.category ? `<category><![CDATA[${post.frontmatter.category}]]></category>` : ''

        return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">${siteUrl}/blog/${post.id}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${author}</author>
      ${category}
    </item>`
      } catch (error) {
        console.warn(`⚠️  Error processing post: ${error.message}`)
        return null
      }
    }).filter(Boolean)

    const externalRssItems = externalPosts.map((post) => {
      try {
        const pubDate = new Date(post.date).toUTCString()
        if (isNaN(new Date(post.date).getTime())) {
          return null
        }

        const title = post.title || 'Untitled'
        const description = post.description || ''
        const link = post.link
        const author = post.author || 'Decision Labs'
        const category = post.metadata?.category
          ? `<category><![CDATA[${post.metadata.category}]]></category>`
          : ''

        return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">${siteUrl}/external/${post.id}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${author}</author>
      ${category}
    </item>`
      } catch (error) {
        return null
      }
    }).filter(Boolean)

    const rssItems = [...markdownRssItems, ...externalRssItems].join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Decision Labs Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Insights on AI, machine learning, decision science, and the future of intelligent systems.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`

    // Ensure public directory exists
    const publicDir = path.join(__dirname, 'public')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    const publicPath = path.join(publicDir, 'rss.xml')
    fs.writeFileSync(publicPath, rss, 'utf8')
    console.log(`✅ RSS feed generated successfully with ${validPosts.length + externalPosts.length} posts`)
    writeGermanRss(publicDir)
  } catch (error) {
    console.error('❌ Error generating RSS feed:', error.message)
  }
}

// Generate LLM files during develop and before production assets are finalized
exports.onPreBootstrap = async () => {
  await optimizeCustomerLogos()
  await generateLlmFiles()
}

// Fetch Twitter posts before build
exports.onPreBuild = async () => {
  await fetchTwitterPosts()
  await fetchWordpressPosts()
}

// Generate RSS feed and LLM files after build
exports.onPostBuild = async ({ graphql }) => {
  await generateRSSFeed(graphql)
  await generateLlmFiles()
}

