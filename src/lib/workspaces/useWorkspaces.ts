import useSWR from "swr";

export interface WorkspaceListItem {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  dataSourceCount: number;
  conversationCount: number;
}

interface WorkspacesResponse {
  workspaces: WorkspaceListItem[];
}

const useWorkspaces = () => {
  const { data, isLoading, error, mutate } =
    useSWR<WorkspacesResponse>("/api/app/workspaces");

  return {
    workspaces: data?.workspaces ?? [],
    isLoading,
    error,
    mutate,
  };
};

export default useWorkspaces;
