import { Octokit } from "octokit";

let octokitInstance: Octokit | null = null;

function getOctokit() {
  if (!octokitInstance) {
    octokitInstance = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }
  return octokitInstance;
}

export async function fetchGitHubContent(url: string): Promise<string> {
  try {
    // Basic regex to match github.com/owner/repo/blob/branch/path
    const blobRegex = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/;
    const repoRegex = /github\.com\/([^/]+)\/([^/]+)\/?$/;

    let owner, repo, path, ref;

    const blobMatch = url.match(blobRegex);
    if (blobMatch) {
      [, owner, repo, ref, path] = blobMatch;
    } else {
      const repoMatch = url.match(repoRegex);
      if (repoMatch) {
        [, owner, repo] = repoMatch;
        // If it's a repo, try to get README or main.js/index.js
        // For simplicity in this tool, we recommend specific files
        path = "README.md"; 
      } else {
        throw new Error("Invalid GitHub URL format");
      }
    }

    const octokit = getOctokit();
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if (Array.isArray(data)) {
      throw new Error("Target is a directory, please provide a specific file URL");
    }

    if ("content" in data) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }

    throw new Error("Could not retrieve file content");
  } catch (error: any) {
    console.error("GitHub Fetch Error:", error.message);
    throw new Error(`Failed to fetch GitHub content: ${error.message}`);
  }
}
