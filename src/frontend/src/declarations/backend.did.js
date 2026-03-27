/* eslint-disable */
// @ts-nocheck
export const idlFactory = ({ IDL }) => {
  const Story = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    theme: IDL.Text,
    excerpt: IDL.Text,
    body: IDL.Text,
  });
  const CompanionResponse = IDL.Record({
    comfort: IDL.Text,
    reflection: IDL.Text,
  });
  const ChatMessage = IDL.Record({
    id: IDL.Nat,
    text: IDL.Text,
    alias: IDL.Text,
    timestamp: IDL.Int,
    replyTo: IDL.Opt(IDL.Nat),
  });
  return IDL.Service({
    getStories: IDL.Func([], [IDL.Vec(Story)], ['query']),
    getStoriesByTheme: IDL.Func([IDL.Text], [IDL.Vec(Story)], ['query']),
    ventMessage: IDL.Func([IDL.Text], [CompanionResponse], ['query']),
    selectStory: IDL.Func([IDL.Nat], [CompanionResponse], ['query']),
    checkInMood: IDL.Func([IDL.Text], [IDL.Text], ['query']),
    getThemes: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    postMessage: IDL.Func([IDL.Text, IDL.Text], [ChatMessage], []),
    replyToMessage: IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [ChatMessage], []),
    getMessages: IDL.Func([], [IDL.Vec(ChatMessage)], ['query']),
    getMessageReplies: IDL.Func([IDL.Nat], [IDL.Vec(ChatMessage)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
