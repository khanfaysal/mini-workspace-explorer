"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { collectDescendantIds } from "@/lib/workspace";
import { WorkspaceItem } from "@/types/workspace";

export default function DeleteDialog({
  item,
  onClose,
}: {
  item: WorkspaceItem;
  onClose: () => void;
}) {
  const { state, dispatch } = useWorkspace();
  const descendantCount =
    item.type === "folder" ? collectDescendantIds(state, item.id).length : 0;

  function handleConfirm() {
    dispatch({ type: "DELETE_ITEM", payload: { id: item.id } });
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
        <h2>Delete {item.type === "folder" ? "Folder" : "File"}</h2>
        <p>
          Are you sure you want to delete <strong>{item.name}</strong>?
          {descendantCount > 0 && (
            <>
              {" "}
              This will also delete {descendantCount} item
              {descendantCount === 1 ? "" : "s"} inside it.
            </>
          )}{" "}
          You can not undo this action.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
