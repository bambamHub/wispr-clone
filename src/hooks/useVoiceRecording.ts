import { useEffect, useState, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { AudioCapture } from "../services/audioCapture";
import { DeepgramService } from "../services/deepgramService";
// import { insertTextAtCursor } from "../services/tauriBridge";

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const audioCapture = useRef<AudioCapture>(new AudioCapture());
  const deepgram = useRef<DeepgramService | null>(null);
  const finalTranscript = useRef<string>("");

  useEffect(() => {
    const init = async () => {
      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      if (!apiKey) {
        setError("❌ Deepgram API key missing in .env file");
        return;
      }
      
      console.log("🔑 API Key found, initializing...");
      deepgram.current = new DeepgramService(apiKey);

      const hasPermission = await audioCapture.current.initialize();
      if (!hasPermission) {
        setError("❌ Microphone permission denied");
        return;
      }

      setIsInitialized(true);
      console.log("✅ Voice recording initialized");
    };

    init();

    const unlisten = listen("global-shortcut-triggered", () => {
      toggleRecording();
    });

    return () => {
      unlisten.then((fn) => fn());
      audioCapture.current.cleanup();
    };
  }, []);

  const clearTranscript = () => {
  setFinalText("");
  setInterimText("");
  finalTranscript.current = "";
  setCopySuccess(false);
  console.log("🗑️ Transcript cleared");
};

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (!isInitialized) {
      setError("❌ System not initialized");
      return;
    }

    try {
      setError(null);
      setInterimText("");
      setFinalText("");
      setCopySuccess(false);
      finalTranscript.current = "";

      console.log("🎤 Initializing recording...");

      // Start Deepgram connection (waits for Open event)
      await deepgram.current?.startStreaming(
        (text: string, isFinal: boolean) => {
          if (isFinal) {
            finalTranscript.current += (finalTranscript.current ? " " : "") + text;
            setInterimText("");
            setFinalText(finalTranscript.current);
          } else {
            setInterimText(text);
          }
        },
        (err: Error) => {
          console.error("❌ Deepgram error:", err);
          setError(err.message);
        }
      );

      console.log("✅ Deepgram ready, starting audio capture...");

      // Start capturing and streaming audio
      audioCapture.current.startRecording((chunk) => {
        deepgram.current?.sendAudio(chunk);
      });

      setIsRecording(true);
      console.log("✅ Recording started!");
    } catch (err: any) {
      console.error("❌ Failed to start recording:", err);
      setError(err.message || "Failed to start recording");
    }
  };

  const stopRecording = async () => {
  try {
    console.log("⏹️ Stopping recording...");
    setIsRecording(false);

    // Stop audio capture first
    await audioCapture.current.stopRecording();
    
    // Wait a bit for final transcription
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Then close Deepgram
    await deepgram.current?.stopStreaming();

    const textToInsert = finalTranscript.current.trim();
    if (textToInsert) {
      console.log("✅ Final transcript:", textToInsert);
      setFinalText(textToInsert);
      await copyToClipboard(textToInsert);
    } else {
      console.log("⚠️ No text transcribed");
    }

    setInterimText("");
    finalTranscript.current = "";
    console.log("✅ Recording stopped");
  } catch (err: any) {
    console.error("❌ Error stopping recording:", err);
    setError(err.message || "Failed to stop recording");
  }
};


  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      console.log("✅ Copied to clipboard");
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("❌ Copy failed:", err);
      setError("Failed to copy to clipboard");
    }
  };

  const manualCopy = async () => {
    if (finalText) {
      await copyToClipboard(finalText);
    }
  };

  return {
    isRecording,
    interimText,
    finalText,
    error,
    isInitialized,
    copySuccess,
    manualCopy,
    toggleRecording,
    clearTranscript,
  };
}
