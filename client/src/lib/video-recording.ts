// Video Recording and Playback System
export interface VideoRecordingData {
  id: string;
  sessionId: string;
  videoBlob: Blob;
  videoBlobUrl: string;
  duration: number;
  startTime: number;
  endTime: number;
  transcript: string;
  metrics: any;
  facialAnalysis?: any;
}

export class VideoRecordingManager {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isRecording = false;
  private startTime = 0;

  // Initialize video recording with high quality settings
  async initializeRecording(videoElement: HTMLVideoElement): Promise<boolean> {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported, video recording unavailable');
        return false;
      }

      // Request media with fallback constraints
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
            frameRate: { ideal: 30, min: 15 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      } catch (mediaError) {
        console.warn('High quality media failed, trying basic constraints:', mediaError);
        
        // Fallback to basic constraints
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        });
      }

      // Set up video element
      if (videoElement.srcObject !== this.stream) {
        videoElement.srcObject = this.stream;
      }
      
      // Only play if not already playing
      if (videoElement.paused) {
        await videoElement.play().catch(playError => {
          console.warn('Video play failed:', playError);
        });
      }

      // Initialize MediaRecorder with optimal settings
      const options = this.getOptimalRecordingOptions();
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      this.setupRecordingHandlers();
      console.log('Video recording initialized with high quality settings');
      return true;

    } catch (error) {
      console.warn('Video recording initialization failed:', error);
      return false;
    }
  }

  // Get optimal recording options based on browser support
  private getOptimalRecordingOptions() {
    const options: MediaRecorderOptions = {};

    // Try different codec combinations for best quality
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4'
    ];

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        options.mimeType = mimeType;
        break;
      }
    }

    // Set high quality bitrate
    options.videoBitsPerSecond = 2500000; // 2.5 Mbps for good quality
    options.audioBitsPerSecond = 128000;  // 128 kbps for clear audio

    return options;
  }

  // Set up recording event handlers
  private setupRecordingHandlers() {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      console.log('📹 Video recording stopped, processing...');
    };

    this.mediaRecorder.onerror = (event) => {
      console.warn('MediaRecorder error:', event);
    };
  }

  // Start video recording
  startRecording(): boolean {
    if (!this.mediaRecorder || this.isRecording) {
      console.warn('⚠️ Cannot start recording - MediaRecorder not ready or already recording');
      return false;
    }

    try {
      this.recordedChunks = [];
      this.startTime = Date.now();
      this.mediaRecorder.start(1000); // Record in 1-second chunks for stability
      this.isRecording = true;
      console.log('🎬 Video recording started');
      return true;
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      return false;
    }
  }

  // Stop video recording and create playable blob
  stopRecording(): Promise<VideoRecordingData | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        console.warn('⚠️ Cannot stop recording - not currently recording');
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          // Create video blob from recorded chunks
          const videoBlob = new Blob(this.recordedChunks, {
            type: this.mediaRecorder?.mimeType || 'video/webm'
          });

          // Create blob URL for playback
          const videoBlobUrl = URL.createObjectURL(videoBlob);

          const recordingData: VideoRecordingData = {
            id: `recording_${Date.now()}`,
            sessionId: `session_${this.startTime}`,
            videoBlob,
            videoBlobUrl,
            duration: Date.now() - this.startTime,
            startTime: this.startTime,
            endTime: Date.now(),
            transcript: '', // Will be filled by session data
            metrics: {} // Will be filled by session data
          };

          console.log('✅ Video recording processed successfully');
          console.log(`📊 Recording details: ${Math.round(recordingData.duration / 1000)}s, ${Math.round(videoBlob.size / 1024 / 1024 * 100) / 100}MB`);
          
          resolve(recordingData);
        } catch (error) {
          console.error('❌ Failed to process recording:', error);
          resolve(null);
        }
      };

      this.isRecording = false;
      this.mediaRecorder.stop();
    });
  }

  // Clean up resources
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.mediaRecorder) {
      this.mediaRecorder = null;
    }
    
    this.recordedChunks = [];
    this.isRecording = false;
    console.log('🧹 Video recording resources cleaned up');
  }

  // Get current recording status
  getRecordingStatus() {
    return {
      isRecording: this.isRecording,
      duration: this.isRecording ? Date.now() - this.startTime : 0,
      chunksRecorded: this.recordedChunks.length
    };
  }
}

// Video playback utilities
export class VideoPlaybackManager {
  private videoElement: HTMLVideoElement | null = null;
  private isPlaying = false;
  private currentTime = 0;
  private duration = 0;

  // Initialize video playback
  initializePlayback(videoElement: HTMLVideoElement, recordingData: VideoRecordingData) {
    this.videoElement = videoElement;
    this.videoElement.src = recordingData.videoBlobUrl;
    this.videoElement.preload = 'metadata';

    // Set up playback event handlers
    this.videoElement.onloadedmetadata = () => {
      this.duration = this.videoElement?.duration || 0;
      console.log(`📹 Video loaded: ${Math.round(this.duration)}s duration`);
    };

    this.videoElement.ontimeupdate = () => {
      this.currentTime = this.videoElement?.currentTime || 0;
    };

    this.videoElement.onplay = () => {
      this.isPlaying = true;
    };

    this.videoElement.onpause = () => {
      this.isPlaying = false;
    };

    this.videoElement.onended = () => {
      this.isPlaying = false;
      this.currentTime = 0;
    };
  }

  // Playback controls
  play() {
    this.videoElement?.play();
  }

  pause() {
    this.videoElement?.pause();
  }

  seekTo(timeInSeconds: number) {
    if (this.videoElement) {
      this.videoElement.currentTime = Math.max(0, Math.min(timeInSeconds, this.duration));
    }
  }

  setPlaybackSpeed(speed: number) {
    if (this.videoElement) {
      this.videoElement.playbackRate = speed;
    }
  }

  // Get current playback state
  getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      progress: this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0
    };
  }

  // Clean up playback resources
  cleanup() {
    if (this.videoElement) {
      this.videoElement.src = '';
      this.videoElement = null;
    }
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
  }
}

// Session recording storage (in-memory for now, can be extended to IndexedDB)
export class SessionRecordingStorage {
  private recordings: Map<string, VideoRecordingData> = new Map();

  // Save recording with session data
  saveRecording(recordingData: VideoRecordingData, transcript: string, metrics: any, facialAnalysis?: any) {
    const enrichedRecording = {
      ...recordingData,
      transcript,
      metrics,
      facialAnalysis
    };

    this.recordings.set(recordingData.id, enrichedRecording);
    console.log(`💾 Recording saved: ${recordingData.id}`);
    return recordingData.id;
  }

  // Get recording by ID
  getRecording(recordingId: string): VideoRecordingData | null {
    return this.recordings.get(recordingId) || null;
  }

  // Get all recordings for a session
  getSessionRecordings(sessionId: string): VideoRecordingData[] {
    return Array.from(this.recordings.values())
      .filter(recording => recording.sessionId === sessionId);
  }

  // Get all recordings
  getAllRecordings(): VideoRecordingData[] {
    return Array.from(this.recordings.values())
      .sort((a, b) => b.startTime - a.startTime); // Most recent first
  }

  // Delete recording
  deleteRecording(recordingId: string): boolean {
    const recording = this.recordings.get(recordingId);
    if (recording) {
      // Clean up blob URL to prevent memory leaks
      URL.revokeObjectURL(recording.videoBlobUrl);
      this.recordings.delete(recordingId);
      console.log(`🗑️ Recording deleted: ${recordingId}`);
      return true;
    }
    return false;
  }

  // Clean up all recordings
  cleanup() {
    this.recordings.forEach(recording => {
      URL.revokeObjectURL(recording.videoBlobUrl);
    });
    this.recordings.clear();
    console.log('🧹 All recording storage cleaned up');
  }
}

// Global instance for easy access
export const videoRecordingManager = new VideoRecordingManager();
export const videoPlaybackManager = new VideoPlaybackManager();
export const sessionRecordingStorage = new SessionRecordingStorage();