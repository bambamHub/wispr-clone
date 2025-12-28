import { invoke } from "@tauri-apps/api/tauri";

export async function insertTextAtCursor(text: string): Promise<void> {
  try {
    const result = await invoke<string>("insert_text_at_cursor", { text });
    console.log("✅", result);
  } catch (error) {
    console.error("❌ Direct insertion failed:", error);
    try {
      const fallbackResult = await invoke<string>("insert_text_via_clipboard", { text });
      console.log("✅ Fallback:", fallbackResult);
    } catch (fallbackError) {
      console.error("❌ Clipboard insertion also failed:", fallbackError);
      throw new Error("Failed to insert text");
    }
  }
}

export async function getShortcutKey(): Promise<string> {
  try {
    return await invoke<string>("check_shortcut_status");
  } catch (error) {
    return "Ctrl+Shift+Space";
  }
}
