use serde::Serialize;
use std::fs;
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

#[derive(Serialize)]
pub struct EnvEntry {
    key: String,
    value: String,
}

#[tauri::command]
fn read_env_file(file_path: String) -> Result<Vec<EnvEntry>, String> {
    let content = fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    let mut entries: Vec<EnvEntry> = Vec::new();

    for line in content.lines() {
        let trimmed = line.trim();

        if trimmed.is_empty() || trimmed.starts_with('#') {
            continue;
        }

        if let Some(eq_pos) = trimmed.find('=') {
            let key = trimmed[..eq_pos].trim().to_string();
            let raw_value = trimmed[eq_pos + 1..].trim();

            let value = if (raw_value.starts_with('"') && raw_value.ends_with('"'))
                || (raw_value.starts_with('\'') && raw_value.ends_with('\''))
            {
                raw_value[1..raw_value.len() - 1].to_string()
            } else {
                raw_value.to_string()
            };

            if !key.is_empty() {
                entries.push(EnvEntry { key, value });
            }
        }
    }

    Ok(entries)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan_directory, read_env_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
