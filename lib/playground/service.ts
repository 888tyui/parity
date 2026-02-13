import type {
  UserPath,
  AnalysisResult,
  AgentLogEntry,
  CodeAnnotation,
  PlaygroundService,
} from "@/types/playground";
import { contracts, analysisResults, agentLogs, annotations } from "./mock-data";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class MockPlaygroundService implements PlaygroundService {
  async getContract(path: UserPath) {
    await delay(300);
    return contracts[path];
  }

  async runAnalysis(path: UserPath): Promise<AnalysisResult> {
    await delay(2000);
    return analysisResults[path];
  }

  async getAgentLogs(path: UserPath): Promise<AgentLogEntry[]> {
    return agentLogs[path];
  }

  async getAnnotations(path: UserPath): Promise<CodeAnnotation[]> {
    return annotations[path];
  }
}

export const playgroundService = new MockPlaygroundService();
