import { useState } from "react";
import ProjectExplorer from "./components/ProjectExplorer";

function App() {
  const [_selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      <ProjectExplorer
        onDirectorySelected={setSelectedDirectory}
        onFileSelected={setSelectedFile}
        selectedFile={selectedFile}
      />
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
