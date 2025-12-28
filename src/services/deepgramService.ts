import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export class DeepgramService {
  private client: any;
  private connection: any = null;
  private isReady: boolean = false;

  constructor(apiKey: string) {
    this.client = createClient(apiKey);
  }

  async startStreaming(
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("🔌 Connecting to Deepgram...");
        
        this.connection = this.client.listen.live({
          model: 'nova-2',
          language: 'en-US',
          smart_format: true,
          punctuate: true,
          interim_results: true,
          endpointing: 300,
          utterance_end_ms: 1000,
        });

        // OPEN EVENT - Connection ready
        this.connection.on(LiveTranscriptionEvents.Open, () => {
          console.log('✅ Deepgram WebSocket OPENED and READY!');
          this.isReady = true;
          resolve(); // Resolve promise when open
        });

        // TRANSCRIPT EVENT - Receive transcription
        this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
          const transcript = data.channel?.alternatives?.[0]?.transcript;
          if (transcript && transcript.trim().length > 0) {
            const isFinal = data.is_final === true;
            console.log(`📝 "${transcript}" ${isFinal ? '[FINAL]' : '[interim]'}`);
            onTranscript(transcript, isFinal);
          }
        });

        // ERROR EVENT
        this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
          console.error('❌ Deepgram error:', error);
          this.isReady = false;
          onError(new Error(error.message || 'Deepgram error'));
        });

        // CLOSE EVENT
        this.connection.on(LiveTranscriptionEvents.Close, () => {
          console.log('🔌 Deepgram connection closed');
          this.isReady = false;
        });

        // METADATA EVENT
        this.connection.on(LiveTranscriptionEvents.Metadata, () => {
          console.log('ℹ️ Metadata received');
        });

        // NO TIMEOUT! Let it stay open until user stops recording

      } catch (error: any) {
        console.error('❌ Failed to create Deepgram connection:', error);
        this.isReady = false;
        reject(error);
      }
    });
  }

  sendAudio(audioData: Blob): void {
    if (!this.connection || !this.isReady) {
      // Don't log warning - just skip silently
      return;
    }

    try {
      this.connection.send(audioData);
    } catch (error) {
      console.warn('⚠️ Failed to send audio:', error);
    }
  }

  async stopStreaming(): Promise<void> {
    if (this.connection && this.isReady) {
      console.log('⏹️ Closing Deepgram connection...');
      this.isReady = false;
      
      // Give Deepgram 500ms to process final audio
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        this.connection.finish();
      } catch (e) {
        // Ignore errors when finishing
      }
      
      this.connection = null;
      console.log('✅ Connection closed');
    }
  }
}
