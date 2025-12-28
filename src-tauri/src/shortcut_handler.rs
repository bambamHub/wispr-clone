use tauri::{App, AppHandle, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

pub fn setup_global_shortcut(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    println!("🔧 Setting up global shortcut...");
    
    let shortcut = "Ctrl+Alt+R";
    println!("📌 Attempting to register: {}", shortcut);
    
    let handle = app.handle().clone();
    
    let shortcut_obj: Shortcut = shortcut.parse()
        .map_err(|e| {
            println!("❌ Failed to parse shortcut: {:?}", e);
            e
        })?;
    
    app.global_shortcut()
        .on_shortcut(shortcut_obj, move |app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                println!("🎯 Shortcut triggered!");
                let _ = app.emit("global-shortcut-triggered", ());
            }
        })
        .map_err(|e| {
            println!("❌ Failed to register global shortcut: {:?}", e);
            e
        })?;
    
    println!("✅ Global shortcut registered: {}", shortcut);
    Ok(())
}
