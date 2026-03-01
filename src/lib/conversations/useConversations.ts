"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useConversations(workspaceId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    workspaceId ? `/api/app/conversations?workspaceId=${workspaceId}` : null,
    fetcher
  );

  return { conversations: data || [], error, isLoading, mutate };
}
