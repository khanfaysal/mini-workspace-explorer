Project Name: Mini Workspace Explorer

How to run the project:

Requires Node.js 18.18+ and after clone command: npm install, npm run dev
It deploy vercel and its a only client application. By default open http://localhost:3000

Project structure:

Root project name mini-workspace-explorer.
app/ → Next.js pages and global styles.
components/ → All UI parts of the workspace.
context/ → Shares workspace state across components.
reducer/ → Handles actions like create, rename, delete, and save.
types/ → Defines the TypeScript data structures.
lib/ → Reusable logic for workspace operations and browser storage.

State management approach:

I use React useReducer with Context to manage the workspace in one central place. Actions like create, rename, delete, open, and save are handled through the reducer. The app loads saved data from localStorage, saves changes automatically, and warns users before navigating away when there are unsaved file changes.

File-system data structure:
The workspace uses a flat data structure instead of a deeply nested tree. Each item has an id and parentId to define its location.

interface WorkspaceState {
items: Record<string, WorkspaceItem>;
rootId: string;
selectedFolderId: string;
openFileId: string | null;
expandedFolderIds: string[];
}

This approach makes it easier to:

1. Create, rename, and update items
2. Find a folder's children
3. Build breadcrumbs
4. Search the whole workspace
5. Delete a folder and all its contents
6. Support folders nested to any depth

The folder tree uses a recursive TreeNode component, so there is no fixed nesting level.

Any important implement decisions:

1. Simple navigation: The sidebar shows folders, while files are displayed in the main content area.
2. Protected root: The main Workspace folder cannot be renamed or deleted.
3. Name validation: Empty or duplicate names are prevented. Duplicate names are checked within the same folder.
4. Safe deletion: Deleting a folder also deletes everything inside it. If the deleted folder was selected, the user is moved to its parent.
5. Unsaved changes: Users are warned before leaving or deleting a file with unsaved changes.
6. Clear empty states: Empty folders and empty search results show helpful messages instead of blank screens.
7. Responsive design: The sidebar becomes a mobile drawer on smaller screens, and the content adapts to smaller devices.
8. Simple state management: I used React useReducer + Context instead of an external state library because the app has one workspace and does not need additional complexity.
