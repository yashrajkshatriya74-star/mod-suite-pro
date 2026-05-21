import { Hono } from 'hono';
import type { TriggerResponse } from '@devvit/web/shared';
import { reddit } from '@devvit/web/server';

export const triggers = new Hono();

// ===== SPAM KEYWORDS =====
const SPAM_KEYWORDS = [
  'buy now',
  'click here',
  'free money',
  'win prize',
  'limited offer',
  'act now',
  'earn money',
  'make money fast',
  'casino',
  'crypto investment',
  'double your money',
];

// ===== WARNING KEYWORDS =====
const WARNING_KEYWORDS = [
  'idiot',
  'stupid',
  'hate',
  'kill',
  'racist',
  'abuse',
];

// ===== SPAM CHECK =====
function checkSpam(title: string, content: string) {
  const fullText = `${title} ${content}`.toLowerCase();

  // ALL CAPS detection
  if (
    title.length > 10 &&
    /[A-Z]/.test(title) &&
    title === title.toUpperCase()
  ) {
    return {
      isSpam: true,
      reason: 'ALL CAPS title detected',
    };
  }

  // Spam keywords
  const spamFound = SPAM_KEYWORDS.find((kw) =>
    fullText.includes(kw)
  );

  if (spamFound) {
    return {
      isSpam: true,
      reason: `Spam keyword detected: "${spamFound}"`,
    };
  }

  // Too many !!!
  if ((title.match(/!/g) || []).length > 3) {
    return {
      isSpam: true,
      reason: 'Too many exclamation marks',
    };
  }

  return {
    isSpam: false,
    reason: '',
  };
}

// ===== WARNING CHECK =====
function checkWarning(title: string, content: string) {
  const fullText = `${title} ${content}`.toLowerCase();

  const warningFound = WARNING_KEYWORDS.find((kw) =>
    fullText.includes(kw)
  );

  if (warningFound) {
    return {
      needsWarning: true,
      reason: `Inappropriate language detected: "${warningFound}"`,
    };
  }

  return {
    needsWarning: false,
    reason: '',
  };
}

// ===== AUTO FLAIR DETECTION =====
function detectFlair(title: string): string {
  const t = title.toLowerCase();

  if (
    t.includes('?') ||
    t.includes('how') ||
    t.includes('help')
  ) {
    return '❓ Question';
  }

  if (
    t.includes('news') ||
    t.includes('breaking') ||
    t.includes('update')
  ) {
    return '📰 News';
  }

  if (
    t.includes('meme') ||
    t.includes('funny') ||
    t.includes('lol')
  ) {
    return '😂 Meme';
  }

  if (
    t.includes('discussion') ||
    t.includes('opinion')
  ) {
    return '💬 Discussion';
  }

  if (
    t.includes('guide') ||
    t.includes('tutorial') ||
    t.includes('tips')
  ) {
    return '📚 Guide';
  }

  return '📌 General';
}

// ===== APP INSTALL =====
triggers.post('/on-app-install', async (c) => {
  console.log('✅ Mod Suite Pro installed successfully!');

  return c.json<TriggerResponse>(
    {
      status: 'success',
      message: 'Mod Suite Pro installed',
    },
    200
  );
});

// ===== MAIN POST SUBMIT TRIGGER =====
triggers.post('/on-post-submit', async (c) => {
  try {
    const body = await c.req.json<{
      post?: {
        title?: string;
        selftext?: string;
        id?: string;
        authorName?: string;
      };
    }>();

    const title = body?.post?.title ?? '';
    const content = body?.post?.selftext ?? '';
    const postId = body?.post?.id ?? '';
    const author = body?.post?.authorName ?? 'unknown';

    // ===== ANALYSIS =====
    const spamResult = checkSpam(title, content);
    const warningResult = checkWarning(title, content);
    const flair = detectFlair(title);

    // ===== HEALTH SCORE =====
    let healthScore = 100;

    if (spamResult.isSpam) {
      healthScore -= 50;
    }

    if (warningResult.needsWarning) {
      healthScore -= 30;
    }

    // ===== LOGGING =====
    console.log(`
===============================
 MOD SUITE PRO ANALYSIS
===============================
Post ID : ${postId}
Author  : u/${author}
Title   : "${title}"

Spam    : ${
      spamResult.isSpam
        ? `YES - ${spamResult.reason}`
        : 'Clean'
    }

Warning : ${
      warningResult.needsWarning
        ? `YES - ${warningResult.reason}`
        : 'Clean'
    }

Flair   : ${flair}
Health  : ${healthScore}/100
===============================
`);

    // ===== REDDIT ACTIONS =====
    if (postId) {
      try {
        // Safe ID formatting
        const fullPostId = postId.startsWith('t3_')
          ? postId
          : `t3_${postId}`;

        const post = await reddit.getPostById(
          fullPostId as `t3_${string}`
        );

        let moderationMessage = '';

        // ===== SPAM ACTION =====
        if (spamResult.isSpam) {
          moderationMessage += `
🚫 **Spam Detected**

Reason: **${spamResult.reason}**

`;
        }

        // ===== WARNING ACTION =====
        if (warningResult.needsWarning) {
          moderationMessage += `
⚠️ **Content Warning**

u/${author}, your post contains inappropriate language.

Reason: **${warningResult.reason}**

Please remain respectful to others.

`;
        }

        // ===== POST COMMENT =====
        if (moderationMessage.trim()) {
          moderationMessage +=
            '\n*This is an automated moderation message by Mod Suite Pro.*';

          await post.addComment({
            text: moderationMessage,
          });

          console.log(
            `✅ Moderation comment added to post ${postId}`
          );
        }

        // ===== OPTIONAL AUTO REMOVE =====
        // Uncomment this if you want automatic spam removal

        
        if (spamResult.isSpam) {
          await post.remove();
          console.log(`🚫 Spam post removed: ${postId}`);
        }
        

      } catch (apiError) {
        console.error(
          `❌ Reddit API Error: ${String(apiError)}`
        );
      }
    }

    // ===== FINAL RESPONSE =====
    let message = '';

    if (spamResult.isSpam) {
      message = `🚫 Spam detected: ${spamResult.reason}`;
    } else if (warningResult.needsWarning) {
      message = `⚠️ Warning issued to u/${author}`;
    } else {
      message = `✅ Post approved | Flair: ${flair} | Health: ${healthScore}/100`;
    }

    return c.json<TriggerResponse>(
      {
        status: 'success',
        message,
      },
      200
    );
  } catch (error) {
    console.error(`❌ Trigger Error: ${String(error)}`);

    return c.json<TriggerResponse>(
      {
        status: 'error',
        message: 'Post analysis failed',
      },
      400
    );
  }
});

// ===== POST REPORT TRIGGER =====
triggers.post('/on-post-report', async (c) => {
  try {
    const body = await c.req.json<{
      post?: {
        title?: string;
        id?: string;
        authorName?: string;
      };
      reportedBy?: string;
      reason?: string;
    }>();

    const title = body?.post?.title ?? '';
    const author = body?.post?.authorName ?? '';
    const postId = body?.post?.id ?? '';
    const reason = body?.reason ?? 'No reason given';

    console.log(`
🚨 POST REPORTED
-------------------------
Post   : "${title}"
ID     : ${postId}
Author : u/${author}
Reason : ${reason}
-------------------------
`);

    return c.json<TriggerResponse>(
      {
        status: 'success',
        message: `Report logged for post ${postId}`,
      },
      200
    );
  } catch (error) {
    console.error(`❌ Report Trigger Error: ${String(error)}`);

    return c.json<TriggerResponse>(
      {
        status: 'error',
        message: 'Failed to process report',
      },
      400
    );
  }
});