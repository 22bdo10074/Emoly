import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

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

export function useGetStories() {
  const { actor, isFetching } = useActor();
  return useQuery<Story[]>({
    queryKey: ["stories"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getStories() as Promise<Story[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStoriesByTheme(theme: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Story[]>({
    queryKey: ["stories", theme],
    queryFn: async () => {
      if (!actor) return [];
      if (theme === "all") {
        return (actor as any).getStories() as Promise<Story[]>;
      }
      return (actor as any).getStoriesByTheme(theme) as Promise<Story[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVentMessage() {
  const { actor } = useActor();
  return useMutation<CompanionResponse, Error, string>({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).ventMessage(message) as Promise<CompanionResponse>;
    },
  });
}

export function useSelectStory() {
  const { actor } = useActor();
  return useMutation<CompanionResponse, Error, bigint>({
    mutationFn: async (storyId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).selectStory(storyId) as Promise<CompanionResponse>;
    },
  });
}

export function useCheckInMood() {
  const { actor } = useActor();
  return useMutation<string, Error, string>({
    mutationFn: async (mood: string) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).checkInMood(mood) as Promise<string>;
    },
  });
}

export function useGetMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getMessages() as Promise<ChatMessage[]>;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function usePostMessage() {
  const { actor } = useActor();
  return useMutation<ChatMessage, Error, { text: string; alias: string }>({
    mutationFn: async ({ text, alias }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).postMessage(text, alias) as Promise<ChatMessage>;
    },
  });
}

export function useReplyToMessage() {
  const { actor } = useActor();
  return useMutation<
    ChatMessage,
    Error,
    { text: string; alias: string; replyToId: bigint }
  >({
    mutationFn: async ({ text, alias, replyToId }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).replyToMessage(
        text,
        alias,
        replyToId,
      ) as Promise<ChatMessage>;
    },
  });
}
