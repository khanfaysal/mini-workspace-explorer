"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { getChildren } from "@/lib/workspace";
import { WorkspaceItem } from "@/types/workspace";
import { useState } from "react";
import { FiEdit2, FiFile, FiFolder, FiTrash2 } from "react-icons/fi";
import DeleteDialog from "./dialogs/DeleteDialog";
import RenameDialog from "./dialogs/RenameDialog";

export default function FolderContents() {
  const { state, dispatch } = useWorkspace();
  const [renameTarget, setRenameTarget] = useState<WorkspaceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceItem | null>(null);

  const children = getChildren(state, state.selectedFolderId);

  function open(item: WorkspaceItem) {
    if (item.type === "folder") {
      dispatch({ type: "SELECT_FOLDER", payload: { id: item.id } });
    } else {
      dispatch({ type: "OPEN_FILE", payload: { id: item.id } });
    }
  }

  if (children.length === 0) {
    return (
      <div className="empty-state">
        <p>This folder is empty.</p>
        <p className="empty-hint">
          Use “Folder” or “File” above to add something here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="contents-grid">
        {children.map((item) => (
          <div key={item.id} className="item-card">
            <button
              type="button"
              className="item-main"
              onClick={() => open(item)}
            >
              <span className="item-icon" aria-hidden="true">
                {item.type === "folder" ? <FiFolder /> : <FiFile />}
              </span>
              <span className="item-name">{item.name}</span>
            </button>
            <div className="item-actions">
              <button
                type="button"
                className="icon-btn"
                title={`Rename ${item.name}`}
                aria-label={`Rename ${item.name}`}
                onClick={() => setRenameTarget(item)}
              >
                <FiEdit2 />
              </button>
              <button
                type="button"
                className="icon-btn"
                title={`Delete ${item.name}`}
                aria-label={`Delete ${item.name}`}
                onClick={() => setDeleteTarget(item)}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renameTarget && (
        <RenameDialog
          item={renameTarget}
          onClose={() => setRenameTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
