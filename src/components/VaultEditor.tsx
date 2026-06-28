import { FileKey2 } from "lucide-react";

interface VaultEditorProps {
  selectedFile: string | null;
}

function VaultEditor({ selectedFile }: VaultEditorProps) {
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

  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-sm text-slate-500">Editor view coming soon...</p>
    </div>
  );
}

export default VaultEditor;
