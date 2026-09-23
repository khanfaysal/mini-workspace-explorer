"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useEffect, useState } from "react";
import { FiFile } from "react-icons/fi";

export default function FileEditor({ fileId }: { fileId: string }) {
  const { state, dispatch, setFileDirty } = useWorkspace();
  const file = state.items[fileId];
  const [content, setContent] = useState(
    file?.type === "file" ? file.content : "",
  );
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (file?.type === "file") {
      setContent(file.content);
    }
    setFileDirty(fileId, false);
    setJustSaved(false);
  }, [fileId]);

  const isDirty = file?.type === "file" ? content !== file.content : false;

  useEffect(() => {
    setFileDirty(fileId, isDirty);
  }, [isDirty, fileId, setFileDirty]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  if (!file || file.type !== "file") {
    return null;
  }

  const savedContent = file.content;

  function handleSave() {
    dispatch({ type: "SAVE_FILE", payload: { id: fileId, content } });
    setFileDirty(fileId, false);
    setJustSaved(true);
  }

  function handleDiscard() {
    setContent(savedContent);
    setFileDirty(fileId, false);
  }

  return (
    <div className="file-editor">
      <div className="file-editor-toolbar">
        <span className="file-editor-name">
          <FiFile /> {file.name}
        </span>
        <span
          className={`dirty-badge ${isDirty ? "dirty-badge-dirty" : justSaved ? "dirty-badge-saved" : ""}`}
        >
          {isDirty ? "Unsaved changes" : justSaved ? "Saved" : ""}
        </span>
        <div className="file-editor-actions">
          <button
            type="button"
            className="btn"
            onClick={handleDiscard}
            disabled={!isDirty}
          >
            Discard
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => dispatch({ type: "CLOSE_FILE" })}
          >
            Close
          </button>
        </div>
      </div>
      <textarea
        className="file-editor-textarea"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setJustSaved(false);
        }}
        spellCheck={false}
        aria-label={`Contents of ${file.name}`}
      />
    </div>
  );
}
