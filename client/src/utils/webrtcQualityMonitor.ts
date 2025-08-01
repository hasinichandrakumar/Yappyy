interface AudioQualityMetrics {
  packetsReceived: number;
  packetsLost: number;
  packetLossRate: number;
  jitter: number;
  audioLevel: number;
  totalAudioEnergy: number;
  concealedSamples: number;
  mos: number; // Mean Opinion Score (1-5)
}

interface VideoQualityMetrics {
  framesReceived: number;
  framesDropped: number;
  frameDropRate: number;
  framesPerSecond: number;
  frameWidth: number;
  frameHeight: number;
  totalDecodeTime: number;
}

interface NetworkQualityMetrics {
  roundTripTime: number;
  availableBitrate: number;
  bytesSent: number;
  bytesReceived: number;
  currentBitrate: number;
  targetBitrate: number;
  qualityLimitationReason: string;
}

interface WebRTCQualityData {
  audio: AudioQualityMetrics;
  video: VideoQualityMetrics;
  network: NetworkQualityMetrics;
  overall: {
    connectionState: string;
    iceState: string;
    signalingState: string;
    qualityScore: number; // 0-100
    recommendation: string;
  };
}

export class WebRTCQualityMonitor {
  private peerConnection: RTCPeerConnection | null = null;
  private monitoring = false;
  private previousStats: RTCStatsReport | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ((data: WebRTCQualityData) => void)[] = [];

  constructor(peerConnection?: RTCPeerConnection) {
    if (peerConnection) {
      this.setPeerConnection(peerConnection);
    }
  }

  setPeerConnection(pc: RTCPeerConnection): void {
    this.peerConnection = pc;
    console.log('✅ WebRTC Quality Monitor connected to peer connection');
  }

  startMonitoring(intervalMs = 5000): boolean {
    if (!this.peerConnection) {
      console.error('❌ No peer connection available for monitoring');
      return false;
    }

    if (this.monitoring) {
      console.warn('⚠️ WebRTC monitoring already active');
      return false;
    }

    this.monitoring = true;
    this.intervalId = setInterval(() => {
      this.collectStats();
    }, intervalMs);

    console.log('🚀 WebRTC quality monitoring started');
    return true;
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.monitoring = false;
    this.previousStats = null;
    console.log('⏹️ WebRTC quality monitoring stopped');
  }

  onQualityUpdate(callback: (data: WebRTCQualityData) => void): void {
    this.callbacks.push(callback);
  }

  private async collectStats(): Promise<void> {
    if (!this.peerConnection || !this.monitoring) return;

    try {
      const stats = await this.peerConnection.getStats();
      const qualityData = this.analyzeStats(stats);
      
      // Notify all callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(qualityData);
        } catch (error) {
          console.error('Error in quality callback:', error);
        }
      });

      this.previousStats = stats;
    } catch (error) {
      console.error('❌ Error collecting WebRTC stats:', error);
    }
  }

  private analyzeStats(stats: RTCStatsReport): WebRTCQualityData {
    const audioMetrics = this.analyzeAudioStats(stats);
    const videoMetrics = this.analyzeVideoStats(stats);
    const networkMetrics = this.analyzeNetworkStats(stats);
    const overallMetrics = this.calculateOverallQuality(audioMetrics, videoMetrics, networkMetrics);

    return {
      audio: audioMetrics,
      video: videoMetrics,
      network: networkMetrics,
      overall: overallMetrics
    };
  }

  private analyzeAudioStats(stats: RTCStatsReport): AudioQualityMetrics {
    let audioMetrics: AudioQualityMetrics = {
      packetsReceived: 0,
      packetsLost: 0,
      packetLossRate: 0,
      jitter: 0,
      audioLevel: 0,
      totalAudioEnergy: 0,
      concealedSamples: 0,
      mos: 4.5
    };

    for (const report of stats.values()) {
      if (report.type === 'inbound-rtp' && (report as any).kind === 'audio') {
        const audioReport = report as any;
        audioMetrics.packetsReceived = audioReport.packetsReceived || 0;
        audioMetrics.packetsLost = audioReport.packetsLost || 0;
        audioMetrics.jitter = audioReport.jitter || 0;
        audioMetrics.audioLevel = audioReport.audioLevel || 0;
        audioMetrics.totalAudioEnergy = audioReport.totalAudioEnergy || 0;
        audioMetrics.concealedSamples = audioReport.concealedSamples || 0;

        // Calculate packet loss rate
        const totalPackets = audioMetrics.packetsReceived + audioMetrics.packetsLost;
        audioMetrics.packetLossRate = totalPackets > 0 ? 
          (audioMetrics.packetsLost / totalPackets) * 100 : 0;

        // Calculate MOS (Mean Opinion Score)
        audioMetrics.mos = this.calculateMOS(
          audioMetrics.jitter * 1000, // Convert to milliseconds
          audioMetrics.packetLossRate,
          this.getLatency(stats)
        );
      }
    }

    return audioMetrics;
  }

  private analyzeVideoStats(stats: RTCStatsReport): VideoQualityMetrics {
    let videoMetrics: VideoQualityMetrics = {
      framesReceived: 0,
      framesDropped: 0,
      frameDropRate: 0,
      framesPerSecond: 0,
      frameWidth: 0,
      frameHeight: 0,
      totalDecodeTime: 0
    };

    for (const report of stats.values()) {
      if (report.type === 'inbound-rtp' && (report as any).kind === 'video') {
        const videoReport = report as any;
        videoMetrics.framesReceived = videoReport.framesReceived || 0;
        videoMetrics.framesDropped = videoReport.framesDropped || 0;
        videoMetrics.framesPerSecond = videoReport.framesPerSecond || 0;
        videoMetrics.frameWidth = videoReport.frameWidth || 0;
        videoMetrics.frameHeight = videoReport.frameHeight || 0;
        videoMetrics.totalDecodeTime = videoReport.totalDecodeTime || 0;

        // Calculate frame drop rate
        videoMetrics.frameDropRate = videoMetrics.framesReceived > 0 ? 
          (videoMetrics.framesDropped / videoMetrics.framesReceived) * 100 : 0;
      }
    }

    return videoMetrics;
  }

  private analyzeNetworkStats(stats: RTCStatsReport): NetworkQualityMetrics {
    let networkMetrics: NetworkQualityMetrics = {
      roundTripTime: 0,
      availableBitrate: 0,
      bytesSent: 0,
      bytesReceived: 0,
      currentBitrate: 0,
      targetBitrate: 0,
      qualityLimitationReason: 'none'
    };

    // Get round trip time from remote-inbound-rtp
    for (const report of stats.values()) {
      const reportData = report as any;
      
      if (report.type === 'remote-inbound-rtp') {
        networkMetrics.roundTripTime = (reportData.roundTripTime || 0) * 1000; // Convert to ms
      }
      
      if (report.type === 'candidate-pair' && reportData.state === 'succeeded') {
        networkMetrics.availableBitrate = reportData.availableOutgoingBitrate || 0;
        networkMetrics.bytesSent = reportData.bytesSent || 0;
        networkMetrics.bytesReceived = reportData.bytesReceived || 0;
      }

      if (report.type === 'outbound-rtp') {
        networkMetrics.targetBitrate = reportData.targetBitrate || 0;
        networkMetrics.qualityLimitationReason = reportData.qualityLimitationReason || 'none';

        // Calculate current bitrate
        if (this.previousStats) {
          const prevReport = Array.from(this.previousStats.values())
            .find(r => r.type === 'outbound-rtp' && r.id === report.id) as any;
          
          if (prevReport) {
            const bytesDiff = (reportData.bytesSent || 0) - (prevReport.bytesSent || 0);
            const timeDiff = (report.timestamp - prevReport.timestamp) / 1000;
            networkMetrics.currentBitrate = timeDiff > 0 ? (bytesDiff * 8) / timeDiff : 0;
          }
        }
      }
    }

    return networkMetrics;
  }

  private calculateOverallQuality(
    audio: AudioQualityMetrics,
    video: VideoQualityMetrics,
    network: NetworkQualityMetrics
  ): {
    connectionState: string;
    iceState: string;
    signalingState: string;
    qualityScore: number;
    recommendation: string;
  } {
    const connectionState = this.peerConnection?.connectionState || 'unknown';
    const iceState = this.peerConnection?.iceConnectionState || 'unknown';
    const signalingState = this.peerConnection?.signalingState || 'unknown';

    // Calculate quality score (0-100)
    let qualityScore = 100;

    // Audio quality factors
    if (audio.packetLossRate > 5) qualityScore -= 20;
    else if (audio.packetLossRate > 1) qualityScore -= 10;

    if (audio.mos < 3.5) qualityScore -= 15;
    else if (audio.mos < 4) qualityScore -= 8;

    // Video quality factors
    if (video.frameDropRate > 10) qualityScore -= 20;
    else if (video.frameDropRate > 5) qualityScore -= 10;

    if (video.framesPerSecond < 15) qualityScore -= 15;
    else if (video.framesPerSecond < 24) qualityScore -= 8;

    // Network quality factors
    if (network.roundTripTime > 300) qualityScore -= 20;
    else if (network.roundTripTime > 150) qualityScore -= 10;

    // Quality limitation penalties
    if (network.qualityLimitationReason === 'bandwidth') qualityScore -= 15;
    else if (network.qualityLimitationReason === 'cpu') qualityScore -= 10;

    qualityScore = Math.max(0, qualityScore);

    // Generate recommendation
    const recommendation = this.generateRecommendation(qualityScore, audio, video, network);

    return {
      connectionState,
      iceState,
      signalingState,
      qualityScore,
      recommendation
    };
  }

  private calculateMOS(jitterMs: number, packetLossPercent: number, latencyMs: number): number {
    // Simplified E-model for MOS calculation
    let R = 93.2; // Base R-factor for G.711

    // Latency impairment
    if (latencyMs > 160) {
      R -= (latencyMs - 160) / 40;
    }

    // Packet loss impairment
    R -= packetLossPercent * 2.5;

    // Jitter impairment
    R -= Math.max(0, (jitterMs - 20) / 10);

    // Convert R-factor to MOS (1-5 scale)
    let mos;
    if (R < 0) mos = 1;
    else if (R > 100) mos = 4.5;
    else mos = 1 + 0.035 * R + R * (R - 60) * (100 - R) * 7 * Math.pow(10, -6);

    return Math.max(1, Math.min(4.5, mos));
  }

  private getLatency(stats: RTCStatsReport): number {
    for (const report of stats.values()) {
      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        return (report.currentRoundTripTime || 0) * 1000;
      }
    }
    return 0;
  }

  private generateRecommendation(
    score: number,
    audio: AudioQualityMetrics,
    video: VideoQualityMetrics,
    network: NetworkQualityMetrics
  ): string {
    if (score >= 90) return 'Excellent connection quality';
    if (score >= 80) return 'Good connection quality';
    if (score >= 70) return 'Fair connection quality';
    
    const issues: string[] = [];
    
    if (audio.packetLossRate > 5) issues.push('high audio packet loss');
    if (video.frameDropRate > 10) issues.push('high video frame drops');
    if (network.roundTripTime > 300) issues.push('high network latency');
    if (network.qualityLimitationReason === 'bandwidth') issues.push('bandwidth limitation');
    
    if (issues.length > 0) {
      return `Poor quality due to: ${issues.join(', ')}`;
    }
    
    return 'Connection quality needs improvement';
  }

  // Public utility methods
  isSupported(): boolean {
    return typeof RTCPeerConnection !== 'undefined';
  }

  getCurrentQuality(): Promise<WebRTCQualityData | null> {
    if (!this.peerConnection) return Promise.resolve(null);
    
    return this.peerConnection.getStats().then(stats => {
      return this.analyzeStats(stats);
    }).catch(error => {
      console.error('Error getting current quality:', error);
      return null;
    });
  }

  cleanup(): void {
    this.stopMonitoring();
    this.callbacks = [];
    this.peerConnection = null;
  }
}