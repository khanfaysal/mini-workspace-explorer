"use client";

import { WorkspaceProvider, useWorkspace } from "@/context/WorkspaceContext";
import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import FileEditor from "./FileEditor";
import FolderContents from "./FolderContents";
import Header from "./Header";
import Search from "./Search";
import Sidebar from "./Sidebar";

function WorkspaceShell() {
  const { state } = useWorkspace();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onToggleSearch={() => setSearchOpen((v) => !v)}
        searchOpen={searchOpen}
      />
      <div className="app-body">
        <Sidebar
          isOpenMobile={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />
        <main className="main-panel">
          {searchOpen ? (
            <Search onClose={() => setSearchOpen(false)} />
          ) : (
            <>
              <Breadcrumbs />
              {state.openFileId ? (
                <FileEditor fileId={state.openFileId} />
              ) : (
                <FolderContents />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Workspace() {
  return (
    <WorkspaceProvider>
      <WorkspaceShell />
    </WorkspaceProvider>
  );
}
