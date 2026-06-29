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
        <input
          type="text"
          value={entry.value}
          onChange={(e) => onChange(index, "value", e.target.value)}
          placeholder="value"
          className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
      </td>
    </tr>
  );
}

export default EnvRow;
