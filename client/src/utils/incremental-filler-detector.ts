// Incremental Filler Word Detector - Counts filler words one by one as you speak
export interface FillerWordCount {
  totalFillers: number;
  umCount: number;
  uhCount: number;
  likeCount: number;
  soCount: number;
  otherCount: number;
  fillerTypes: { [key: string]: number };
}

export class IncrementalFillerDetector {
  private previousTranscript: string = '';
  private totalFillerCount: number = 0;
  private fillerTypeCounts: { [key: string]: number } = {};
  
  // Focused list of genuine filler words only
  private fillerWords = [
    // Vocal fillers (highest priority)
    'um', 'uh', 'uhm', 'umm', 'uhhh', 'ummm', 'er', 'err', 'ah', 'eh', 'mm', 'hmm', 'hm',
    
    // Common discourse fillers
    'like', 'so', 'well', 'okay', 'ok', 'right', 'yeah', 'yep',
    
    // Intensifiers used as fillers
    'actually', 'basically', 'literally', 'obviously', 'essentially',
    'absolutely', 'totally', 'really', 'very', 'quite', 'pretty', 'super',
    
    // Hedging words
    'just', 'maybe', 'perhaps', 'probably', 'possibly', 'kinda', 'sorta',
    
    // Transition fillers
    'anyway', 'anyhow', 'meanwhile',
    
    // Thinking fillers
    'wait', 'hold on',
    
    // Agreement fillers
    'exactly', 'precisely', 'indeed', 'certainly', 'surely', 'clearly',
    
    // Emphasis fillers
    'honestly', 'frankly', 'seriously', 'truly', 'genuinely',
    
    // Casual speech fillers
    'dude', 'man', 'guys', 'folks', 'thing', 'stuff', 'things'
  ];

  constructor() {
    this.reset();
  }

  /**
   * Reset the detector state
   */
  reset(): void {
    this.previousTranscript = '';
    this.totalFillerCount = 0;
    this.fillerTypeCounts = {};
  }

  /**
   * Analyze new transcript and return only NEW filler words found
   */
  analyzeNewTranscript(newTranscript: string): FillerWordCount {
    if (!newTranscript || newTranscript.trim().length === 0) {
      return this.getCurrentCount();
    }

    // Get only the new part of the transcript
    const newText = this.getNewText(newTranscript);
    
    if (!newText || newText.trim().length === 0) {
      return this.getCurrentCount();
    }

    console.log(`🔍 Analyzing new text for fillers: "${newText}"`);

    // Count filler words in the new text only
    const newFillers = this.countFillersInText(newText);
    
    // Update total counts
    this.totalFillerCount += newFillers.total;
    
    // Update type counts
    Object.entries(newFillers.types).forEach(([type, count]) => {
      this.fillerTypeCounts[type] = (this.fillerTypeCounts[type] || 0) + count;
    });

    // Update previous transcript
    this.previousTranscript = newTranscript;

    console.log(`✅ Found ${newFillers.total} new filler words. Total: ${this.totalFillerCount}`);

    return this.getCurrentCount();
  }

  /**
   * Get only the new text that wasn't analyzed before
   */
  private getNewText(currentTranscript: string): string {
    if (!this.previousTranscript) {
      return currentTranscript;
    }

    // Find the new part by comparing transcripts
    if (currentTranscript.startsWith(this.previousTranscript)) {
      return currentTranscript.substring(this.previousTranscript.length).trim();
    }

    // If transcripts don't match, return the current one (fallback)
    return currentTranscript;
  }

  /**
   * Count filler words in a specific text
   */
  private countFillersInText(text: string): { total: number; types: { [key: string]: number } } {
    const words = text.toLowerCase().trim().split(/\s+/);
    const types: { [key: string]: number } = {};
    let total = 0;

    words.forEach(word => {
      // Clean the word
      const cleanWord = word.replace(/[.,!?;:'"()[\]]/g, '');
      
      // Check for vocal filler variations
      if (this.isVocalFiller(cleanWord)) {
        const normalizedWord = this.normalizeVocalFiller(cleanWord);
        types[normalizedWord] = (types[normalizedWord] || 0) + 1;
        total++;
      }
      // Check for regular filler words
      else if (this.fillerWords.includes(cleanWord)) {
        types[cleanWord] = (types[cleanWord] || 0) + 1;
        total++;
      }
    });

    return { total, types };
  }

  /**
   * Check if a word is a vocal filler (um, uh, etc.)
   */
  private isVocalFiller(word: string): boolean {
    return /^u+h+$/i.test(word) || // uh, uhh, uhhh
           /^u+m+$/i.test(word) || // um, umm, ummm
           /^u+h+m+$/i.test(word) || // uhm, uhhm
           /^e+r+$/i.test(word) || // er, err
           /^a+h+$/i.test(word) || // ah, ahh
           /^e+h+$/i.test(word) || // eh, ehh
           /^m+m+$/i.test(word) || // mm, mmm
           /^h+m+$/i.test(word);   // hm, hmm
  }

  /**
   * Normalize vocal filler variations to base forms
   */
  private normalizeVocalFiller(word: string): string {
    if (/^u+h+$/i.test(word)) return 'uh';
    if (/^u+m+$/i.test(word)) return 'um';
    if (/^u+h+m+$/i.test(word)) return 'uhm';
    if (/^e+r+$/i.test(word)) return 'er';
    if (/^a+h+$/i.test(word)) return 'ah';
    if (/^e+h+$/i.test(word)) return 'eh';
    if (/^m+m+$/i.test(word)) return 'mm';
    if (/^h+m+$/i.test(word)) return 'hm';
    return word;
  }

  /**
   * Get current filler word counts
   */
  getCurrentCount(): FillerWordCount {
    return {
      totalFillers: this.totalFillerCount,
      umCount: this.fillerTypeCounts['um'] || 0,
      uhCount: this.fillerTypeCounts['uh'] || 0,
      likeCount: this.fillerTypeCounts['like'] || 0,
      soCount: this.fillerTypeCounts['so'] || 0,
      otherCount: this.totalFillerCount - (this.fillerTypeCounts['um'] || 0) - (this.fillerTypeCounts['uh'] || 0) - (this.fillerTypeCounts['like'] || 0) - (this.fillerTypeCounts['so'] || 0),
      fillerTypes: { ...this.fillerTypeCounts }
    };
  }

  /**
   * Get filler word statistics
   */
  getStatistics(): {
    totalFillers: number;
    mostCommonFiller: string;
    fillerRate: number;
  } {
    const mostCommonFiller = Object.entries(this.fillerTypeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
    
    return {
      totalFillers: this.totalFillerCount,
      mostCommonFiller,
      fillerRate: this.totalFillerCount // This will be divided by word count when used
    };
  }
}

export default IncrementalFillerDetector;
























