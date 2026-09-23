"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useState } from "react";
import { FiFilePlus, FiFolderPlus, FiMenu, FiSearch } from "react-icons/fi";
import CreateDialog from "./dialogs/CreateDialog";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleSearch: () => void;
  searchOpen: boolean;
}

export default function Header({
  onToggleSidebar,
  onToggleSearch,
  searchOpen,
}: HeaderProps) {
  const { state } = useWorkspace();
  const [createType, setCreateType] = useState<"folder" | "file" | null>(null);
  const selectedFolder = state.items[state.selectedFolderId];

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn mobile-only"
        onClick={onToggleSidebar}
        aria-label="Toggle folder tree"
      >
        <FiMenu />
      </button>
      <h1 className="app-title">Mini Workspace Explorer</h1>
      <div className="topbar-actions">
        <button
          type="button"
          className="btn"
          onClick={() => setCreateType("folder")}
          title={`New folder inside ${selectedFolder?.name ?? "Workspace"}`}
        >
          <FiFolderPlus /> Folder
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setCreateType("file")}
          title={`New file inside ${selectedFolder?.name ?? "Workspace"}`}
        >
          <FiFilePlus /> File
        </button>
        <button
          type="button"
          className={`btn ${searchOpen ? "btn-active" : ""}`}
          onClick={onToggleSearch}
          aria-pressed={searchOpen}
        >
          <FiSearch /> Search
        </button>
      </div>
      {createType && (
        <CreateDialog
          itemType={createType}
          parentId={state.selectedFolderId}
          onClose={() => setCreateType(null)}
        />
      )}
    </header>
  );
}
