import WorkspaceNav from "@/components/workspace/workspace-nav";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <WorkspaceNav />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
