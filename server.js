// Load environment variables from .env if present
try {
  require('dotenv').config();
} catch (_) {
  // dotenv not installed or not needed
}
const express = require('express');
const path = require('path');
const fs = require('fs');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
// Ensure fetch works in CommonJS environments
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 8000;

let X_API_KEY = process.env.X_API_KEY;
let X_API_SECRET = process.env.X_API_SECRET;
let X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
let X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET;
let USERNAME = 'mittoonsol';

let bearerToken = null;
let userId = null;

// Simple in-memory caches
let statsCache = { data: null, ts: 0 };
let postsCache = { data: null, ts: 0 };

// Load config data
function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    }
  } catch (err) {
    console.warn('Failed to load config.json:', err.message);
  }
  return null;
}

// Apply credentials from config.json if present (fallback when env vars are missing)
(() => {
  try {
    const cfg = loadConfig();
    if (!cfg) return;
    if (cfg.username && typeof cfg.username === 'string') {
      USERNAME = cfg.username;
    }
    const creds = cfg.credentials || {};
    if (!X_API_KEY && creds.apiKey) X_API_KEY = creds.apiKey;
    if (!X_API_SECRET && creds.apiSecret) X_API_SECRET = creds.apiSecret;
    if (!X_ACCESS_TOKEN && creds.accessToken) X_ACCESS_TOKEN = creds.accessToken;
    if (!X_ACCESS_TOKEN_SECRET && creds.accessTokenSecret) X_ACCESS_TOKEN_SECRET = creds.accessTokenSecret;
  } catch (e) {
    console.warn('Failed to apply credentials from config.json:', e.message);
  }
})();

async function getBearerToken() {
  if (!X_API_KEY || !X_API_SECRET) {
    console.warn('Twitter/X API credentials not set. Falling back to mock data.');
    return null;
  }
  const basic = Buffer.from(`${X_API_KEY}:${X_API_SECRET}`).toString('base64');
  try {
    const res = await fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) {
      console.error('Failed to obtain bearer token:', await res.text());
      return null;
    }
    const json = await res.json();
    return json.access_token || null;
  } catch (err) {
    console.error('Error obtaining bearer token:', err);
    return null;
  }
}

async function fetchUserStatsV11(screenName) {
  const url = `https://api.twitter.com/1.1/users/show.json?screen_name=${encodeURIComponent(screenName)}`;
  let headers = {};
  if (X_ACCESS_TOKEN && X_ACCESS_TOKEN_SECRET) {
    const oauth = new OAuth({
      consumer: { key: X_API_KEY, secret: X_API_SECRET },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });
    headers = oauth.toHeader(
      oauth.authorize({ url, method: 'GET' }, { key: X_ACCESS_TOKEN, secret: X_ACCESS_TOKEN_SECRET })
    );
  } else if (bearerToken) {
    headers = { Authorization: `Bearer ${bearerToken}` };
  } else {
    return null;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error('users/show failed:', await res.text());
    return null;
  }
  const data = await res.json();
  return {
    followers: data.followers_count,
    posts: data.statuses_count,
    following: data.friends_count,
  };
}

// V2: fetch user stats via public_metrics
async function fetchUserStatsV2(screenName) {
  if (!bearerToken) return null;
  const url = `https://api.twitter.com/2/users/by/username/${encodeURIComponent(screenName)}?user.fields=public_metrics`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${bearerToken}` } });
  if (!res.ok) {
    console.error('v2 users/by/username failed:', await res.text());
    return null;
  }
  const json = await res.json();
  const user = json && json.data;
  if (!user) return null;
  userId = user.id;
  const m = user.public_metrics || {};
  return {
    followers: m.followers_count ?? null,
    posts: m.tweet_count ?? null,
    following: m.following_count ?? null,
  };
}

async function fetchRecentPostsV11(screenName, count = 3) {
  const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${encodeURIComponent(screenName)}&count=${count}&tweet_mode=extended&exclude_replies=true&include_rts=false`;
  let headers = {};
  if (X_ACCESS_TOKEN && X_ACCESS_TOKEN_SECRET) {
    const oauth = new OAuth({
      consumer: { key: X_API_KEY, secret: X_API_SECRET },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });
    headers = oauth.toHeader(
      oauth.authorize({ url, method: 'GET' }, { key: X_ACCESS_TOKEN, secret: X_ACCESS_TOKEN_SECRET })
    );
  } else if (bearerToken) {
    headers = { Authorization: `Bearer ${bearerToken}` };
  } else {
    return null;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error('user_timeline failed:', await res.text());
    return null;
  }
  const tweets = await res.json();
  return tweets.map(t => ({
    id: t.id_str,
    text: t.full_text,
    created_at: t.created_at,
    favorite_count: t.favorite_count,
    retweet_count: t.retweet_count,
    url: `https://x.com/${screenName}/status/${t.id_str}`,
  }));
}

// V2: fetch recent tweets via users/:id/tweets
async function fetchRecentPostsV2(screenName, count = 3) {
  if (!bearerToken) return null;
  try {
    // Ensure we have userId
    if (!userId) {
      const lookupUrl = `https://api.twitter.com/2/users/by/username/${encodeURIComponent(screenName)}?user.fields=public_metrics`;
      const luRes = await fetch(lookupUrl, { headers: { Authorization: `Bearer ${bearerToken}` } });
      if (!luRes.ok) {
        console.error('v2 users/by/username (for posts) failed:', await luRes.text());
        return null;
      }
      const luJson = await luRes.json();
      userId = luJson?.data?.id;
      if (!userId) return null;
    }
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=${Math.max(5, count)}&exclude=retweets,replies&tweet.fields=created_at,public_metrics`; // request more then slice
    const twRes = await fetch(tweetsUrl, { headers: { Authorization: `Bearer ${bearerToken}` } });
    if (!twRes.ok) {
      console.error('v2 users/:id/tweets failed:', await twRes.text());
      return null;
    }
    const twJson = await twRes.json();
    const items = (twJson && twJson.data) ? twJson.data.slice(0, count) : [];
    return items.map(t => ({
      id: t.id,
      text: t.text,
      created_at: t.created_at,
      favorite_count: t.public_metrics?.like_count ?? null,
      retweet_count: t.public_metrics?.retweet_count ?? null,
      url: `https://x.com/${screenName}/status/${t.id}`,
    }));
  } catch (err) {
    console.error('Error in fetchRecentPostsV2:', err);
    return null;
  }
}

// Static files
app.use(express.static(path.join(__dirname)));

app.get('/api/x-stats', async (req, res) => {
  try {
    console.log('Fetching X stats...');
    
    // Check if we should use config data for stats
    const config = loadConfig();
    const useConfigStats = config && (config.useConfigData || config.useConfigStats);
    if (useConfigStats && config.stats) {
      console.log('Using config data for stats');
      return res.json({ ...config.stats, source: 'config', lastUpdated: new Date().toISOString() });
    }
    
    const now = Date.now();
    if (statsCache.data && now - statsCache.ts < 60_000) {
      console.log('Returning cached stats');
      return res.json({ ...statsCache.data, source: statsCache.source || 'live', lastUpdated: new Date().toISOString() });
    }

    if (!bearerToken) bearerToken = await getBearerToken();
    let stats = null;
    let source = 'live';
    if (X_ACCESS_TOKEN && X_ACCESS_TOKEN_SECRET) {
      console.log('Using v1.1 with user tokens');
      // Prefer v1.1 when user tokens are available
      stats = await fetchUserStatsV11(USERNAME);
      if (!stats && bearerToken) {
        console.log('Trying v2 with bearer token');
        stats = await fetchUserStatsV2(USERNAME);
      }
    } else if (bearerToken) {
      console.log('Trying v2 with bearer token');
      // Prefer v2 with app-only bearer, fallback to v1.1
      stats = await fetchUserStatsV2(USERNAME);
      if (!stats) {
        console.log('Trying v1.1 with bearer token');
        stats = await fetchUserStatsV11(USERNAME);
      }
    }
    if (!stats) {
      console.log('All API calls failed, returning mock data');
      // Fallback mock
      stats = { followers: 100000, posts: 1200, following: 500 };
      source = 'mock';
    }
    statsCache = { data: stats, ts: now, source };
    return res.json({ ...stats, source, lastUpdated: new Date().toISOString() });
  } catch (err) {
    console.error('Error in /api/x-stats:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/x-posts', async (req, res) => {
  try {
    console.log('Fetching X posts...');
    
    // Check if we should use config data for posts
    const config = loadConfig();
    const useConfigPosts = config && (config.useConfigData || config.useConfigPosts);
    if (useConfigPosts && config.posts) {
      console.log('Using config data for posts');
      return res.json(config.posts);
    }
    
    const now = Date.now();
    if (postsCache.data && now - postsCache.ts < 60_000) {
      console.log('Returning cached posts');
      return res.json(postsCache.data);
    }
    if (!bearerToken) bearerToken = await getBearerToken();
    let posts = null;
    
    // If we have user access tokens, prefer v1.1
    if (X_ACCESS_TOKEN && X_ACCESS_TOKEN_SECRET && 
        X_ACCESS_TOKEN !== '<PASTE_YOUR_ACCESS_TOKEN>' && 
        X_ACCESS_TOKEN_SECRET !== '<PASTE_YOUR_ACCESS_TOKEN_SECRET>') {
      console.log('Using v1.1 with user tokens');
      posts = await fetchRecentPostsV11(USERNAME, 3);
      if (!posts && bearerToken) posts = await fetchRecentPostsV2(USERNAME, 3);
    } else if (bearerToken) {
      console.log('Trying v2 with bearer token');
      // Prefer v2 with app-only bearer, fallback to v1.1
      posts = await fetchRecentPostsV2(USERNAME, 3);
      if (!posts) {
        console.log('Trying v1.1 with bearer token');
        posts = await fetchRecentPostsV11(USERNAME, 3);
      }
    }
    
    // If all API calls failed, return mock data
    if (!posts) {
      console.log('All API calls failed, returning mock posts');
      posts = [
        {
          id: 'mock_1',
          text: 'This is a sample post from the X API integration. Real posts will appear here once API access is configured.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          favorite_count: 15,
          retweet_count: 3,
          url: 'https://x.com/mittoonsol/status/mock_1'
        },
        {
          id: 'mock_2',
          text: 'Another example post showing how your recent tweets will be displayed on the website.',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          favorite_count: 8,
          retweet_count: 1,
          url: 'https://x.com/mittoonsol/status/mock_2'
        }
      ];
    }
    
    // Cache the result
    postsCache = { data: posts, ts: now };
    return res.json(posts);
  } catch (err) {
    console.error('Error in /api/x-posts:', err);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});