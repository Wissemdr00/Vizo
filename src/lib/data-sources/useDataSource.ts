"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useDataSource(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/app/data-sources/${id}` : null,
    fetcher
  );

  return { dataSource: data, error, isLoading, mutate };
}
