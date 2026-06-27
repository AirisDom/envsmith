import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen, FolderSearch } from "lucide-react";

interface ProjectExplorerProps {
  onDirectorySelected?: (path: string) => void;
}

function ProjectExplorer({ onDirectorySelected }: ProjectExplorerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectFolder = async () => {
    setIsSelecting(true);
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Root Directory",
      });
      if (selected) {
        const path = selected as string;
        setSelectedPath(path);
        onDirectorySelected?.(path);
      }
    } finally {
      setIsSelecting(false);
    }
  };

  const getDisplayPath = (path: string) => {
    const parts = path.split(/[/\\]/);
    if (parts.length <= 3) return path;
    return `.../${parts.slice(-2).join("/")}`;
  };

  return (
    <aside className="w-[280px] flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h1 className="text-lg font-semibold text-slate-100">EnvSmith</h1>
        <p className="text-xs text-slate-500 mt-0.5">Environment Manager</p>
      </div>

      <div className="p-3">
        <button
          onClick={handleSelectFolder}
          disabled={isSelecting}
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          {isSelecting ? "Selecting..." : "Select Root Directory"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selectedPath ? (
          <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <FolderSearch className="w-3.5 h-3.5" />
                <span>Root Directory</span>
              </div>
              <p
                className="text-sm font-mono text-slate-200 truncate"
                title={selectedPath}
              >
                {getDisplayPath(selectedPath)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <FolderSearch className="w-8 h-8 text-slate-700 mb-2" />
            <p className="text-xs text-slate-600">
              Select a directory to scan for environment files
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default ProjectExplorer;
