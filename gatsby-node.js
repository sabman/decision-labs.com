const fs = require('fs')
const path = require('path')
const fetchTwitterPosts = require('./scripts/fetch-twitter-posts')
const fetchWordpressPosts = require('./scripts/fetch-wordpress-posts')

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

  posts.forEach((post) => {
    // Skip placeholder files
    const slug = post.frontmatter.slug || post.fields?.slug || post.id
    if (slug === 'placeholder' || post.frontmatter.title === 'Placeholder') {
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
        },
      })
    }
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
  } catch (error) {
    console.error('❌ Error generating RSS feed:', error.message)
  }
}

// Fetch Twitter posts before build
exports.onPreBuild = async () => {
  await fetchTwitterPosts()
  await fetchWordpressPosts()
}

// Generate RSS feed after build
exports.onPostBuild = async ({ graphql }) => {
  await generateRSSFeed(graphql)
}

