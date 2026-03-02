# Story 3.2: Conversation Management

## Status: ✅ Complete

## Story
As a user, I want to create, list, and manage conversations within my workspace.

## Acceptance Criteria
- [x] CRUD API for conversations
- [x] SWR hook for real-time conversation list
- [x] Sidebar conversation list in workspace
- [x] Conversations scoped to workspace

### Files Created
- `src/app/api/app/conversations/route.ts` — List + create conversations
- `src/app/api/app/conversations/[id]/route.ts` — GET/PATCH/DELETE single conversation
- `src/lib/conversations/useConversations.ts` — SWR hook for conversation list
- `src/components/workspace/conversation-sidebar.tsx` — Sidebar with conversation list

### Technical Notes
- Conversations belong to workspaces (not directly to users)
- Title defaults to "New Analysis", updated after first AI response
- Delete cascades to messages via FK constraint
