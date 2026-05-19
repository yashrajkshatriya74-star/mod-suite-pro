import { Hono } from 'hono';
import type { MenuItemRequest, UiResponse } from '@devvit/web/shared';
import type { FormField } from '@devvit/shared-types/shared/form.js';

export const menu = new Hono();

const buildNukeFields = (targetId: string): FormField[] => [
  {
    name: 'targetId',
    label: 'Target ID',
    type: 'string',
    helpText: 'Auto-filled from the selected item.',
    required: true,
    defaultValue: targetId,
  },
  {
    name: 'remove',
    label: 'Remove comments',
    type: 'boolean',
    defaultValue: true,
  },
  {
    name: 'lock',
    label: 'Lock comments',
    type: 'boolean',
    defaultValue: false,
  },
  {
    name: 'skipDistinguished',
    label: 'Skip distinguished comments',
    type: 'boolean',
    defaultValue: false,
  },
];

const buildNukeForm = (title: string, targetId: string) => ({
  fields: buildNukeFields(targetId),
  title,
  acceptLabel: 'Mop',
  cancelLabel: 'Cancel',
});

// 🛡️ Dashboard
menu.post('/dashboard', async (c) => {
  return c.json<UiResponse>(
    {
      showForm: {
        name: 'mopPost',
        form: {
          title: '🛡️ Mod Suite Pro Dashboard',
          fields: [
            {
              name: 'info',
              label: '📊 Active Features',
              type: 'string',
              defaultValue: '✅ Spam Detection | ✅ Auto Flair | ✅ Warning System',
            },
            {
              name: 'spam_keywords',
              label: '🚫 Spam Keywords Active',
              type: 'string',
              defaultValue: 'click here, free money, win prize, buy now...',
            },
            {
              name: 'warning_keywords',
              label: '⚠️ Warning Keywords Active',
              type: 'string',
              defaultValue: 'stupid, hate, idiot, abuse...',
            },
          ],
          acceptLabel: 'Close',
          cancelLabel: 'Cancel',
        },
      },
    },
    200
  );
});

// 🚫 Check Spam
menu.post('/check-spam', async (c) => {
  const request = await c.req.json<MenuItemRequest>();
  console.log(`🔍 Manual spam check requested for: ${request.targetId}`);
  
  return c.json<UiResponse>(
    {
      showForm: {
        name: 'mopPost',
        form: {
          title: '🚫 Spam Check Result',
          fields: [
            {
              name: 'result',
              label: '🔍 Analysis Result',
              type: 'string',
              defaultValue: 'Post analyzed — Check PowerShell logs for details',
            },
            {
              name: 'postId',
              label: '📋 Post ID',
              type: 'string',
              defaultValue: request.targetId,
            },
          ],
          acceptLabel: 'OK',
          cancelLabel: 'Cancel',
        },
      },
    },
    200
  );
});

// ⚠️ Warn User
menu.post('/warn-user', async (c) => {
  const request = await c.req.json<MenuItemRequest>();
  console.log(`⚠️ Warning issued for post: ${request.targetId}`);

  return c.json<UiResponse>(
    {
      showForm: {
        name: 'mopPost',
        form: {
          title: '⚠️ Issue Warning',
          fields: [
            {
              name: 'reason',
              label: 'Warning Reason',
              type: 'string',
              required: true,
              defaultValue: 'Please follow subreddit rules',
            },
            {
              name: 'postId',
              label: 'Post ID',
              type: 'string',
              defaultValue: request.targetId,
            },
          ],
          acceptLabel: 'Send Warning',
          cancelLabel: 'Cancel',
        },
      },
    },
    200
  );
});

// Mop Comment
menu.post('/mop-comment', async (c) => {
  const request = await c.req.json<MenuItemRequest>();
  console.log('request', request.targetId);
  return c.json<UiResponse>(
    {
      showForm: {
        name: 'mopComment',
        form: buildNukeForm('Mop Comments', request.targetId),
      },
    },
    200
  );
});

// Mop Post
menu.post('/mop-post', async (c) => {
  const request = await c.req.json<MenuItemRequest>();
  return c.json<UiResponse>(
    {
      showForm: {
        name: 'mopPost',
        form: buildNukeForm('Mop Post Comments', request.targetId),
      },
    },
    200
  );
});
