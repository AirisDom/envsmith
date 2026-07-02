import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AlertTriangle, FileKey2, Loader2, Plus, Save, RefreshCw } from "lucide-react";
import EnvRow from "./EnvRow";

interface EnvEntry {
  key: string;
  value: string;
}

interface VaultEditorProps {
  selectedFile: string | null;
  onToast: (type: "success" | "error", message: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

function VaultEditor({ selectedFile, onToast, onLoadingChange }: VaultEditorProps) {
  const [entries, setEntries] = useState<EnvEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isDisabled = loading || saving;

  const notifyLoadingChange = useCallback((isLoading: boolean) => {
    onLoadingChange?.(isLoading);
  }, [onLoadingChange]);

  useEffect(() => {
    notifyLoadingChange(loading);
  }, [loading, notifyLoadingChange]);

  const handleEntryChange = (index: number, field: "key" | "value", newValue: string) => {
    if (isDisabled) return;
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  };

  const handleAddEntry = () => {
    if (isDisabled) return;
    setEntries((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleDeleteEntry = (index: number) => {
    if (isDisabled) return;
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedFile || isDisabled) return;
    setSaving(true);
    try {
      const content = entries
        .filter((e) => e.key.trim() !== "")
        .map((e) => `${e.key}="${e.value}"`)
        .join("\n");
      await invoke("write_env_file", { filePath: selectedFile, content });
      onToast("success", "Changes saved successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      onToast("error", `Failed to save: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const loadFile = useCallback(async (filePath: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<EnvEntry[]>("read_env_file", {
        filePath,
      });
      setEntries(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setEntries([]);
      onToast("error", `Failed to read file: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    if (!selectedFile) {
      setEntries([]);
      setError(null);
      return;
    }
    loadFile(selectedFile);
  }, [selectedFile, loadFile]);

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/80 flex items-center justify-center ring-1 ring-slate-700/50 transition-all duration-300 hover:ring-slate-600/50 hover:bg-slate-800">
            <FileKey2 className="w-10 h-10 text-slate-500 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No File Selected</h3>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            Select a .env file to view and edit its contents
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <div className="absolute inset-0 blur-xl bg-emerald-500/30 animate-pulse" />
          </div>
          <span className="text-sm animate-pulse-subtle">Loading file...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center animate-scale-in">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/30 flex items-center justify-center ring-1 ring-red-800/50 transition-all duration-300 hover:ring-red-700/50">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-red-300 mb-2">Error Loading File</h3>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">{error}</p>
          <button
            type="button"
            onClick={() => selectedFile && loadFile(selectedFile)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 hover:border-slate-600 text-slate-300 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/80 flex items-center justify-center ring-1 ring-slate-700/50 transition-all duration-300 hover:ring-slate-600/50 hover:bg-slate-800">
            <FileKey2 className="w-10 h-10 text-slate-500 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Empty File</h3>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
            This .env file has no variables defined
          </p>
          <button
            type="button"
            onClick={handleAddEntry}
            disabled={isDisabled}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col overflow-hidden p-6 animate-fade-in ${isDisabled ? "pointer-events-none" : ""}`}>
      <div className="flex-shrink-0 flex justify-end mb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isDisabled}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className={`flex-1 overflow-auto transition-opacity duration-200 ${saving ? "opacity-60" : "opacity-100"}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-1/3">
                Key
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Value
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <EnvRow
                key={index}
                entry={entry}
                index={index}
                onChange={handleEntryChange}
                onDelete={handleDeleteEntry}
                disabled={isDisabled}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-shrink-0 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleAddEntry}
          disabled={isDisabled}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 hover:border-slate-600 text-slate-300 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Variable
        </button>
      </div>
    </div>
  );
}

export default VaultEditor;
