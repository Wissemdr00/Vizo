# Story 3.3: Chat UI with Streaming

## Status: ✅ Complete

## Story
As a user, I want a real-time chat interface with streaming AI responses.

## Acceptance Criteria
- [x] `useChat` hook from `ai/react` for streaming
- [x] Split-panel layout (sidebar + chat)
- [x] Message bubbles with user/assistant styling
- [x] Credit counter display
- [x] Stop generation button
- [x] Auto-scroll to latest message

### Files Created
- `src/components/chat/chat-panel.tsx` — Main chat interface with useChat
- `src/components/chat/message-bubble.tsx` — Styled message component
- `src/components/chat/credit-counter.tsx` — Remaining credits display
- `src/components/chat/tool-call-indicator.tsx` — Shows when tools are executing
- `src/app/(in-app)/app/workspace/[id]/chat/page.tsx` — Chat page layout
- `src/app/api/app/chat/route.ts` — Streaming chat API with `streamText`

### Technical Notes
- Uses `ai/react` `useChat` hook (compatible with `ai@4.x`)
- Streaming via `streamText` from Vercel AI SDK
- Credit deduction on each user message via Indie Kit credits system
- Messages persisted to DB after streaming completes
