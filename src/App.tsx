import { useVoiceRecording } from "./hooks/useVoiceRecording";
import { StatusIndicator } from "./components/StatusIndicator";
import { useState, useEffect, useCallback } from "react";

function App() {
  const { 
    isRecording, 
    interimText, 
    finalText,
    error, 
    isInitialized,
    copySuccess,
    manualCopy,
    toggleRecording,
    clearTranscript,
  } = useVoiceRecording();

  const [isPressed, setIsPressed] = useState(false);

  // Use useCallback to prevent re-creating functions on every render
  const startRecording = useCallback(() => {
    if (!isInitialized || isRecording) return;
    setIsPressed(true);
    toggleRecording();
  }, [isInitialized, isRecording, toggleRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsPressed(false);
    toggleRecording();
  }, [isRecording, toggleRecording]);

  // Mouse push-to-talk
  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    if (isPressed && isRecording) {
      stopRecording();
    }
  };

  // Keyboard push-to-talk (SPACE key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Space, not recording, initialized, and not a repeat
      if (e.code === 'Space' && !isRecording && isInitialized && !e.repeat) {
        e.preventDefault();
        startRecording();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Only trigger if Space and currently recording
      if (e.code === 'Space' && isRecording) {
        e.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, isInitialized, startRecording, stopRecording]);

  // Auto-release if mouse leaves window while pressed
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPressed && isRecording) {
        stopRecording();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPressed, isRecording, stopRecording]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <StatusIndicator
        isRecording={isRecording}
        interimText={interimText}
        finalText={finalText}
        error={error}
        isInitialized={isInitialized}
        copySuccess={copySuccess}
        onCopy={manualCopy}
        onClear={clearTranscript} 
      />

      {/* PUSH-TO-TALK BUTTON */}
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          // Also stop if mouse leaves button while pressed
          if (isPressed && isRecording) {
            stopRecording();
          }
        }}
        disabled={!isInitialized}
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          padding: "20px 40px",
          background: isRecording 
            ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            : isInitialized
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
          color: "white",
          border: isRecording ? "4px solid rgba(255, 255, 255, 0.5)" : "none",
          borderRadius: "16px",
          fontSize: "18px",
          fontWeight: "700",
          cursor: isInitialized ? "pointer" : "not-allowed",
          boxShadow: isRecording
            ? "0 0 0 0 rgba(239, 68, 68, 0.7), 0 8px 40px rgba(239, 68, 68, 0.5)"
            : "0 8px 30px rgba(0, 0, 0, 0.3)",
          zIndex: 1000,
          transition: "all 0.2s ease",
          transform: isPressed ? "scale(0.95)" : "scale(1)",
          userSelect: "none",
          WebkitUserSelect: "none",
          animation: isRecording ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
        onMouseEnter={(e) => {
          if (isInitialized && !isRecording) {
            (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
          }
        }}
      >
        {isRecording 
          ? "🔴 Recording... (Release to Stop)" 
          : isInitialized 
          ? "🎤 Hold to Record" 
          : "⏳ Initializing..."}
      </button>

      {/* Keyboard Hint */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "30px",
          padding: "10px 18px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          fontSize: "13px",
          color: "#374151",
          fontWeight: "600",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          zIndex: 999,
          opacity: isInitialized ? 1 : 0.5,
          pointerEvents: "none",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        💡 Press & hold <kbd style={{
          padding: "4px 10px",
          background: "#f3f4f6",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "12px",
          marginLeft: "6px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}>SPACE</kbd>
      </div>

      {/* Recording Timer (optional) */}
      {isRecording && (
        <div
          style={{
            position: "absolute",
            bottom: "160px",
            right: "30px",
            padding: "12px 20px",
            background: "rgba(239, 68, 68, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            fontSize: "14px",
            color: "white",
            fontWeight: "700",
            boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4)",
            zIndex: 999,
            animation: "slideUp 0.3s ease-out",
          }}
        >
          🎙️ Keep holding to record...
        </div>
      )}

      {/* Pulsing Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7),
                        0 8px 40px rgba(239, 68, 68, 0.5);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0),
                        0 8px 50px rgba(239, 68, 68, 0.7);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
