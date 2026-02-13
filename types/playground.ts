export type UserPath = "beginner" | "developer" | "explorer";

export interface StepConfig {
  id: string;
  title: string;
  subtitle: string;
  component: "welcome" | "editor" | "analysis" | "results";
  props?: Record<string, unknown>;
}

export type FindingSeverity = "critical" | "high" | "medium" | "info" | "pass";

export interface Finding {
  severity: FindingSeverity;
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
}

export interface AnalysisResult {
  score: number;
  findings: Finding[];
  bestPracticesPassed: number;
  bestPracticesTotal: number;
  optimizedCode?: string;
}

export interface AgentLogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning";
}

export interface CodeAnnotation {
  lineStart: number;
  lineEnd: number;
  title: string;
  description: string;
}

export interface PlaygroundService {
  getContract(path: UserPath): Promise<{ filename: string; lines: string[] }>;
  runAnalysis(path: UserPath): Promise<AnalysisResult>;
  getAgentLogs(path: UserPath): Promise<AgentLogEntry[]>;
  getAnnotations(path: UserPath): Promise<CodeAnnotation[]>;
}
