import type { AnalyserJson } from '@specfy/stack-analyser';

export function cleanAnalysis(analysis: AnalyserJson): AnalyserJson {
  analysis.path = [];
  for (const child of analysis.childs) {
    child.path = [];
  }
  return analysis;
}
