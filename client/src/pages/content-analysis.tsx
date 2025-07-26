import React from 'react';
import AdvancedContentAnalysis from '@/components/AdvancedContentAnalysis';

const ContentAnalysisPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Advanced Content Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze your speech content with world-class NLP technology. Get detailed insights on persuasiveness, 
            clarity, structure, professionalism, and engagement - all completely free with no API keys required.
          </p>
        </div>
        
        <AdvancedContentAnalysis />
      </div>
    </div>
  );
};

export default ContentAnalysisPage;