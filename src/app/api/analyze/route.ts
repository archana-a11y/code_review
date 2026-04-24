import { NextResponse } from "next/server";
import { fetchGitHubContent } from "@/lib/github";
import { analyzeCode } from "@/lib/openai";

// Extend Vercel serverless function timeout (max 60s on Hobby plan)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { code, githubUrl } = await req.json();
    let codeToAnalyze = code;

    if (githubUrl) {
      codeToAnalyze = await fetchGitHubContent(githubUrl);
    }

    if (!codeToAnalyze) {
      return NextResponse.json(
        { error: "Provide code or a valid GitHub URL" },
        { status: 400 }
      );
    }

    const result = await analyzeCode(codeToAnalyze);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("API ROUTE ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
