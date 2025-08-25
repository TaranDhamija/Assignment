import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  try {
    console.log("Received analysis request");
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log("Analyzing query:", query);

    // Path to Python executable and script
    const pythonExecutable = path.join(__dirname, ".venv/bin/python");
    // const pythonScript = path.join(__dirname, "src/marketmuse_sim.py");

    // Create a modified version of the script that accepts query as command line argument
    const modifiedScript = `
import sys
import os
sys.path.append('${path.join(__dirname, "src")}')

# Set the query from command line argument
query_arg = sys.argv[1] if len(sys.argv) > 1 else "Sustainable skincare for Gen Z"

# Import and run the analysis
from marketmuse_sim import run
import json

# Run the analysis with the query
result = run(query_arg)

# Output only the essential data for the UI
output = {
    "evaluation": result["evaluation"],
    "prediction": result["prediction"], 
    "optimization": result["optimization"],
    "summary": result["summary"]
}

print("===JSON_START===")
print(json.dumps(output, indent=2))
print("===JSON_END===")
`;

    const pythonProcess = spawn(pythonExecutable, [
      "-c",
      modifiedScript,
      query,
    ]);

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
        return res.status(500).json({
          error: "Analysis failed",
          details: stderr,
        });
      }

      try {
        // Extract JSON between markers
        const jsonMatch = stdout.match(
          /===JSON_START===\s*([\s\S]*?)\s*===JSON_END===/
        );

        if (!jsonMatch) {
          console.error("No JSON markers found in output:", stdout);
          return res.status(500).json({
            error: "No valid JSON output found",
            rawOutput: stdout.substring(0, 500),
          });
        }

        const jsonString = jsonMatch[1].trim();
        const result = JSON.parse(jsonString);

        res.json({
          success: true,
          data: result,
          query: query,
          timestamp: new Date().toISOString(),
        });
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw output:", stdout);
        res.status(500).json({
          error: "Failed to parse analysis results",
          details: parseError.message,
          rawOutput: stdout.substring(0, 500),
        });
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      res.status(500).json({
        error: "Failed to start Python analysis",
        details: error.message,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 MarketMuse API Server running on http://localhost:${PORT}`);
  console.log(
    `📊 Analysis endpoint: POST http://localhost:${PORT}/api/analyze`
  );
});
