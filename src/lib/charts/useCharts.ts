"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useCharts(workspaceId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    workspaceId ? `/api/app/charts?workspaceId=${workspaceId}` : null,
    fetcher
  );

  return { charts: data || [], error, isLoading, mutate };
}
