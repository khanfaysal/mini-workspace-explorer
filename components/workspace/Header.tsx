"use client";

import { useState } from "react";
import { FiFilePlus, FiFolderPlus, FiMenu, FiSearch } from "react-icons/fi";
import CreateDialog from "./dialogs/CreateDialog";

export default function Header() {
  const [createType, setCreateType] = useState<"folder" | "file" | null>(null);
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn mobile-only"
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
        >
          <FiFolderPlus /> Folder
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setCreateType("file")}
        >
          <FiFilePlus /> File
        </button>
        <button type="button" className="btn">
          <FiSearch /> Search
        </button>
      </div>
      {createType && (
        <CreateDialog
          itemType={createType}
          parentId="root"
          onClose={() => setCreateType(null)}
        />
      )}
    </header>
  );
}
