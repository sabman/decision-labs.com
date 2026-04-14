# Decision Labs Website

Modern website built with Gatsby 5 and React 18.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm (or yarn)

### Installation

```bash
npm install
```

### Running the Project

#### Development Mode

Start the development server with hot-reloading:

```bash
npm run dev
```

The site will be available at [http://localhost:8000](http://localhost:8000). Changes to files will automatically reload in the browser.

**Note:** During development, Gatsby will:

- Process markdown files in `src/blog/` automatically
- Watch for file changes and rebuild pages
- Provide GraphQL playground at `http://localhost:8000/___graphql`

#### Production Build

Build the site for production:

```bash
npm run build
```

This will:

- Process all markdown blog posts
- Fetch Twitter posts (if configured)
- Generate static HTML pages
- Create an RSS feed at `public/rss.xml`
- Optimize assets and images

#### Preview Production Build

After building, preview the production site locally:

```bash
npm run serve
```

The production build will be served at [http://localhost:9000](http://localhost:9000).

#### Clean Build

Clear Gatsby cache and build artifacts:

```bash
npm run clean
```

Use this if you encounter build issues or want a fresh start.

## 📁 Project Structure

```
├── src/
│   ├── pages/          # Gatsby pages (file-based routing)
│   ├── components/     # React components
│   ├── blog/           # Blog post markdown files
│   ├── data/           # JSON data files (posts.json, projects.json)
│   ├── styles/         # Global styles
│   └── templates/      # Page templates (blog-post.jsx)
├── static/             # Static files (favicons, images)
├── scripts/            # Build scripts (fetch-twitter-posts.js)
├── gatsby-config.js    # Gatsby configuration
└── gatsby-node.js      # Gatsby Node APIs (page creation, RSS generation)
```

## 🛠️ Tech Stack

- **Framework**: Gatsby 5
- **React**: 18.3
- **Styling**: CSS (global styles, ready for CSS Modules if needed)

## 📝 Scripts

- `npm run dev` - Start development server (alias for `gatsby develop`)
- `npm run build` - Build for production (includes Twitter fetch and RSS generation)
- `npm run serve` - Serve production build locally
- `npm run clean` - Clean Gatsby cache and build files
- `npm run fetch-twitter` - Manually fetch tweets from Twitter/X API

## 📝 Blog System

The website uses a hybrid blog system that supports both internal markdown posts and external content links.

### How the Blog Works

The blog combines two types of posts:

1. **Internal Posts** - Written in Markdown, stored in `src/blog/`
   - Full blog posts with content rendered on the site
   - Automatically processed by Gatsby during build
   - Accessible at `/blog/{slug}`

2. **External Posts** - Links to external content, stored in `src/data/posts.json`
   - Links to YouTube videos, Twitter threads, external articles, etc.
   - Displayed on the blog page but link to external sources
   - Useful for curating content from other platforms

### Adding Blog Posts

#### Internal Posts (Markdown)

To add a new blog post to the website, follow these steps:

1. **Create a new markdown file** in the `src/blog/` directory:
   ```bash
   touch src/blog/your-post-title.md
   ```

2. **Add front matter and content** to the file. The front matter must be at the top of the file, enclosed in `---` markers.

3. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

4. **View your post** at `http://localhost:8000/blog/your-post-slug`

**Front Matter Format:**

All blog posts must start with YAML front matter. Here's the complete format with all available fields:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
author: "Decision Labs"
category: "Blog"
readTime: "5 min read"
featured: false
image: "https://via.placeholder.com/800x400"
linkType: "internal"
slug: "your-post-slug"
link: ""
---

Your blog post content here. Use standard Markdown syntax.
```

**Front Matter Fields:**

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| `title` | ✅ Yes | String | Post title displayed on the blog | `"Introduction to Decision Science"` |
| `date` | ✅ Yes | String | Publication date in YYYY-MM-DD format | `"2024-01-15"` |
| `author` | ❌ No | String | Author name | `"Decision Labs"` |
| `category` | ❌ No | String | Post category (used for filtering on blog page) | `"Blog"`, `"Talk"`, `"Partnership"` |
| `readTime` | ❌ No | String | Estimated reading time | `"5 min read"`, `"8 min read"` |
| `featured` | ❌ No | Boolean | Mark post as featured (default: `false`) | `true`, `false` |
| `image` | ❌ No | String | Hero image URL (can be external URL or relative path) | `"https://via.placeholder.com/800x400"` or `"images/blog/my-image.png"` |
| `linkType` | ❌ No | String | Set to `"internal"` for internal posts | `"internal"` |
| `slug` | ❌ No | String | Custom URL slug (defaults to filename without extension) | `"introduction-to-decision-science"` |
| `link` | ❌ No | String | Leave empty for internal posts | `""` |

**Real Examples:**

Here are examples from existing blog posts:

**Example 1: Basic Blog Post**
```markdown
---
title: "Introduction to Decision Science"
date: "2024-01-15"
author: "Decision Labs"
category: "Blog"
readTime: "5 min read"
featured: false
image: "https://via.placeholder.com/800x400"
linkType: "internal"
slug: "introduction-to-decision-science"
link: ""
---

Decision science is an interdisciplinary field that combines elements of mathematics, statistics, psychology, and economics to help organizations make better decisions.

## The Foundation of Decision Science

Your content here...
```

**Example 2: Featured Post with Local Image**
```markdown
---
title: "Building AI-Driven Products"
date: "2024-01-10"
author: "Decision Labs"
category: "Blog"
readTime: "8 min read"
featured: true
image: "images/blog/ai-products-hero.png"
linkType: "internal"
slug: "building-ai-driven-products"
link: ""
---

Building AI-driven products requires more than just implementing machine learning models...
```

**Image Paths:**

- **External URLs**: Use full URLs for images hosted elsewhere
  ```yaml
  image: "https://via.placeholder.com/800x400"
  ```

- **Local Images**: Place images in `src/images/blog/` and reference them relative to the static folder
  ```yaml
  image: "images/blog/geobase-duckdb-1-1-3.png"
  ```

**URL Structure:**

- Posts are accessible at `/blog/{slug}`
- If no `slug` is provided, Gatsby generates one from the filename
- Example: `introduction-to-decision-science.md` → `/blog/introduction-to-decision-science`
- The slug should be URL-friendly (lowercase, hyphens instead of spaces)

**Markdown Content:**

After the front matter, write your blog post content using standard Markdown syntax:

- Headers: `# H1`, `## H2`, `### H3`
- **Bold text**: `**bold**`
- *Italic text*: `*italic*`
- Lists: `- item` or `1. item`
- Links: `[text](url)`
- Images: `![alt](url)`
- Code blocks: Use triple backticks with language identifier

#### External Posts (JSON)

Add entries to `src/data/posts.json`:

```json
{
  "id": "unique-post-id",
  "title": "Post Title",
  "description": "Brief description of the external content",
  "date": "2024-01-15",
  "author": "Author Name",
  "link": "https://external-link.com",
  "linkType": "external",
  "image": "https://example.com/image.jpg",
  "featured": false,
  "metadata": {
    "category": "Blog",
    "readTime": "3 min read"
  }
}
```

**Important:** External posts must have:

- A `link` field pointing to the external content
- `linkType` set to `"external"` (or omitted, defaults to external)

### Blog Features

- **Category Filtering** - Posts can be filtered by category on the blog page
- **Featured Posts** - Mark posts as featured to highlight them
- **RSS Feed** - Automatically generated at `/rss.xml` during build
- **Responsive Design** - Blog cards adapt to different screen sizes
- **SEO Optimized** - Each post has proper meta tags and structured data

### Blog Page Structure

- **Blog Listing** (`/blog`) - Shows all posts with filtering
- **Blog Post** (`/blog/{slug}`) - Individual post pages for internal markdown posts
- **RSS Feed** (`/rss.xml`) - XML feed for RSS readers

### Development Workflow

1. **Add a new post:**

   ```bash
   # Create markdown file
   touch src/blog/my-new-post.md
   ```

2. **Edit the post** with frontmatter and content

3. **Start dev server** (if not running):

   ```bash
   npm run dev
   ```

4. **View your post** at `http://localhost:8000/blog/my-new-post`

5. **Build for production:**
   ```bash
   npm run build
   ```

The build process will:

- Process all markdown files
- Create pages for internal posts
- Generate RSS feed
- Fetch Twitter posts (if configured)

## 🐦 Twitter Integration

The site can automatically pull tweets from the [@geobaseapp](https://x.com/geobaseapp) Twitter account and convert them into blog posts.

### Setup

1. **Get Twitter API Credentials:**
   - Sign up for a [Twitter Developer Account](https://developer.twitter.com/en/portal/dashboard)
   - Create a new app and get your Bearer Token
   - Note: Twitter API v2 requires authentication (free tier available with limitations)

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:

   ```bash
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   TWITTER_USERNAME=geobaseapp
   ```

3. **Fetch Tweets:**
   - Tweets are automatically fetched during build (`npm run build`)
   - Or manually run: `npm run fetch-twitter`
   - Tweets are merged with existing posts in `src/data/posts.json`
   - The first 2 tweets are automatically marked as "featured"

### How It Works

- Fetches the latest 10 tweets from the specified Twitter account
- Converts them to blog post format with:
  - Title (extracted from tweet text)
  - Description (tweet content)
  - Image (from tweet media if available)
  - Link to original tweet
  - Metadata (likes, retweets, category)
- Merges with existing posts (Twitter posts have IDs starting with `twitter-`)

## 📄 License

MIT
