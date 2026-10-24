import * as React from 'react'
import { Link, graphql } from 'gatsby'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { categoryLabel, dateLocale } from '../i18n/content'
import { localeHref } from '../i18n/routes'
import { absoluteUrl } from '../i18n/PageHead'

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const { title, date, author, category, readTime, image } = post.frontmatter
  const { locale, t } = useI18n()


  return (
    <SiteLayout location={location}>

      <main className="main-content blog-post-content">
        <article className="blog-post">
          <div className="blog-post-card">
            <div className="blog-post-header">
              <Link to={localeHref('blog', locale)} className="blog-back-link">{t('blog.back')}</Link>
              <span className="blog-post-category">{categoryLabel(locale, category || 'Blog')}</span>
            </div>
            
            <h1 className="blog-post-title">{title}</h1>
            
            <div className="blog-post-meta">
              <span className="blog-post-date">
                {new Date(date).toLocaleDateString(dateLocale(locale), {
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

export const Head = ({ data, pageContext }) => {
  const { title, image, slug } = data.markdownRemark.frontmatter
  const description = data.markdownRemark.excerpt
  const locale = pageContext?.locale || 'en'
  const path = locale === 'en' ? `/blog/${slug}` : `/${locale}/blog/${slug}`
  const canonicalUrl = absoluteUrl(path)
  const ogImage = image
    ? image.startsWith('http') ? image : `${SITE_URL}${image}`
    : `${SITE_URL}/images/og-default.png`
  const alternates = {
    en: absoluteUrl(`/blog/${slug}`),
    ...(pageContext?.alternates || {}),
  }
  if (locale !== 'en') alternates[locale] = canonicalUrl

  return (
    <>
      <html lang={locale} />
      <title>{title} - Decision Labs Blog</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {Object.entries(alternates).map(([code, href]) => (
        <link key={code} rel="alternate" href={typeof href === 'string' && href.startsWith('http') ? href : absoluteUrl(href)} {...{ hreflang: code }} />
      ))}
      <link rel="alternate" href={absoluteUrl(`/blog/${slug}`)} {...{ hreflang: 'x-default' }} />

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
