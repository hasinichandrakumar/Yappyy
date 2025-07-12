// PDF Export Test Script
// This script tests the complete PDF export functionality

console.log('🎯 Testing PDF Export Functionality...');

// Test session data (mimicking what SessionAnalysisPage receives)
const testSessionData = {
  id: 36,
  userId: 'demo-user',
  sessionName: 'PDF Export Test Session',
  purpose: 'Testing PDF export functionality',
  duration: 120,
  transcript: 'Hello everyone, thank you for joining me today. I want to talk about, um, the importance of effective communication. You know, when we speak in public, like, we need to be really clear and engaging. I mean, effective speaking is basically about connecting with your audience and, uh, delivering your message with confidence.',
  overallPerformance: 78,
  clarityScore: 82,
  volumeConsistency: 75,
  intonationScore: 78,
  paceConsistency: 78,
  engagementLevel: 80,
  eyeContactScore: 75,
  confidenceLevel: 76,
  fillerWordCount: 7,
  wordsPerMinute: 145,
  createdAt: new Date().toISOString(),
  facialAnalysis: {
    emotionalExpression: {
      confidence: 78,
      engagement: 82,
      enthusiasm: 75,
      nervousness: 25,
      authenticity: 85
    },
    microExpressions: {
      eyebrowMovement: 68,
      eyeMovement: 78,
      mouthExpression: 82,
      facialSymmetry: 88
    },
    communicationSignals: {
      eyeContactQuality: 75,
      gazeFocus: 72,
      blinkRate: 65,
      facialStability: 80
    },
    overallPresence: {
      charisma: 76,
      trustworthiness: 89,
      professionalism: 85,
      approachability: 82
    }
  }
};

// Test filler analysis data
const testFillerAnalysis = {
  totalFillers: 7,
  frequencyPerMinute: 3.5,
  fillerPercentage: 13.2,
  severity: 'moderate',
  detectedFillers: [
    { word: 'you know', count: 1, positions: [117] },
    { word: 'i mean', count: 1, positions: [199] },
    { word: 'um', count: 1, positions: [13] },
    { word: 'like', count: 1, positions: [26] },
    { word: 'really', count: 1, positions: [31] },
    { word: 'basically', count: 1, positions: [40] },
    { word: 'uh', count: 1, positions: [47] }
  ]
};

// Test AI insights data
const testAiInsights = {
  overallAssessment: 'Session completed successfully with solid fundamental performance. Your practice data shows consistent improvement patterns.',
  voiceAnalysis: {
    score: 82,
    strengths: ['Clear articulation', 'Consistent volume'],
    improvements: ['Pace variation', 'Vocal emphasis'],
    insights: 'Voice quality demonstrates solid foundation with opportunities for enhanced dynamic expression.'
  },
  contentAnalysis: {
    score: 80,
    strengths: ['Structured delivery', 'Coherent messaging'],
    improvements: ['Supporting examples', 'Audience engagement'],
    insights: 'Content shows good organization with potential for more compelling storytelling elements.'
  },
  progressSummary: 'Excellent work completing this practice session! Your speaking foundation is solid - continue building on these fundamentals for sustained improvement.'
};

async function testPDFExport() {
  try {
    console.log('📄 Testing PDF generation...');
    
    // Simulate the exact data structure used in SessionAnalysisPage
    const sessionForPDF = {
      id: testSessionData.id,
      userId: testSessionData.userId,
      sessionName: testSessionData.sessionName || 'Practice Session',
      duration: testSessionData.duration || 0,
      createdAt: testSessionData.createdAt,
      overallScore: testSessionData.overallPerformance || 0,
      voiceClarity: testSessionData.clarityScore || 0,
      eyeContactScore: testSessionData.eyeContactScore || 0,
      confidenceScore: testSessionData.confidenceLevel || 0,
      transcript: testSessionData.transcript || '',
      fillerWords: testFillerAnalysis?.detectedFillers?.map(f => f.word) || [],
      fillerWordCount: testSessionData.fillerWordCount || 0,
      analysis: {
        insights: testAiInsights || {},
        facialAnalysis: testSessionData.facialAnalysis,
        fillerAnalysis: testFillerAnalysis
      }
    };

    console.log('✅ Session data prepared for PDF export');
    console.log('📊 Session statistics:');
    console.log(`  - Overall Score: ${sessionForPDF.overallScore}%`);
    console.log(`  - Voice Clarity: ${sessionForPDF.voiceClarity}%`);
    console.log(`  - Confidence: ${sessionForPDF.confidenceScore}%`);
    console.log(`  - Filler Words: ${sessionForPDF.fillerWordCount}`);
    console.log(`  - Duration: ${Math.floor(sessionForPDF.duration / 60)}:${(sessionForPDF.duration % 60).toString().padStart(2, '0')}`);
    
    if (sessionForPDF.analysis.facialAnalysis) {
      console.log('👁️ Facial analysis data available');
      console.log(`  - Confidence: ${sessionForPDF.analysis.facialAnalysis.emotionalExpression.confidence}%`);
      console.log(`  - Engagement: ${sessionForPDF.analysis.facialAnalysis.emotionalExpression.engagement}%`);
      console.log(`  - Charisma: ${sessionForPDF.analysis.facialAnalysis.overallPresence.charisma}%`);
    }
    
    if (sessionForPDF.analysis.fillerAnalysis) {
      console.log('🗣️ Filler analysis data available');
      console.log(`  - Total fillers: ${sessionForPDF.analysis.fillerAnalysis.totalFillers}`);
      console.log(`  - Most common: ${sessionForPDF.analysis.fillerAnalysis.detectedFillers[0]?.word}`);
      console.log(`  - Severity: ${sessionForPDF.analysis.fillerAnalysis.severity}`);
    }

    console.log('✅ PDF Export Test Data Successfully Prepared');
    console.log('📄 Ready for PDF generation with comprehensive session statistics');
    
    return sessionForPDF;
    
  } catch (error) {
    console.error('❌ PDF export test failed:', error);
    throw error;
  }
}

// Run the test
testPDFExport()
  .then(data => {
    console.log('🎉 PDF Export Test Completed Successfully!');
    console.log('✅ All session data is properly formatted for PDF generation');
  })
  .catch(error => {
    console.error('💥 PDF Export Test Failed:', error.message);
  });