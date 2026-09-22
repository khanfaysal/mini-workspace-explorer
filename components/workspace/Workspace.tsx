"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";

function WorkspaceShell() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="main-panel">test content</main>
      </div>
    </div>
  );
}

export default function Workspace() {
  return <WorkspaceShell />;
}
