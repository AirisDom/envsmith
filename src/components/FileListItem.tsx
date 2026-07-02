import { FileText, Loader2 } from "lucide-react";

interface FileListItemProps {
  filePath: string;
  isSelected: boolean;
  rootPath: string | null;
  onClick: (path: string) => void;
  disabled?: boolean;
}

function FileListItem({ filePath, isSelected, rootPath, onClick, disabled }: FileListItemProps) {
  const getFileName = (path: string): string => {
    const parts = path.split(/[/\\]/);
    return parts[parts.length - 1];
  };

  const getRelativePath = (path: string): string => {
    if (!rootPath) return path;
    const relative = path.replace(rootPath, "").replace(/^[/\\]/, "");
    return relative || getFileName(path);
  };

  return (
    <button
      onClick={() => !disabled && onClick(filePath)}
      disabled={disabled}
      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-start gap-2 group ${
        isSelected
          ? "bg-blue-600/20 border border-blue-500/50 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/5"
          : "hover:bg-slate-800/70 border border-transparent hover:border-slate-700/50 hover:shadow-md hover:shadow-slate-900/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98]"}`}
      title={filePath}
    >
      {disabled && isSelected ? (
        <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400 animate-spin" />
      ) : (
        <FileText
          className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-200 ${
            isSelected ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400 group-hover:scale-110"
          }`}
        />
      )}
      <div className="min-w-0 flex-1 overflow-hidden">
        <p
          className={`text-sm font-medium truncate transition-colors duration-200 ${
            isSelected ? "text-blue-300" : "text-slate-300 group-hover:text-slate-200"
          }`}
        >
          {getFileName(filePath)}
        </p>
        <p className="text-xs text-slate-500 truncate transition-colors duration-200 group-hover:text-slate-400">
          {getRelativePath(filePath)}
        </p>
      </div>
    </button>
  );
}

export default FileListItem;
