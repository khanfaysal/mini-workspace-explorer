"use client";

import { loadWorkspace, saveWorkspace } from "@/lib/storage";
import { buildSeedWorkspace } from "@/lib/workspace";
import { WorkspaceAction, workspaceReducer } from "@/reducer/workspaceReducer";
import { WorkspaceState } from "@/types/workspace";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

interface WorkspaceContextValue {
  state: WorkspaceState;
  dispatch: (action: WorkspaceAction) => void;
  setFileDirty: (fileId: string, dirty: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined,
);

function initState(): WorkspaceState {
  return loadWorkspace() ?? buildSeedWorkspace();
}

const NAVIGATION_ACTION_TYPES = new Set([
  "SELECT_FOLDER",
  "OPEN_FILE",
  "CLOSE_FILE",
]);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(
    workspaceReducer,
    undefined as unknown as WorkspaceState,
    initState,
  );
  const [mounted, setMounted] = useState(false);
  const dirtyFileIdRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveWorkspace(state);
  }, [state, mounted]);

  function setFileDirty(fileId: string, dirty: boolean) {
    if (dirty) {
      dirtyFileIdRef.current = fileId;
    } else if (dirtyFileIdRef.current === fileId) {
      dirtyFileIdRef.current = null;
    }
  }

  function dispatch(action: WorkspaceAction) {
    const dirtyId = dirtyFileIdRef.current;
    if (dirtyId) {
      const leavesDirtyFile =
        NAVIGATION_ACTION_TYPES.has(action.type) &&
        !(action.type === "OPEN_FILE" && action.payload.id === dirtyId);
      const deletesDirtyFile =
        action.type === "DELETE_ITEM" && action.payload.id === dirtyId;

      if (leavesDirtyFile || deletesDirtyFile) {
        const name = state.items[dirtyId]?.name ?? "this file";
        const proceed = window.confirm(
          `You have unsaved changes in "${name}". Leave without saving?`,
        );
        if (!proceed) return;
        dirtyFileIdRef.current = null;
      }
    }
    rawDispatch(action);
  }

  if (!mounted) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        Loading workspace…
      </div>
    );
  }

  return (
    <WorkspaceContext.Provider value={{ state, dispatch, setFileDirty }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
