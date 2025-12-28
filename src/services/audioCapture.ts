export class AudioCapture {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private audioChunks: Blob[] = [];

  async initialize(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return true;
    } catch (error) {
      console.error("Microphone access denied:", error);
      return false;
    }
  }

  startRecording(onDataAvailable: (chunk: Blob) => void): void {
    if (!this.stream) throw new Error("Audio stream not initialized");

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        onDataAvailable(event.data);
      }
    };

    this.mediaRecorder.start(250);
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(new Blob());
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        this.audioChunks = [];
        resolve(audioBlob);
      };

      if (this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
      }
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }
}