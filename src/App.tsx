import { useState } from "react";
import ProjectExplorer from "./components/ProjectExplorer";
import VaultEditor from "./components/VaultEditor";

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
        <VaultEditor selectedFile={selectedFile} />
      </main>
    </div>
  );
}

export default App;
