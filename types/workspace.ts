export type ItemType = "folder" | "file";

export interface BaseItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface FolderItem extends BaseItem {
  type: "folder";
}

export interface FileItem extends BaseItem {
  type: "file";
  content: string;
}

export type WorkspaceItem = FolderItem | FileItem;

export interface WorkspaceState {
  items: Record<string, WorkspaceItem>;
  rootId: string;
  selectedFolderId: string;
  openFileId: string | null;
  expandedFolderIds: string[];
}
