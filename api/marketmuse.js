// Simple Node.js API endpoint to call the Python simulation
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { query } = req.body;

    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    // Path to the Python script
    const pythonScript = path.join(__dirname, "../src/marketmuse_sim.py");
    const pythonExecutable = path.join(__dirname, "../.venv/bin/python");

    // Create a temporary Python script that accepts query as argument
    const tempScript = `
import sys
import json
sys.path.append('${path.join(__dirname, "../src")}')

# Import the functions from marketmuse_sim
from marketmuse_sim import run

# Get query from command line argument
query = sys.argv[1] if len(sys.argv) > 1 else "Sustainable skincare for Gen Z"

# Run the analysis
result = run(query)

# Print only the JSON result for API consumption
print(json.dumps({
    "evaluation": result["evaluation"],
    "prediction": result["prediction"], 
    "optimization": result["optimization"],
    "summary": result["summary"]
}, indent=2))
`;

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(pythonExecutable, ["-c", tempScript, query]);

      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("Python script error:", stderr);
          res.status(500).json({
            error: "Analysis failed",
            details: stderr,
            code: code,
          });
          resolve();
          return;
        }

        try {
          // Extract JSON from stdout (skip the console output)
          const lines = stdout.split("\n");
          let jsonStart = -1;

          // Find the line where JSON starts
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith("{")) {
              jsonStart = i;
              break;
            }
          }

          if (jsonStart === -1) {
            throw new Error("No JSON output found");
          }

          const jsonOutput = lines.slice(jsonStart).join("\n");
          const result = JSON.parse(jsonOutput);

          res.status(200).json({
            success: true,
            data: result,
            query: query,
            timestamp: new Date().toISOString(),
          });
          resolve();
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Raw output:", stdout);
          res.status(500).json({
            error: "Failed to parse analysis results",
            details: parseError.message,
            rawOutput: stdout.substring(0, 500), // First 500 chars for debugging
          });
          resolve();
        }
      });

      pythonProcess.on("error", (error) => {
        console.error("Python process error:", error);
        res.status(500).json({
          error: "Failed to start analysis",
          details: error.message,
        });
        resolve();
      });
    });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
