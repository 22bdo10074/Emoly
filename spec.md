# Emoly

## Current State
- E'm You page: a single vent textarea that submits to backend and receives one AI-like response. No actual chat.
- E'm Hu page: a story library grid; clicking a story shows one canned companion response. No ongoing conversation.
- Backend: stories array, ventMessage, selectStory, checkInMood endpoints.

## Requested Changes (Diff)

### Add
- **E'm You** — anonymous human-to-human chat board: users post anonymous messages, others can reply and react ("hug" reaction). Messages stored in backend canister. Auto-assigned anonymous alias per session (e.g. "Quiet Fox", "Gentle Star"). Poll for new messages every 5s.
- **E'm Hu** — multi-turn story companion chat: after selecting a story, open a chat panel where the companion engages the user in a back-and-forth conversation. Each message from user gets a contextual empathetic reply based on story theme. Conversation state lives in frontend (no backend needed). Companion leads with reflection questions and supportive responses.
- Backend: ChatMessage type, postMessage, getMessages, replyToMessage endpoints.

### Modify
- E'm You page: replace vent form with a full chat interface (message feed + input box).
- E'm Hu page: story card click opens a chat modal instead of a static response modal.
- useQueries.ts: add hooks for chat messages (useGetMessages, usePostMessage, useReplyMessage).

### Remove
- Old vent form layout from E'm You.
- Static single-response modal from E'm Hu.

## Implementation Plan
1. Update backend (main.mo) to add ChatMessage storage with postMessage, getMessages, replyToMessage.
2. Update backend.d.ts to reflect new types and methods.
3. Update useQueries.ts with new chat hooks.
4. Rebuild EmYouPage.tsx as a real-time anonymous chat board.
5. Rebuild EmHuPage.tsx story modal as a multi-turn companion chat.
