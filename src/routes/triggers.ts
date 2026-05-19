import { Hono } from 'hono';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';
import { context } from '@devvit/web/server';

export const triggers = new Hono();

// ===== SPAM KEYWORDS =====
const SPAM_KEYWORDS = [
  'buy now', 'click here', 'free money', 'win prize',
  'limited offer', 'act now', 'earn money', 'make money fast',
  'casino', 'crypto investment', 'double your money'
];

const WARNING_KEYWORDS = [
  'idiot', 'stupid', 'hate', 'kill', 'racist', 'abuse'
];

// ===== HELPER: Check Spam =====
function checkSpam(title: string, content: string): { isSpam: boolean; reason: string } {
  const fullText = `${title} ${content}`.toLowerCase();
  
  // All caps check
  if (title.length > 10 && title === title.toUpperCase()) {
    return { isSpam: true, reason: 'ALL CAPS title detected' };
  }
  
  // Spam keywords check
  const spamFound = SPAM_KEYWORDS.find(kw => fullText.includes(kw));
  if (spamFound) {
    return { isSpam: true, reason: `Spam keyword found: "${spamFound}"` };
  }

  // Too many exclamation marks
  if ((title.match(/!/g) || []).length > 3) {
    return { isSpam: true, reason: 'Too many exclamation marks' };
  }

  return { isSpam: false, reason: '' };
}

// ===== HELPER: Check Warning =====
function checkWarning(title: string, content: string): { needsWarning: boolean; reason: string } {
  const fullText = `${title} ${content}`.toLowerCase();
  
  const warningFound = WARNING_KEYWORDS.find(kw => fullText.includes(kw));
  if (warningFound) {
    return { needsWarning: true, reason: `Inappropriate language: "${warningFound}"` };
  }

  return { needsWarning: false, reason: '' };
}

// ===== HELPER: Auto Flair =====
function detectFlair(title: string): string {
  const t = title.toLowerCase();
  
  if (t.includes('?') || t.includes('how') || t.includes('help') || t.includes('question')) 
    return '❓ Question';
  if (t.includes('news') || t.includes('breaking') || t.includes('update')) 
    return '📰 News';
  if (t.includes('meme') || t.includes('funny') || t.includes('lol')) 
    return '😂 Meme';
  if (t.includes('discussion') || t.includes('opinion') || t.includes('thoughts')) 
    return '💬 Discussion';
  if (t.includes('guide') || t.includes('tutorial') || t.includes('tips')) 
    return '📚 Guide';
    
  return '📌 General';
}

// ===== APP INSTALL =====
triggers.post('/on-app-install', async (c) => {
  const input = await c.req.json<OnAppInstallRequest>();
  console.log(`✅ Mod Suite Pro installed in r/${input.subreddit?.name}`);

  return c.json<TriggerResponse>({ status: 'success' }, 200);
});

// ===== POST SUBMIT TRIGGER =====
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
    const author = body?.post?.authorName ?? '';

    // Run checks
    const spamResult = checkSpam(title, content);
    const warningResult = checkWarning(title, content);
    const flair = detectFlair(title);

    // Health Score
    let healthScore = 100;
    if (spamResult.isSpam) healthScore -= 50;
    if (warningResult.needsWarning) healthScore -= 30;

    // Log results
    console.log(`
╔══════════════════════════════════════╗
║       MOD SUITE PRO ANALYSIS         ║
╠══════════════════════════════════════╣
║ Post ID : ${postId}
║ Author  : u/${author}
║ Title   : "${title}"
╠══════════════════════════════════════╣
║ Spam    : ${spamResult.isSpam ? '🔴 YES - ' + spamResult.reason : '🟢 Clean'}
║ Warning : ${warningResult.needsWarning ? '🟡 YES - ' + warningResult.reason : '🟢 Clean'}
║ Flair   : ${flair}
║ Health  : ${healthScore}/100
╚══════════════════════════════════════╝
    `);

    // Actions
    let action = 'approved';
    let message = '';

    if (spamResult.isSpam) {
      action = 'flagged_spam';
      message = `⚠️ Post flagged as SPAM! Reason: ${spamResult.reason}`;
    } else if (warningResult.needsWarning) {
      action = 'warning_issued';
      message = `⚠️ Warning issued to u/${author}. Reason: ${warningResult.reason}`;
    } else {
      message = `✅ Post approved. Flair: ${flair}. Health Score: ${healthScore}/100`;
    }

    return c.json<TriggerResponse>({
      status: 'success',
      message: message,
    }, 200);

  } catch (error) {
    console.error(`❌ Trigger error: ${error}`);
    return c.json<TriggerResponse>({ status: 'error', message: 'Analysis failed' }, 400);
  }
});

// ===== POST REPORT TRIGGER =====
triggers.post('/on-post-report', async (c) => {
  try {
    const body = await c.req.json<{
      post?: { title?: string; id?: string; authorName?: string };
      reportedBy?: string;
      reason?: string;
    }>();

    const title = body?.post?.title ?? '';
    const author = body?.post?.authorName ?? '';
    const postId = body?.post?.id ?? '';
    const reportedBy = body?.reportedBy ?? 'unknown';
    const reason = body?.reason ?? 'No reason given';

    console.log(`
🚨 POST REPORTED
Post  : "${title}"
ID    : ${postId}
Author: u/${author}
By    : u/${reportedBy}
Reason: ${reason}
    `);

    return c.json<TriggerResponse>({
      status: 'success',
      message: `Report logged for post ${postId}. Mod review required!`,
    }, 200);

  } catch (error) {
    return c.json<TriggerResponse>({ status: 'error', message: 'Report failed' }, 400);
  }
});