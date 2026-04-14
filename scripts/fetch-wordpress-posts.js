const fs = require("fs");
const path = require("path");

const FEED_URL = "https://blog.decision-labs.com/feed/";
const WORDPRESS_ID_PREFIX = "wp-blog-decision-labs-";

const decodeHtmlEntities = (value) => {
  if (!value) return "";

  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
};

const stripHtml = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const pickTagContent = (xmlBlock, tagName) => {
  const match = xmlBlock.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? match[1] : "";
};

async function fetchWordpressPosts() {
  if (typeof globalThis.fetch !== "function") {
    console.warn("⚠️  fetch is not available. Use Node.js 18+ to fetch WordPress posts.");
    return;
  }

  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      throw new Error(`Feed request failed with ${response.status}`);
    }

    const xml = await response.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

    const wordpressPosts = items
      .map((item, index) => {
        const title = decodeHtmlEntities(pickTagContent(item, "title"));
        const link = decodeHtmlEntities(pickTagContent(item, "link"));
        const descriptionRaw = decodeHtmlEntities(pickTagContent(item, "description"));
        const description = stripHtml(descriptionRaw).slice(0, 240);
        const pubDate = decodeHtmlEntities(pickTagContent(item, "pubDate"));

        if (!title || !link || !pubDate) {
          return null;
        }

        const parsedDate = new Date(pubDate);
        if (Number.isNaN(parsedDate.getTime())) {
          return null;
        }

        return {
          id: `${WORDPRESS_ID_PREFIX}${index}-${parsedDate.getTime()}`,
          title,
          description,
          image: "https://via.placeholder.com/800x400",
          link,
          date: parsedDate.toISOString().split("T")[0],
          author: "Decision Labs",
          featured: false,
          metadata: {
            category: "Blog",
            readTime: "External",
          },
          linkType: "external",
        };
      })
      .filter(Boolean);

    const postsPath = path.join(__dirname, "../src/data/posts.json");
    const existingPosts = JSON.parse(fs.readFileSync(postsPath, "utf8")).filter(
      (post) => !String(post.id).startsWith(WORDPRESS_ID_PREFIX)
    );

    const allPosts = [...wordpressPosts, ...existingPosts];
    fs.writeFileSync(postsPath, JSON.stringify(allPosts, null, 2));

    console.log(`✅ Synced ${wordpressPosts.length} posts from ${FEED_URL}`);
  } catch (error) {
    console.error("❌ Error fetching WordPress feed:", error.message);
  }
}

if (require.main === module) {
  fetchWordpressPosts();
}

module.exports = fetchWordpressPosts;
