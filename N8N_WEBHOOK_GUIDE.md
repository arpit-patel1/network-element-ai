# n8n Webhook Configuration Guide

## Overview
Your Next.js app now supports real-time enhancement status updates. When a post is created, it starts with `enhancement_status: 'enhancing'` and shows a pulsing "⚡ Enhancing" badge.

## What Your n8n Webhook Should Do

### 1. Receive the Webhook Trigger
When a post is created or updated in Supabase, your webhook receives the post data.

### 2. Enhance the Post Content
Process the post with your AI/enhancement logic (title, subtitle, content, tags, etc.).

### 3. Update the Post in Supabase
**Important:** When updating the post, make sure to include:

```json
{
  "title": "Enhanced Title",
  "subtitle": "Enhanced Subtitle", 
  "content": "Enhanced content...",
  "tags": ["tag1", "tag2"],
  "enhancement_status": "enhanced"  // 👈 This is critical!
}
```

### Example n8n Supabase Update Node Configuration

**Table**: `posts`
**Operation**: Update
**Match Column**: `id`
**Match Value**: `{{ $json.record.id }}`

**Fields to Update**:
- `title`: Your enhanced title
- `subtitle`: Your enhanced subtitle (optional)
- `content`: Your enhanced content
- `tags`: Your enhanced tags array
- `enhancement_status`: `"enhanced"` (set this to mark completion)

## Status Values

| Status | Description | Badge in UI |
|--------|-------------|-------------|
| `enhancing` | AI enhancement in progress | 🔄 Amber badge with pulsing ⚡ |
| `enhanced` | Enhancement complete | ✨ Green badge |
| `none` | No enhancement needed | No badge shown |

## Testing the Real-Time Updates

1. Create a new post in your app
2. Watch the post list - it should show "⚡ Enhancing" badge
3. Your n8n webhook processes the post
4. When webhook updates `enhancement_status` to `"enhanced"`
5. The badge automatically changes to "✨ Enhanced" (no page refresh needed!)

## Webhook Trigger Configuration

In Supabase, your webhook should be triggered on:
- **Table**: `posts`
- **Event**: `INSERT` (for new posts)
- **Event**: `UPDATE` (if you want to re-enhance edited posts)

## Troubleshooting

### Badge doesn't update
- Check browser console for realtime events
- Verify `enhancement_status` field is being updated in Supabase
- Ensure Realtime is enabled for the `posts` table in Supabase Dashboard

### Post not found in list
- Check if the post's `is_published` matches your filter criteria
- Verify the user has permission to see the post (RLS policies)

