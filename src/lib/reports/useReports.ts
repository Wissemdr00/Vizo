"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useReports(workspaceId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    workspaceId ? `/api/app/reports?workspaceId=${workspaceId}` : null,
    fetcher
  );

  return { reports: data || [], error, isLoading, mutate };
}
