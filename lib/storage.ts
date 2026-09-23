import { WorkspaceState } from "@/types/workspace";

const STORAGE_KEY = "mini-workspace-explorer:v1";

export function loadWorkspace(): WorkspaceState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkspaceState;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.items ||
      !parsed.rootId
    ) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to load workspace from localStorage", err);
    return null;
  }
}

export function saveWorkspace(state: WorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save workspace to localStorage", err);
  }
}
