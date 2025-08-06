import { LucideIcon } from 'lucide-react';

export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: LucideIcon;
  color: string;
  content: string;
  tags: string[];
  popularity?: number;
  contentAdvice: string;
  voiceAdvice: string;
  bodyLanguageAdvice: string;
}