"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { validateName } from "@/lib/workspace";
import { WorkspaceItem } from "@/types/workspace";
import React, { useState } from "react";

export default function RenameDialog({
  item,
  onClose,
}: {
  item: WorkspaceItem;
  onClose: () => void;
}) {
  const { state, dispatch } = useWorkspace();
  const [name, setName] = useState(item.name);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (item.parentId === null) {
      onClose();
      return;
    }
    const validationError = validateName(state, item.parentId, name, item.id);
    if (validationError) {
      setError(validationError);
      return;
    }
    dispatch({ type: "RENAME_ITEM", payload: { id: item.id, name } });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2>Rename {item.type === "folder" ? "Folder" : "File"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            className="modal-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            onFocus={(e) => e.target.select()}
          />
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
