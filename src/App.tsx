import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

function App() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleSelectFolder = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Select Root Directory",
    });
    if (selected) {
      setSelectedPath(selected as string);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      <aside className="w-[280px] flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-lg font-semibold text-slate-100">EnvSmith</h1>
          <p className="text-xs text-slate-500 mt-0.5">Environment Manager</p>
        </div>
        <div className="p-3">
          <button
            onClick={handleSelectFolder}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg font-medium text-sm transition-colors"
          >
            Select Root Directory
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {selectedPath && (
            <div className="text-xs text-slate-400">
              <span className="text-slate-500">Root:</span>
              <p className="mt-1 truncate font-mono text-slate-300">{selectedPath}</p>
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        <header className="h-14 flex-shrink-0 border-b border-slate-800 flex items-center px-6">
          <h2 className="text-sm font-medium text-slate-400">The Vault</h2>
        </header>
        <div className="flex-1 flex items-center justify-center overflow-auto">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-300">No file selected</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              Select a root directory and choose an environment file to view and edit its variables.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
