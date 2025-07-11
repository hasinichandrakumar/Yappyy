/**
 * GraphQL Query Hook for Neural Analysis
 * Enables flexible querying of specific neural metrics
 */

import { useQuery } from '@tanstack/react-query';

export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
}

export function useGraphQLQuery(queryKey: string[], graphqlQuery: GraphQLQuery) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }

      return result.data;
    },
  });
}

// Neural Analysis GraphQL Queries
export const NEURAL_ANALYSIS_QUERY = `
  query GetNeuralAnalysis($userId: ID!) {
    neuralAnalysis(userId: $userId) {
      userId
      voiceModulation {
        clarity
        pitchVariation
        modulation
        prosody
        confidence
      }
      bodyLanguage {
        gestureEffectiveness
        postureScore
        eyeContact
        engagement
        confidence
      }
      contentStructure {
        coherenceScore
        logicalFlow
        structure
        impact
        confidence
      }
      confidenceScore
      trends {
        metric
        currentValue
        historicalAverage
        improvement
        trend
      }
      insights
      lastUpdated
    }
  }
`;

export const USER_PROGRESS_QUERY = `
  query GetUserProgress($userId: ID!) {
    userProgress(userId: $userId) {
      totalSessions
      averageScore
      improvementRate
      strongestArea
      focusArea
      recentTrends {
        metric
        currentValue
        improvement
        trend
      }
      achievements {
        id
        title
        description
        unlockedDate
        category
      }
    }
  }
`;

export const PRACTICE_SESSIONS_QUERY = `
  query GetPracticeSessions($userId: ID!, $limit: Int, $offset: Int) {
    practiceSessions(userId: $userId, limit: $limit, offset: $offset) {
      id
      date
      duration
      purpose
      voiceMetrics {
        clarity
        confidence
      }
      bodyLanguageMetrics {
        gestureEffectiveness
        eyeContact
        confidence
      }
      contentMetrics {
        coherenceScore
        confidence
      }
      overallScore
      neuralInsights
    }
  }
`;

// Custom hooks for specific queries
export function useNeuralAnalysis(userId: string) {
  return useGraphQLQuery(
    ['neuralAnalysis', userId],
    {
      query: NEURAL_ANALYSIS_QUERY,
      variables: { userId }
    }
  );
}

export function useUserProgress(userId: string) {
  return useGraphQLQuery(
    ['userProgress', userId],
    {
      query: USER_PROGRESS_QUERY,
      variables: { userId }
    }
  );
}

export function usePracticeSessions(userId: string, limit = 10, offset = 0) {
  return useGraphQLQuery(
    ['practiceSessions', userId, limit, offset],
    {
      query: PRACTICE_SESSIONS_QUERY,
      variables: { userId, limit, offset }
    }
  );
}