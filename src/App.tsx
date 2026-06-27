import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

function App() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleSelectFolder = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Select Root Directory",
    });
    if (selected) {
      setSelectedPath(selected as string);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">EnvSmith</h1>
      <button
        onClick={handleSelectFolder}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
      >
        Select Root Directory
      </button>
      {selectedPath && (
        <p className="text-gray-300 text-sm">
          Selected: <code className="bg-gray-800 px-2 py-1 rounded">{selectedPath}</code>
        </p>
      )}
    </div>
  );
}

export default App;
