const fs = require("fs");
const path = require("path");

// Use node-fetch for Node.js compatibility (or native fetch in Node 18+)
let fetch;
try {
  // Try native fetch first (Node 18+)
  if (typeof globalThis.fetch === "function") {
    fetch = globalThis.fetch;
  } else {
    // Fallback to node-fetch if available
    fetch = require("node-fetch");
  }
} catch (e) {
  // If node-fetch is not installed, we'll handle it in the function
  fetch = null;
}

/**
 * Fetches tweets from Twitter/X API and converts them to blog post format
 * Requires Twitter API v2 credentials in environment variables:
 * - TWITTER_BEARER_TOKEN (for API v2)
 * - TWITTER_USERNAME (e.g., 'geobaseapp')
 */
async function fetchTwitterPosts() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const username = process.env.TWITTER_USERNAME || "geobaseapp";

  if (!bearerToken) {
    console.warn(
      "⚠️  TWITTER_BEARER_TOKEN not set. Skipping Twitter data fetch."
    );
    console.warn(
      "   Set TWITTER_BEARER_TOKEN in your environment to fetch tweets."
    );
    return;
  }

  if (!fetch) {
    console.warn(
      "⚠️  fetch is not available. Install node-fetch or use Node.js 18+"
    );
    console.warn("   Run: npm install node-fetch");
    return;
  }

  try {
    // First, get user ID from username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      throw new Error("User not found");
    }

    // Fetch recent tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url,type`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.statusText}`);
    }

    const tweetsData = await tweetsResponse.json();
    const tweets = tweetsData.data || [];
    const media = tweetsData.includes?.media || [];

    // Convert tweets to blog post format
    const posts = tweets.map((tweet, index) => {
      // Find associated media
      const tweetMedia =
        tweet.attachments?.media_keys
          ?.map((key) => media.find((m) => m.media_key === key))
          .filter(Boolean) || [];

      const imageUrl =
        tweetMedia.find((m) => m.type === "photo")?.url ||
        tweetMedia.find((m) => m.preview_image_url)?.preview_image_url ||
        "https://via.placeholder.com/800x400";

      // Clean up tweet text (remove URLs, mentions, etc.)
      let text = tweet.text || "";
      // Remove URLs
      text = text.replace(/https?:\/\/[^\s]+/g, "");
      // Remove @mentions but keep the text
      text = text.replace(/@\w+/g, "");
      text = text.trim();

      // Extract title (first sentence or first 60 chars)
      const title =
        text.split(/[.!?]/)[0].substring(0, 60) || `Tweet ${index + 1}`;
      const description = text.substring(0, 200) || "";

      return {
        id: `twitter-${tweet.id}`,
        title: title.length > 60 ? title.substring(0, 57) + "..." : title,
        description: description || text.substring(0, 150),
        image: imageUrl,
        link: `https://twitter.com/${username}/status/${tweet.id}`,
        date: new Date(tweet.created_at).toISOString().split("T")[0],
        author: "GeoBase",
        featured: index < 2, // First 2 tweets are featured
        metadata: {
          category: "Twitter",
          readTime: "1 min read",
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
        },
      };
    });

    // Read existing posts.json
    const postsPath = path.join(__dirname, "../src/data/posts.json");
    let existingPosts = [];

    try {
      const existingData = fs.readFileSync(postsPath, "utf8");
      existingPosts = JSON.parse(existingData);
      // Filter out existing Twitter posts to avoid duplicates
      existingPosts = existingPosts.filter(
        (post) => !post.id.startsWith("twitter-")
      );
    } catch (error) {
      console.log("No existing posts.json found, creating new file");
    }

    // Merge Twitter posts with existing posts
    const allPosts = [...posts, ...existingPosts];

    // Write updated posts.json
    fs.writeFileSync(postsPath, JSON.stringify(allPosts, null, 2));
    console.log(
      `✅ Fetched ${posts.length} tweets from @${username} and updated posts.json`
    );
  } catch (error) {
    console.error("❌ Error fetching Twitter data:", error.message);
    console.error("   Make sure TWITTER_BEARER_TOKEN is set correctly");
  }
}

// Run if called directly
if (require.main === module) {
  fetchTwitterPosts();
}

module.exports = fetchTwitterPosts;
