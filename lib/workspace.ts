import { WorkspaceItem, WorkspaceState } from "@/types/workspace";

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getChildren(
  state: WorkspaceState,
  folderId: string,
): WorkspaceItem[] {
  return Object.values(state.items)
    .filter((item) => item.parentId === folderId)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
}

export function getPath(state: WorkspaceState, id: string): WorkspaceItem[] {
  const path: WorkspaceItem[] = [];
  let current: WorkspaceItem | undefined = state.items[id];
  while (current) {
    path.unshift(current);
    current = current.parentId ? state.items[current.parentId] : undefined;
  }
  return path;
}

export function isNameTaken(
  state: WorkspaceState,
  parentId: string,
  name: string,
  excludeId?: string,
): boolean {
  const normalized = name.trim().toLowerCase();
  return Object.values(state.items).some(
    (item) =>
      item.parentId === parentId &&
      item.id !== excludeId &&
      item.name.trim().toLowerCase() === normalized,
  );
}

export function validateName(
  state: WorkspaceState,
  parentId: string,
  name: string,
  excludeId?: string,
): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Name cannot be empty.";
  if (/[\\/]/.test(trimmed)) return "Name cannot contain \\ or /.";
  if (trimmed.length > 100) return "Name is too long.";
  if (isNameTaken(state, parentId, trimmed, excludeId)) {
    return "An item with this name already exists here.";
  }
  return null;
}

export function collectDescendantIds(
  state: WorkspaceState,
  id: string,
): string[] {
  const result: string[] = [];
  const stack = [id];
  while (stack.length) {
    const current = stack.pop() as string;
    Object.values(state.items).forEach((item) => {
      if (item.parentId === current) {
        result.push(item.id);
        if (item.type === "folder") stack.push(item.id);
      }
    });
  }
  return result;
}

export interface SearchResult {
  item: WorkspaceItem;
  pathLabel: string;
}

export function searchWorkspace(
  state: WorkspaceState,
  query: string,
): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return Object.values(state.items)
    .filter(
      (item) =>
        item.id !== state.rootId &&
        item.name.toLowerCase().includes(normalized),
    )
    .map((item) => {
      const path = getPath(state, item.id);
      const pathLabel = path
        .slice(0, -1)
        .map((p) => p.name)
        .join(" / ");
      return { item, pathLabel: pathLabel || "Workspace" };
    })
    .sort((a, b) => a.item.name.localeCompare(b.item.name));
}

export function buildSeedWorkspace(): WorkspaceState {
  const now = Date.now();
  const rootId = "root";
  const items: WorkspaceState["items"] = {};

  const mk = (
    id: string,
    name: string,
    type: "folder" | "file",
    parentId: string | null,
    content?: string,
  ) => {
    items[id] = {
      id,
      name,
      type,
      parentId,
      createdAt: now,
      updatedAt: now,
      ...(type === "file" ? { content: content ?? "" } : {}),
    } as WorkspaceItem;
  };

  mk(rootId, "Workspace", "folder", null);
  mk("projects", "Projects", "folder", rootId);
  mk("webbly", "Webbly", "folder", "projects");
  mk("notes", "notes.txt", "file", "webbly", "Meeting notes go here.");
  mk(
    "tasks",
    "tasks.txt",
    "file",
    "webbly",
    "- [ ] Set up project\n- [ ] Build UI\n- [ ] Ship it",
  );
  mk("personal", "Personal", "folder", "projects");
  mk("documents", "Documents", "folder", rootId);
  mk(
    "readme",
    "README.txt",
    "file",
    rootId,
    "Welcome to your Mini Workspace Explorer!\n\nCreate folders and files from the toolbar above.",
  );

  return {
    items,
    rootId,
    selectedFolderId: rootId,
    openFileId: null,
    expandedFolderIds: [rootId, "projects"],
  };
}
