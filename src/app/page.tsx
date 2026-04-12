"use client";

import { useState } from "react";
import { Search, Github, Code, Bug, Lightbulb, FileText, Send, Sparkles, AlertCircle } from "lucide-react";
import { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"bugs" | "suggestions" | "docs">("bugs");

  const handleAnalyze = async () => {
    if (!input && !githubUrl) {
      setError("Please provide some code or a GitHub URL");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input, githubUrl }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-glow rounded-full bg-blue-500/10 p-4 ring-1 ring-blue-500/20">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Code <span className="text-primary">Reviewer</span>
        </h1>
        <p className="mt-4 text-zinc-400">
          Get expert-level code reviews, bug detection, and documentation in seconds.
        </p>
      </header>

      <main className="grid w-full max-w-6xl gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <section className="flex flex-col gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Github className="h-5 w-5" /> GitHub Repository / File
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="https://github.com/owner/repo/blob/main/path/to/file.js"
                className="w-full rounded-xl border border-zinc-800 bg-black/50 p-4 pl-12 text-zinc-100 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
              <Github className="absolute left-4 top-4 h-5 w-5 text-zinc-500" />
            </div>
            <div className="my-6 flex items-center gap-4 text-zinc-500">
              <div className="h-px flex-1 bg-zinc-800"></div>
              <span>OR</span>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Code className="h-5 w-5" /> Paste Your Code
            </h2>
            <textarea
              placeholder="Paste your code snippet here..."
              className="h-64 w-full resize-none rounded-xl border border-zinc-800 bg-black/50 p-4 font-mono text-sm text-zinc-100 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:bg-blue-600 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Analyze Code
                </>
              )}
            </button>
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400 ring-1 ring-red-500/20">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        <section className="flex flex-col gap-6">
          {result ? (
            <div className="flex flex-col gap-6">
              {/* Overall Rating */}
              <div className="glass flex items-center justify-between rounded-2xl p-6">
                <div>
                  <h3 className="text-sm font-medium uppercase text-zinc-500">Overall Rating</h3>
                  <p className="mt-1 text-4xl font-black text-white">{result.rating}/10</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium uppercase text-zinc-500">Verdict</h3>
                  <p className="mt-1 text-lg font-semibold text-primary">{result.overall}</p>
                </div>
              </div>

              {/* Tabs / Result Display */}
              <div className="glass overflow-hidden rounded-2xl">
                <div className="grid grid-cols-3 border-b border-zinc-800">
                  <button 
                    onClick={() => setActiveTab("bugs")}
                    className={`flex items-center justify-center gap-2 py-4 font-medium transition-colors ${activeTab === "bugs" ? "border-b-2 border-primary text-white" : "text-zinc-500 hover:text-white"}`}
                  >
                    <Bug className="h-4 w-4" /> Bugs
                  </button>
                  <button 
                    onClick={() => setActiveTab("suggestions")}
                    className={`flex items-center justify-center gap-2 py-4 font-medium transition-colors ${activeTab === "suggestions" ? "border-b-2 border-primary text-white" : "text-zinc-500 hover:text-white"}`}
                  >
                    <Lightbulb className="h-4 w-4" /> Suggestions
                  </button>
                  <button 
                    onClick={() => setActiveTab("docs")}
                    className={`flex items-center justify-center gap-2 py-4 font-medium transition-colors ${activeTab === "docs" ? "border-b-2 border-primary text-white" : "text-zinc-500 hover:text-white"}`}
                  >
                    <FileText className="h-4 w-4" /> Docs
                  </button>
                </div>

                <div className="max-h-[600px] overflow-y-auto p-6">
                  {/* Content based on active tab */}
                  {activeTab === "bugs" && (
                    <div className="flex flex-col gap-4">
                      {result.bugs.length > 0 ? (
                        result.bugs.map((bug, idx) => (
                          <div key={idx} className="rounded-xl bg-zinc-900/50 p-4 ring-1 ring-zinc-800">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white">{bug.title}</h4>
                              <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${
                                bug.severity === "high" ? "bg-red-500/20 text-red-500" :
                                bug.severity === "medium" ? "bg-yellow-500/20 text-yellow-500" :
                                "bg-blue-500/20 text-blue-500"
                              }`}>
                                {bug.severity}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-zinc-400">{bug.description}</p>
                            {bug.fix && (
                              <div className="mt-4 rounded-lg bg-black p-3 font-mono text-xs">
                                <p className="mb-2 text-zinc-500">// Fix Recommendation</p>
                                <pre className="text-green-400 overflow-x-auto">{bug.fix}</pre>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-zinc-500 py-12">No bugs found! Great job.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "suggestions" && (
                    <div className="flex flex-col gap-4">
                      {result.suggestions.length > 0 ? (
                        result.suggestions.map((sug, idx) => (
                          <div key={idx} className="rounded-xl bg-zinc-900/50 p-4 ring-1 ring-zinc-800">
                            <h4 className="font-bold text-white">{sug.title}</h4>
                            <p className="mt-2 text-sm text-zinc-400">{sug.description}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-primary">
                              <Sparkles className="h-3 w-3" />
                              <span>Benefit: {sug.benefit}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-zinc-500 py-12">No suggestions. Your code is pretty clean!</p>
                      )}
                    </div>
                  )}

                  {activeTab === "docs" && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h4 className="mb-2 text-sm font-bold uppercase text-zinc-500">Summary</h4>
                        <p className="text-zinc-300">{result.documentation.summary}</p>
                      </div>
                      
                      {result.documentation.functions.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-bold uppercase text-zinc-500">Functions</h4>
                          <div className="flex flex-col gap-4">
                            {result.documentation.functions.map((fn, idx) => (
                              <div key={idx} className="rounded-xl bg-zinc-900/50 p-4 ring-1 ring-zinc-800">
                                <code className="text-primary font-bold">{fn.name}({fn.params})</code>
                                <p className="mt-2 text-sm text-zinc-400">{fn.description}</p>
                                <div className="mt-2 text-xs text-zinc-500">Returns: {fn.returns}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="mb-2 text-sm font-bold uppercase text-zinc-500">Usage Example</h4>
                        <div className="rounded-lg bg-black p-3 font-mono text-xs">
                          <pre className="text-blue-400 overflow-x-auto">{result.documentation.usage}</pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass flex h-full flex-col items-center justify-center rounded-2xl p-12 text-center opacity-50">
              <Search className="mb-4 h-12 w-12 text-zinc-600" />
              <h3 className="text-xl font-semibold">Ready to Review</h3>
              <p className="mt-2 text-zinc-400">
                Submit your code or GitHub URL to see analysis results here.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-24 text-center text-zinc-500">
        <p>&copy; 2024 AI Code Reviewer. Powered by OpenAI & Octokit.</p>
      </footer>
    </div>
  );
}

