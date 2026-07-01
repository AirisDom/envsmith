import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { AlertTriangle, FolderOpen, FolderSearch, Loader2, FileX, RefreshCw } from "lucide-react";
import FileListItem from "./FileListItem";

interface ProjectExplorerProps {
  onDirectorySelected?: (path: string) => void;
  onFileSelected?: (path: string) => void;
  selectedFile?: string | null;
  onToast?: (type: "success" | "error", message: string) => void;
}

function ProjectExplorer({ onDirectorySelected, onFileSelected, selectedFile, onToast }: ProjectExplorerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [envFiles, setEnvFiles] = useState<string[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleSelectFolder = async () => {
    setIsSelecting(true);
    setScanError(null);
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
        await scanDirectory(path);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to open folder picker";
      onToast?.("error", message);
    } finally {
      setIsSelecting(false);
    }
  };

  const scanDirectory = async (path: string) => {
    setIsScanning(true);
    setScanError(null);
    setEnvFiles([]);
    try {
      const files = await invoke<string[]>("scan_directory", { targetPath: path });
      setEnvFiles(files);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to scan directory";
      setScanError(message);
      onToast?.("error", `Scan failed: ${message}`);
    } finally {
      setIsScanning(false);
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
          disabled={isSelecting || isScanning}
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

            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                <p className="text-xs text-slate-500">Scanning for .env files...</p>
              </div>
            ) : scanError ? (
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-300 mb-1">Scan Failed</p>
                    <p className="text-xs text-red-400/80 break-words">{scanError}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => selectedPath && scanDirectory(selectedPath)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-800/30 hover:bg-red-800/50 border border-red-700/50 text-red-300 text-xs font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Scan
                </button>
              </div>
            ) : envFiles.length > 0 ? (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 mb-2">
                  {envFiles.length} file{envFiles.length !== 1 ? "s" : ""} found
                </p>
                {envFiles.map((filePath) => (
                  <FileListItem
                    key={filePath}
                    filePath={filePath}
                    isSelected={selectedFile === filePath}
                    rootPath={selectedPath}
                    onClick={(path) => onFileSelected?.(path)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileX className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-500">No .env files found</p>
                <p className="text-xs text-slate-600 mt-1">
                  Try selecting a different directory
                </p>
              </div>
            )}
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
