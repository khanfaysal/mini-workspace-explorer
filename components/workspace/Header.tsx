"use client";

import { FiFileText, FiFolder, FiMenu, FiSearch } from "react-icons/fi";

export default function Header() {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn mobile-only"
        aria-label="Toggle folder tree"
      >
        <FiMenu />
      </button>
      <h1 className="app-title">Mini Workspace Explorer</h1>
      <div className="topbar-actions">
        <button type="button" className="btn">
          <FiFolder /> Folder
        </button>
        <button type="button" className="btn">
          <FiFileText /> File
        </button>
        <button type="button" className="btn">
          <FiSearch /> Search
        </button>
      </div>
    </header>
  );
}
