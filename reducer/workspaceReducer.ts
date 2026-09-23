import {
  collectDescendantIds,
  generateId,
  getPath,
  validateName,
} from "@/lib/workspace";
import { FileItem, WorkspaceItem, WorkspaceState } from "@/types/workspace";

export type WorkspaceAction =
  | { type: "HYDRATE"; payload: WorkspaceState }
  | {
      type: "CREATE_ITEM";
      payload: { parentId: string; name: string; itemType: "folder" | "file" };
    }
  | { type: "RENAME_ITEM"; payload: { id: string; name: string } }
  | { type: "DELETE_ITEM"; payload: { id: string } }
  | { type: "SELECT_FOLDER"; payload: { id: string } }
  | { type: "TOGGLE_EXPAND"; payload: { id: string } }
  | { type: "OPEN_FILE"; payload: { id: string } }
  | { type: "CLOSE_FILE" }
  | { type: "SAVE_FILE"; payload: { id: string; content: string } };

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "HYDRATE": {
      return action.payload;
    }

    case "CREATE_ITEM": {
      const { parentId, name, itemType } = action.payload;
      const parent = state.items[parentId];
      if (!parent || parent.type !== "folder") return state;
      if (validateName(state, parentId, name)) return state;

      const id = generateId();
      const now = Date.now();
      const newItem: WorkspaceItem =
        itemType === "folder"
          ? {
              id,
              name: name.trim(),
              type: "folder",
              parentId,
              createdAt: now,
              updatedAt: now,
            }
          : {
              id,
              name: name.trim(),
              type: "file",
              parentId,
              createdAt: now,
              updatedAt: now,
              content: "",
            };

      return {
        ...state,
        items: { ...state.items, [id]: newItem },
        expandedFolderIds:
          itemType === "folder"
            ? Array.from(new Set([...state.expandedFolderIds, parentId]))
            : state.expandedFolderIds,
      };
    }

    case "RENAME_ITEM": {
      const { id, name } = action.payload;
      const item = state.items[id];
      if (!item || id === state.rootId || item.parentId === null) return state; // root is protected
      if (validateName(state, item.parentId, name, id)) return state;

      return {
        ...state,
        items: {
          ...state.items,
          [id]: { ...item, name: name.trim(), updatedAt: Date.now() },
        },
      };
    }

    case "DELETE_ITEM": {
      const { id } = action.payload;
      if (id === state.rootId) return state;
      const item = state.items[id];
      if (!item) return state;

      const idsToDelete = new Set<string>([
        id,
        ...collectDescendantIds(state, id),
      ]);
      const remainingItems = { ...state.items };
      idsToDelete.forEach((deleteId) => delete remainingItems[deleteId]);

      const fallbackParentId = item.parentId ?? state.rootId;

      const selectedFolderId = idsToDelete.has(state.selectedFolderId)
        ? fallbackParentId
        : state.selectedFolderId;

      const openFileId =
        state.openFileId && idsToDelete.has(state.openFileId)
          ? null
          : state.openFileId;

      const expandedFolderIds = state.expandedFolderIds.filter(
        (fid: string) => !idsToDelete.has(fid),
      );

      return {
        ...state,
        items: remainingItems,
        selectedFolderId,
        openFileId,
        expandedFolderIds,
      };
    }

    case "SELECT_FOLDER": {
      const { id } = action.payload;
      const target = state.items[id];
      if (!target || target.type !== "folder") return state;
      const pathIds = getPath(state, id).map((p) => p.id);
      return {
        ...state,
        selectedFolderId: id,
        expandedFolderIds: Array.from(
          new Set([...state.expandedFolderIds, ...pathIds]),
        ),
      };
    }

    case "TOGGLE_EXPAND": {
      const { id } = action.payload;
      const isExpanded = state.expandedFolderIds.includes(id);
      return {
        ...state,
        expandedFolderIds: isExpanded
          ? state.expandedFolderIds.filter((fid: string) => fid !== id)
          : [...state.expandedFolderIds, id],
      };
    }

    case "OPEN_FILE": {
      const { id } = action.payload;
      const item = state.items[id];
      if (!item || item.type !== "file") return state;
      const parentId = item.parentId ?? state.rootId;
      const pathIds = getPath(state, parentId).map((p) => p.id);
      return {
        ...state,
        openFileId: id,
        selectedFolderId: parentId,
        expandedFolderIds: Array.from(
          new Set([...state.expandedFolderIds, ...pathIds]),
        ),
      };
    }

    case "CLOSE_FILE": {
      return { ...state, openFileId: null };
    }

    case "SAVE_FILE": {
      const { id, content } = action.payload;
      const item = state.items[id];
      if (!item || item.type !== "file") return state;
      const updated: FileItem = { ...item, content, updatedAt: Date.now() };
      return { ...state, items: { ...state.items, [id]: updated } };
    }

    default:
      return state;
  }
}
