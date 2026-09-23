"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { getChildren } from "@/lib/workspace";
import { FiCornerDownRight, FiCornerLeftDown, FiFolder } from "react-icons/fi";

interface TreeNodeProps {
  id: string;
  depth: number;
  onNavigate?: () => void;
}

export default function TreeNode({ id, depth, onNavigate }: TreeNodeProps) {
  const { state, dispatch } = useWorkspace();
  const item = state.items[id];
  if (!item || item.type !== "folder") return null;

  const childFolders = getChildren(state, id).filter(
    (child) => child.type === "folder",
  );
  const isExpanded = state.expandedFolderIds.includes(id);
  const isSelected = state.selectedFolderId === id;
  const hasChildren = childFolders.length > 0;

  return (
    <div>
      <div
        className={`tree-row ${isSelected ? "tree-row-selected" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <button
          type="button"
          className="tree-toggle"
          onClick={() => dispatch({ type: "TOGGLE_EXPAND", payload: { id } })}
          aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
          aria-hidden={!hasChildren}
          tabIndex={hasChildren ? 0 : -1}
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {isExpanded ? <FiCornerLeftDown /> : <FiCornerDownRight />}
        </button>
        <button
          type="button"
          className="tree-label"
          onClick={() => {
            dispatch({ type: "SELECT_FOLDER", payload: { id } });
            onNavigate?.();
          }}
          title={item.name}
        >
          <span className="item-icon" aria-hidden="true">
            <FiFolder />
          </span>
          <span className="tree-label-text">{item.name}</span>
        </button>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {childFolders.map((child) => (
            <TreeNode
              key={child.id}
              id={child.id}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
