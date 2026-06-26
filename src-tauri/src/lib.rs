use walkdir::WalkDir;

const ENV_FILE_NAMES: [&str; 4] = [".env", ".env.local", ".env.development", ".env.production"];
const IGNORED_DIRS: [&str; 2] = ["node_modules", ".git"];

#[tauri::command]
fn scan_directory(target_path: String) -> Vec<String> {
    let mut env_files: Vec<String> = Vec::new();

    for entry in WalkDir::new(&target_path)
        .into_iter()
        .filter_entry(|e| {
            if e.file_type().is_dir() {
                if let Some(name) = e.file_name().to_str() {
                    return !IGNORED_DIRS.contains(&name);
                }
            }
            true
        })
        .filter_map(|e| e.ok())
    {
        if entry.file_type().is_file() {
            if let Some(file_name) = entry.file_name().to_str() {
                if ENV_FILE_NAMES.contains(&file_name) {
                    if let Some(path) = entry.path().to_str() {
                        env_files.push(path.to_string());
                    }
                }
            }
        }
    }

    env_files.sort();
    env_files
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
