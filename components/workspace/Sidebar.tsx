"use client";

import FolderTree from "./FolderTree";

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  return (
    <>
      {isOpenMobile && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpenMobile ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">Folders</div>
        <FolderTree onNavigate={onCloseMobile} />
      </aside>
    </>
  );
}
