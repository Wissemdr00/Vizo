"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useDataSources(workspaceId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    workspaceId ? `/api/app/data-sources?workspaceId=${workspaceId}` : null,
    fetcher
  );

  return { dataSources: data || [], error, isLoading, mutate };
}
