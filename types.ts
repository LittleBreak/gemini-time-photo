export enum AppView {
  HOME = 'HOME',
  CAMERA = 'CAMERA',
  PREVIEW = 'PREVIEW',
  RESULT = 'RESULT',
  ANALYSIS = 'ANALYSIS'
}

export interface TimeEra {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  icon: string;
}

export interface GeneratedImage {
  imageUrl: string;
  originalPrompt: string;
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}