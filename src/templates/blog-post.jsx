import * as React from 'react'
import { Link, graphql } from 'gatsby'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const { title, date, author, category, readTime, image } = post.frontmatter


  return (
    <SiteLayout location={location}>

      <main className="main-content blog-post-content">
        <article className="blog-post">
          <div className="blog-post-card">
            <div className="blog-post-header">
              <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
              <span className="blog-post-category">{category || 'Blog'}</span>
            </div>
            
            <h1 className="blog-post-title">{title}</h1>
            
            <div className="blog-post-meta">
              <span className="blog-post-date">
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {readTime && <span className="blog-post-read-time">• {readTime}</span>}
              {author && <span className="blog-post-author">• {author}</span>}
            </div>

            {image && (
              <div className="blog-post-image">
                <img src={image} alt={title} />
              </div>
            )}

            <div 
              className="blog-post-body"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </article>
      </main>
    </SiteLayout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 200)
      html
      frontmatter {
        title
        date
        author
        category
        readTime
        image
        slug
      }
    }
  }
`

const SITE_URL = 'https://decision-labs.com'

export const Head = ({ data }) => {
  const { title, image, slug } = data.markdownRemark.frontmatter
  const description = data.markdownRemark.excerpt
  const canonicalUrl = `${SITE_URL}/blog/${slug}`
  const ogImage = image
    ? image.startsWith('http') ? image : `${SITE_URL}${image}`
    : `${SITE_URL}/images/og-default.png`

  return (
    <>
      <title>{title} - Decision Labs Blog</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Decision Labs" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  )
}
