import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface backendInterface {
    getStories(): Promise<Story[]>;
    getStoriesByTheme(theme: string): Promise<Story[]>;
    ventMessage(message: string): Promise<CompanionResponse>;
    selectStory(storyId: bigint): Promise<CompanionResponse>;
    checkInMood(mood: string): Promise<string>;
    getThemes(): Promise<string[]>;
    postMessage(text: string, alias: string): Promise<ChatMessage>;
    replyToMessage(text: string, alias: string, replyToId: bigint): Promise<ChatMessage>;
    getMessages(): Promise<ChatMessage[]>;
    getMessageReplies(messageId: bigint): Promise<ChatMessage[]>;
}
