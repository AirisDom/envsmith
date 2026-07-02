import { useState, useCallback } from "react";
import ProjectExplorer from "./components/ProjectExplorer";
import VaultEditor from "./components/VaultEditor";
import ToastContainer, { ToastData } from "./components/Toast";

function App() {
  const [_selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isEditorLoading, setIsEditorLoading] = useState(false);

  const addToast = useCallback((type: "success" | "error", message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      <ProjectExplorer
        onDirectorySelected={setSelectedDirectory}
        onFileSelected={setSelectedFile}
        selectedFile={selectedFile}
        onToast={addToast}
        isEditorLoading={isEditorLoading}
      />
      <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        <header className="h-14 flex-shrink-0 border-b border-slate-800 flex items-center px-6 transition-colors duration-200">
          <h2 className="text-sm font-medium text-slate-400">The Vault</h2>
        </header>
        <VaultEditor
          selectedFile={selectedFile}
          onToast={addToast}
          onLoadingChange={setIsEditorLoading}
        />
      </main>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
