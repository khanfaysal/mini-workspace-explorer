"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import { searchWorkspace } from "@/lib/workspace";
import { useMemo, useState } from "react";
import { FiFile, FiFolder } from "react-icons/fi";

export default function Search({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useWorkspace();
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchWorkspace(state, query), [state, query]);

  function goTo(id: string) {
    const item = state.items[id];
    if (!item) return;
    if (item.type === "folder") {
      dispatch({ type: "SELECT_FOLDER", payload: { id } });
    } else {
      dispatch({ type: "OPEN_FILE", payload: { id } });
    }
    onClose();
  }

  return (
    <div className="search-panel">
      <div className="search-input-row">
        <input
          autoFocus
          className="search-input"
          placeholder="Search files and folders…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>

      {query.trim() ? (
        results.length === 0 ? (
          <p className="empty-hint">No items match “{query.trim()}”.</p>
        ) : (
          <div className="search-results">
            {results.map(({ item, pathLabel }) => (
              <button
                type="button"
                key={item.id}
                className="search-result"
                onClick={() => goTo(item.id)}
              >
                <span className="item-icon" aria-hidden="true">
                  {item.type === "folder" ? <FiFolder /> : <FiFile />}
                </span>
                <span className="search-result-text">
                  <span className="search-result-name">{item.name}</span>
                  <span className="search-result-path">{pathLabel}</span>
                </span>
              </button>
            ))}
          </div>
        )
      ) : (
        <p className="empty-hint">
          Type to search across every folder in your workspace.
        </p>
      )}
    </div>
  );
}
