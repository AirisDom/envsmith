import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface EnvEntry {
  key: string;
  value: string;
}

interface EnvRowProps {
  entry: EnvEntry;
  index: number;
  onChange: (index: number, field: "key" | "value", newValue: string) => void;
}

function EnvRow({ entry, index, onChange }: EnvRowProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
      <td className="py-3 px-4">
        <input
          type="text"
          value={entry.key}
          onChange={(e) => onChange(index, "key", e.target.value)}
          placeholder="KEY_NAME"
          className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <input
            type={isVisible ? "text" : "password"}
            value={entry.value}
            onChange={(e) => onChange(index, "value", e.target.value)}
            placeholder="value"
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 rounded bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            aria-label={isVisible ? "Hide value" : "Reveal value"}
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default EnvRow;
