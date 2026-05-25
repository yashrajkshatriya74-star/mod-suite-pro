# 🛡️ Mod Suite Pro

> Intelligent real-time moderation tool for Reddit communities

Built for the **Reddit Mod Tools Hackathon 2026** by u/Primary-Dirt-6166

---

## 🎯 The Problem

Reddit moderators spend hours every day manually:
- Reviewing spam posts one by one
- Issuing warnings to rule-breaking users
- Manually assigning flairs to posts
- Monitoring community health

**Mod Suite Pro automates all of this — instantly, automatically, 24/7.**

---

## ✨ Features

### 🚫 Spam Detection
Automatically analyzes every new post for spam indicators:

| Check | Description |
|-------|-------------|
| ALL CAPS Detection | Flags posts with fully capitalized titles |
| Spam Keywords | Detects phrases like "click here", "free money", "win prize", "buy now", "casino", "crypto investment" |
| Excessive Punctuation | Flags titles with 3+ exclamation marks |

**Result:** Spam posts are instantly detected and moderated in real time!

---

### ⚠️ Warning System
Monitors post content for rule violations:

| Trigger | Action |
|---------|--------|
| Inappropriate language detected | Warning comment posted automatically |
| Hate speech keywords found | Post flagged for review |

**Tracked keywords:** idiot, stupid, moron, dumb, racist, hate you, kill yourself, bitch, fuck you, loser, and more

---

### 🗑️ Auto Spam Removal
Spam posts are automatically removed — no mod action needed:

| Action | Trigger |
|--------|---------|
| Auto Remove | Spam keywords detected |
| Auto Remove | ALL CAPS title |
| Auto Remove | Excessive punctuation |
| Warning Comment | Inappropriate language |

**Result:** Spam posts disappear instantly — mods never even see them!

---

### 🏷️ Auto Flair System
Automatically assigns the correct flair to every post:

| Keywords Found | Flair Assigned |
|---------------|----------------|
| question, help, how, ? | ❓ Question |
| news, breaking, update | 📰 News |
| meme, funny, lol | 😂 Meme |
| discussion, opinion, thoughts | 💬 Discussion |
| guide, tutorial, tips | 📚 Guide |
| (no match) | 📌 General |

**Result:** Every post is properly categorized — no manual effort needed!

---

### 📊 Community Health Score
Every post gets a real-time health score from 0-100:

| Score | Meaning |
|-------|---------|
| 100/100 | ✅ Perfect — Clean post, properly categorized |
| 70/100 | 🟡 Warning — Inappropriate language detected |
| 50/100 | 🔴 Spam — Spam indicators found |

**Mods can quickly prioritize** which posts need immediate attention!

---

## 📈 How It Works
New Post Submitted
↓
Mod Suite Pro Analyzes
↓
┌───────────────────────────────┐
│  1. Spam Check                │
│     → Keywords scan           │
│     → ALL CAPS check          │
│     → Punctuation check       │
├───────────────────────────────┤
│  2. Warning Check             │
│     → Inappropriate language  │
│     → Hate speech detection   │
├───────────────────────────────┤
│  3. Auto Flair                │
│     → Category detection      │
│     → Flair assignment        │
├───────────────────────────────┤
│  4. Health Score              │
│     → 0-100 score calculated  │
└───────────────────────────────┘
↓
Result logged for moderator review

---

## 🚀 Installation

1. Go to [Mod Suite Pro App Page](https://developers.reddit.com/apps/mod-suite-pro)
2. Click **"Install App"**
3. Select your subreddit
4. **Done!** Automatic moderation starts immediately

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Devvit** | Reddit Developer Platform |
| **Hono** | Lightweight backend framework |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool |

---

## 📁 Project Structure
src/
├── index.ts              # Main server setup
├── core/
│   └── nuke.ts           # Core moderation logic
└── routes/
├── api.ts            # Public API endpoints
├── forms.ts          # Form handlers
├── menu.ts           # Context menu handlers
└── triggers.ts       # App triggers
# → Spam Detection
# → Warning System
# → Auto Flair
# → Health Score

---

## 💡 Use Cases

**r/AskReddit style communities** — Auto-flair questions, detect spam answers

**News subreddits** — Detect clickbait titles, auto-flair breaking news

**Gaming communities** — Flag toxic language, categorize posts automatically

**Large communities (10k+ members)** — Handle high post volume automatically

---

## 📊 Impact

| Metric | Before | After |
|--------|--------|-------|
| Spam review time | Manual, hours | Instant, automated |
| Flair assignment | Manual per post | Automatic |
| Warning system | Manual tracking | Automated |
| Mod workload | High | Significantly reduced |

---

## 👤 Author

**Yashraj Kshatriya**
**Reddit:** u/Primary-Dirt-6166

Built with ❤️ for Reddit moderators everywhere

---

## 📜 License

MIT License
