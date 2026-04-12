export interface AnalysisResult {
  rating: number;
  bugs: {
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    fix: string;
  }[];
  suggestions: {
    title: string;
    description: string;
    benefit: string;
  }[];
  documentation: {
    summary: string;
    functions: { name: string; description: string; params: string; returns: string }[];
    usage: string;
  };
  overall: string;
}

export interface ReviewResponse {
  result?: AnalysisResult;
  error?: string;
}
