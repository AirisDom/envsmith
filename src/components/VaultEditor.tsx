import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FileKey2, Loader2, Plus, Save } from "lucide-react";
import EnvRow from "./EnvRow";

interface EnvEntry {
  key: string;
  value: string;
}

interface VaultEditorProps {
  selectedFile: string | null;
  onToast: (type: "success" | "error", message: string) => void;
}

function VaultEditor({ selectedFile, onToast }: VaultEditorProps) {
  const [entries, setEntries] = useState<EnvEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEntryChange = (index: number, field: "key" | "value", newValue: string) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  };

  const handleAddEntry = () => {
    setEntries((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleDeleteEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setSaving(true);
    try {
      const content = entries
        .filter((e) => e.key.trim() !== "")
        .map((e) => `${e.key}="${e.value}"`)
        .join("\n");
      await invoke("write_env_file", { filePath: selectedFile, content });
      onToast("success", "Saved!");
    } catch (err) {
      onToast("error", err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setEntries([]);
      setError(null);
      return;
    }

    const loadFile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await invoke<EnvEntry[]>("read_env_file", {
          filePath: selectedFile,
        });
        setEntries(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/80 flex items-center justify-center ring-1 ring-slate-700/50">
            <FileKey2 className="w-10 h-10 text-slate-500" />
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
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading file...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/30 flex items-center justify-center ring-1 ring-red-800/50">
            <FileKey2 className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-red-300 mb-2">Error Loading File</h3>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/80 flex items-center justify-center ring-1 ring-slate-700/50">
            <FileKey2 className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Empty File</h3>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
            This .env file has no variables defined
          </p>
          <button
            type="button"
            onClick={handleAddEntry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6">
      <div className="flex-shrink-0 flex justify-end mb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
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
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-shrink-0 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleAddEntry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <Plus className="w-4 h-4" />
          Add Variable
        </button>
      </div>
    </div>
  );
}

export default VaultEditor;
