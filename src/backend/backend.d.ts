import type { ActorSubclass } from "@dfinity/agent";

export interface Story {
  id: bigint;
  title: string;
  theme: string;
  excerpt: string;
  body: string;
}

export interface CompanionResponse {
  comfort: string;
  reflection: string;
}

export interface ChatMessage {
  id: bigint;
  text: string;
  alias: string;
  timestamp: bigint;
  replyTo: [] | [bigint];
}

export interface _SERVICE {
  getStories: () => Promise<Story[]>;
  getStoriesByTheme: (theme: string) => Promise<Story[]>;
  getThemes: () => Promise<string[]>;
  ventMessage: (message: string) => Promise<CompanionResponse>;
  selectStory: (storyId: bigint) => Promise<CompanionResponse>;
  checkInMood: (mood: string) => Promise<string>;
  postMessage: (text: string, alias: string) => Promise<ChatMessage>;
  replyToMessage: (text: string, alias: string, replyToId: bigint) => Promise<ChatMessage>;
  getMessages: () => Promise<ChatMessage[]>;
  getMessageReplies: (messageId: bigint) => Promise<ChatMessage[]>;
}

export declare const createActor: (canisterId: string) => ActorSubclass<_SERVICE>;
export declare const canisterId: string;
