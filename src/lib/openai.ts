import OpenAI from "openai";
import { AnalysisResult } from "./types";

let openaiInstance: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey && process.env.NODE_ENV === "production") {
      throw new Error("OPENAI_API_KEY is missing");
    }
    openaiInstance = new OpenAI({
      apiKey: apiKey || "dummy_key",
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://code-review-dev.vercel.app",
        "X-Title": "AI Code Reviewer",
      }
    });
  }
  return openaiInstance;
}

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  // Truncate excessively long code to avoid slow/timed-out responses
  const MAX_CODE_CHARS = 12000;
  const truncatedCode =
    code.length > MAX_CODE_CHARS
      ? code.slice(0, MAX_CODE_CHARS) + "\n\n// [Code truncated for analysis]"
      : code;

  const prompt = `
    Analyze the following code as a senior software engineer.
    Provide a detailed review including:
    1. Bugs (logical, syntax, performance, security)
    2. Fixes (specific code blocks for each bug)
    3. Suggestions (readability, modern best practices, optimization)
    4. Documentation (Summary, Function/Module level breakdown, Usage example)
    5. Overall rating (0-10)

    Output MUST be in valid JSON format only, with the following structure:
    {
      "rating": number,
      "bugs": [ { "title": string, "description": string, "severity": "low"|"medium"|"high", "fix": string } ],
      "suggestions": [ { "title": string, "description": string, "benefit": string } ],
      "documentation": {
        "summary": string,
        "functions": [ { "name": string, "description": string, "params": string, "returns": string } ],
        "usage": string
      },
      "overall": string
    }

    Code to analyze:
    ${truncatedCode}
  `;

  // Abort the request if it takes longer than 55s (just under Vercel's 60s limit)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 28000);

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create(
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      },
      { signal: controller.signal }
    );

    const content = response.choices[0].message?.content;
    if (!content) throw new Error("AI returned empty response");

    return JSON.parse(content) as AnalysisResult;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Analysis timed out. Please try with a shorter code snippet.");
    }
    console.error("OpenAI Analysis Error:", error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
