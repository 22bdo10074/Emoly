/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

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
  getStories: ActorMethod<[], Story[]>;
  getStoriesByTheme: ActorMethod<[string], Story[]>;
  ventMessage: ActorMethod<[string], CompanionResponse>;
  selectStory: ActorMethod<[bigint], CompanionResponse>;
  checkInMood: ActorMethod<[string], string>;
  getThemes: ActorMethod<[], string[]>;
  postMessage: ActorMethod<[string, string], ChatMessage>;
  replyToMessage: ActorMethod<[string, string, bigint], ChatMessage>;
  getMessages: ActorMethod<[], ChatMessage[]>;
  getMessageReplies: ActorMethod<[bigint], ChatMessage[]>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
