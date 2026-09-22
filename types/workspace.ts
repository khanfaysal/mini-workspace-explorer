type WorkspaceItem = FolderItem | FileItem;

interface WorkspaceState {
  items: Record<string, WorkspaceItem>;
  rootId: string;
  selectedFolderId: string;
  openFileId: string | null;
  expandedFolderIds: string[];
}
