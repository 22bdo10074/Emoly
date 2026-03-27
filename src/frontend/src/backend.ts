/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

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

export interface CreateActorOptions {
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    agent?: Agent;
    processError?: (e: unknown) => never;
}

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null){
        if (blob) {
            this._blob = blob;
        }
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([
            new Uint8Array(blob)
        ], {
            type: 'application/octet-stream'
        }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) {
            return this._blob;
        }
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string {
        return this.directURL;
    }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

export function createActor(
    canisterId: string,
    uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
    options?: CreateActorOptions
): backendInterface {
    const agent = options?.agent ?? new HttpAgent({
        ...options?.agentOptions,
    });
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId,
        ...options?.actorOptions,
    });

    const wrap = async <T>(fn: () => Promise<T>): Promise<T> => {
        try {
            return await fn();
        } catch (e) {
            if (options?.processError) {
                options.processError(e);
            }
            throw e;
        }
    };

    return {
        getStories: () => wrap(() => actor.getStories() as any),
        getStoriesByTheme: (theme) => wrap(() => actor.getStoriesByTheme(theme) as any),
        ventMessage: (message) => wrap(() => actor.ventMessage(message) as any),
        selectStory: (storyId) => wrap(() => actor.selectStory(storyId) as any),
        checkInMood: (mood) => wrap(() => actor.checkInMood(mood) as any),
        getThemes: () => wrap(() => actor.getThemes() as any),
        postMessage: (text, alias) => wrap(() => actor.postMessage(text, alias) as any),
        replyToMessage: (text, alias, replyToId) => wrap(() => actor.replyToMessage(text, alias, replyToId) as any),
        getMessages: () => wrap(() => actor.getMessages() as any),
        getMessageReplies: (messageId) => wrap(() => actor.getMessageReplies(messageId) as any),
    };
}
