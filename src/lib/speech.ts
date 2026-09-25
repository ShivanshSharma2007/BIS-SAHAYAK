/**
 * Resilient Web Speech Recognition Helper for BIS Sahayak
 */

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string, rawCode: string) => void;
  onEnd?: () => void;
}

export class VoiceAssistantManager {
  private recognition: any = null;
  private isListening: boolean = false;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public async start(handlers: SpeechRecognitionHandlers, langCode: string = 'en'): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check microphone hardware permission first via getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release the manually acquired stream since SpeechRecognition will spawn its own
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        console.warn('Microphone permission request failed:', err);
        const name = err.name || '';
        let msg = 'Microphone permission was denied. Please allow microphone access in your browser settings (click the lock/tune icon near the address bar).';
        if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          msg = 'No microphone device was detected on your computer.';
        }
        handlers.onError?.(msg, 'permission_denied');
        return false;
      }
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      handlers.onError?.(
        'Speech recognition is not natively supported by this browser. We recommend using Google Chrome or Microsoft Edge.',
        'not_supported'
      );
      return false;
    }

    // Always instantiate a clean, fresh instance to avoid browser InvalidStateError
    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch (_) {}
      }

      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      // Map language code to Indian regional speech locale
      const localeMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        gu: 'gu-IN',
        ta: 'ta-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
      };
      rec.lang = localeMap[langCode] || langCode || 'en-IN';


      rec.onstart = () => {
        this.isListening = true;
        handlers.onStart?.();
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        const text = final || interim;
        handlers.onResult?.(text, !!final);
      };

      rec.onerror = (event: any) => {
        const errCode = event.error || 'unknown';
        console.warn('[VoiceAssistant] Speech error:', errCode);

        let userMsg = 'Speech recognition error occurred.';
        if (errCode === 'no-speech') {
          userMsg = 'No speech was detected. Please speak clearly into your microphone.';
        } else if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
          userMsg = 'Microphone permission blocked. Please enable microphone permissions in your browser URL bar.';
        } else if (errCode === 'network') {
          userMsg = 'Voice recognition network service is temporarily unavailable. Check your internet connection.';
        } else if (errCode === 'audio-capture') {
          userMsg = 'No microphone was found or audio capture failed.';
        }

        handlers.onError?.(userMsg, errCode);
        this.stop();
      };

      rec.onend = () => {
        this.isListening = false;
        this.cleanupStream();
        handlers.onEnd?.();
      };

      rec.start();
      this.recognition = rec;
      return true;

    } catch (startErr: any) {
      console.error('[VoiceAssistant] Failed to start recognition:', startErr);
      handlers.onError?.(startErr.message || 'Unable to activate speech recognition.', 'start_failed');
      this.cleanupStream();
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {
        try {
          this.recognition.abort();
        } catch (_) {}
      }
      this.recognition = null;
    }
    this.isListening = false;
    this.cleanupStream();
  }

  private cleanupStream(): void {
    // No longer needed as we don't hold onto a manual MediaStream instance
  }
}

export const POPULAR_VOICE_QUERIES = [
  "What is IS 1293 for plugs and sockets?",
  "How to verify 6-digit gold HUID?",
  "Testing requirements for IS 694 cables",
  "How does Make in India Class 1 local content work?",
  "Where can I find recognized NABL testing laboratories?"
];
