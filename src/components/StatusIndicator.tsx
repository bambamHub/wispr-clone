interface Props {
  isRecording: boolean;
  interimText: string;
  finalText: string;
  error: string | null;
  isInitialized: boolean;
  copySuccess: boolean;
  onCopy: () => void;
  onClear: () => void; // NEW: Add clear function
}

export function StatusIndicator({
  isRecording,
  interimText,
  finalText,
  error,
  isInitialized,
  copySuccess,
  onCopy,
  onClear, // NEW
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isRecording
            ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 25%, #c44569 50%, #a73b5e 75%, #8b2e52 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 15s ease infinite",
          opacity: 0.9,
          zIndex: 0,
        }}
      />

      {/* Floating Particles Effect */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes ripple {
          0% { 
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7),
                        0 0 0 10px rgba(99, 102, 241, 0.5),
                        0 0 0 20px rgba(99, 102, 241, 0.3);
          }
          100% { 
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0.5),
                        0 0 0 20px rgba(99, 102, 241, 0.3),
                        0 0 0 40px rgba(99, 102, 241, 0);
          }
        }

        @keyframes recordingPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.6),
                        0 0 40px rgba(239, 68, 68, 0.4),
                        0 0 60px rgba(239, 68, 68, 0.2);
          }
          50% { 
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.8),
                        0 0 60px rgba(239, 68, 68, 0.6),
                        0 0 90px rgba(239, 68, 68, 0.4);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Main Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {/* Recording Status Circle */}
        <div
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: isRecording
              ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              : isInitialized
              ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
              : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
            marginBottom: "32px",
            animation: isRecording ? "recordingPulse 2s ease-in-out infinite" : "ripple 3s ease-in-out infinite",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {isRecording ? "🎤" : isInitialized ? "⏸️" : "⏳"}
        </div>

        {/* Status Title */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            margin: "0 0 12px 0",
            color: "#ffffff",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
            letterSpacing: "-0.5px",
          }}
        >
          {isRecording ? "Recording..." : isInitialized ? "Ready to Speak" : "Initializing..."}
        </h1>

        {/* Shortcut Hint */}
        <div
          style={{
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "30px",
            fontSize: "15px",
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: "24px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isRecording
            ? "⌨️ Release to stop"
            : "⌨️ Hold button or SPACE to record"}
        </div>

        {/* Interim Transcript (Live Preview) */}
        {interimText && (
          <div
            style={{
              animation: "slideUp 0.3s ease-out",
              padding: "20px 24px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
              fontSize: "16px",
              fontStyle: "italic",
              color: "#6b7280",
              maxWidth: "520px",
              width: "100%",
              wordWrap: "break-word",
              marginTop: "12px",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px", fontWeight: "600" }}>
              💬 LIVE TRANSCRIPT
            </div>
            {interimText}
          </div>
        )}

        {/* Final Transcript Card */}
        {finalText && !isRecording && (
          <div
            style={{
              animation: "slideUp 0.4s ease-out",
              marginTop: "24px",
              width: "100%",
              maxWidth: "550px",
            }}
          >
            <div
              style={{
                padding: "24px",
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                border: "2px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "20px",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#1f2937",
                wordWrap: "break-word",
                marginBottom: "16px",
                maxHeight: "180px",
                overflowY: "auto",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div style={{ fontSize: "13px", color: "#6366f1", marginBottom: "12px", fontWeight: "700", letterSpacing: "0.5px" }}>
                ✨ TRANSCRIPTION RESULT
              </div>
              {finalText}
            </div>

            {/* NEW: Action Buttons Container */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              width: "100%",
            }}>
              
              {/* Copy Button */}
              <button
                onClick={onCopy}
                style={{
                  padding: "14px 20px",
                  background: copySuccess 
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                    : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: copySuccess
                    ? "0 6px 20px rgba(16, 185, 129, 0.4)"
                    : "0 6px 20px rgba(99, 102, 241, 0.4)",
                }}
                onMouseEnter={(e) => {
                  if (!copySuccess) {
                    (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {copySuccess ? "✅" : "📋"} {copySuccess ? "Copied" : "Copy"}
              </button>

              {/* Save Button */}
              <button
                onClick={() => {
                  const blob = new Blob([finalText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                  a.download = `transcript-${timestamp}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  console.log("✅ Transcript saved");
                }}
                style={{
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                💾 Save
              </button>

              {/* Clear Button */}
              <button
                onClick={onClear}
                style={{
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                🗑️ Clear
              </button>

            </div>

            {/* Success Message */}
            {copySuccess && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#059669",
                fontWeight: "600",
                textAlign: "center",
                animation: "slideUp 0.3s ease-out",
              }}>
                ✅ Copied! Press Ctrl+V to paste anywhere
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              animation: "slideUp 0.3s ease-out",
              marginTop: "24px",
              padding: "18px 24px",
              background: "rgba(254, 226, 226, 0.95)",
              backdropFilter: "blur(20px)",
              color: "#991b1b",
              borderRadius: "14px",
              fontSize: "14px",
              fontWeight: "600",
              maxWidth: "520px",
              width: "100%",
              wordWrap: "break-word",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              boxShadow: "0 8px 30px rgba(239, 68, 68, 0.2)",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Instructions Footer */}
        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "13px",
            fontWeight: "500",
            maxWidth: "480px",
            lineHeight: "1.6",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            🎯 <strong>How to use:</strong> Hold button/SPACE to record, release to stop
          </div>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>
            Transcript can be copied, saved, or cleared
          </div>
        </div>
      </div>
    </div>
  );
}
