"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { getPath } from "@/lib/workspace";

export default function Breadcrumbs() {
  const { state, dispatch } = useWorkspace();
  const path = getPath(state, state.selectedFolderId);

  return (
    <div className="breadcrumbs" aria-label="Breadcrumb">
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        return (
          <span key={item.id} className="breadcrumb-item">
            <button
              type="button"
              className="breadcrumb-btn"
              onClick={() =>
                dispatch({ type: "SELECT_FOLDER", payload: { id: item.id } })
              }
              disabled={isLast}
              aria-current={isLast ? "page" : undefined}
            >
              {item.name}
            </button>
            {!isLast && (
              <span className="breadcrumb-sep" aria-hidden="true">
                /
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
