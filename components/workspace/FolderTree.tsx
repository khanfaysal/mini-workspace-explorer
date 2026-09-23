"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import TreeNode from "./TreeNode";

export default function FolderTree({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { state } = useWorkspace();
  return (
    <nav className="tree" aria-label="Folder tree">
      <TreeNode id={state.rootId} depth={0} onNavigate={onNavigate} />
    </nav>
  );
}
