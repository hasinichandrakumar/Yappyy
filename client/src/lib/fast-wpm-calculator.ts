// Fast WPM Calculator
export interface WPMData {
  currentWPM: number;
  averageWPM: number;
  peakWPM: number;
  recentWords: string[];
  timeSegments: number[];
}

export class FastWPMCalculator {
  private words: string[] = [];
  private timestamps: number[] = [];

  addWords(transcript: string): WPMData {
    const newWords = transcript.split(' ').filter(word => word.length > 0);
    this.words = [...this.words, ...newWords];
    this.timestamps.push(Date.now());

    const timeElapsed = Math.max(1, (Date.now() - this.timestamps[0]) / 60000); // in minutes
    const currentWPM = Math.round(this.words.length / timeElapsed);

    return {
      currentWPM,
      averageWPM: currentWPM,
      peakWPM: currentWPM,
      recentWords: newWords,
      timeSegments: this.timestamps
    };
  }

  reset(): void {
    this.words = [];
    this.timestamps = [];
  }
}

export const fastWPMCalculator = new FastWPMCalculator();