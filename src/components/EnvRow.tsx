import { useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface EnvEntry {
  key: string;
  value: string;
}

interface EnvRowProps {
  entry: EnvEntry;
  index: number;
  onChange: (index: number, field: "key" | "value", newValue: string) => void;
  onDelete: (index: number) => void;
  disabled?: boolean;
}

function EnvRow({ entry, index, onChange, onDelete, disabled }: EnvRowProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <tr className={`border-b border-slate-800/50 transition-all duration-200 group ${disabled ? "opacity-60" : "hover:bg-slate-800/30"}`}>
      <td className="py-3 px-4">
        <input
          type="text"
          value={entry.key}
          onChange={(e) => onChange(index, "key", e.target.value)}
          placeholder="KEY_NAME"
          disabled={disabled}
          className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700"
        />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <input
            type={isVisible ? "text" : "password"}
            value={entry.value}
            onChange={(e) => onChange(index, "value", e.target.value)}
            placeholder="value"
            disabled={disabled}
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700"
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            disabled={disabled}
            className="p-2 rounded bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 disabled:hover:border-slate-700 disabled:hover:text-slate-400"
            aria-label={isVisible ? "Hide value" : "Reveal value"}
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </td>
      <td className="py-3 px-2 w-12">
        <button
          type="button"
          onClick={() => onDelete(index)}
          disabled={disabled}
          className="p-2 rounded bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-900/30 hover:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-95 disabled:opacity-0 disabled:cursor-not-allowed"
          aria-label="Delete row"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

export default EnvRow;
