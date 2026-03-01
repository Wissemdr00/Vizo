import "server-only";
import { PYTHON_TIMEOUT_MS, PYTHON_BLOCKED_IMPORTS } from "./sandbox-config";

interface PythonResult {
  output: string;
  data?: Record<string, unknown>[];
  error?: string;
  executionTimeMs: number;
}

/**
 * Validate Python code for forbidden imports (FR-6.2).
 */
function validatePython(code: string): { valid: boolean; error?: string } {
  for (const blocked of PYTHON_BLOCKED_IMPORTS) {
    const importRegex = new RegExp(`\\b(import\\s+${blocked}|from\\s+${blocked}\\b)`);
    if (importRegex.test(code)) {
      return { valid: false, error: `Import "${blocked}" is not allowed for security reasons.` };
    }
  }
  return { valid: true };
}

/**
 * Execute Python code using Pyodide (server-side) (FR-6.9).
 * Sandboxed: no filesystem, no network, whitelisted packages only.
 */
export async function executePython(
  code: string,
  dataJson?: string
): Promise<PythonResult> {
  const validation = validatePython(code);
  if (!validation.valid) {
    return { output: "", error: validation.error, executionTimeMs: 0 };
  }

  const startTime = Date.now();

  try {
    const { loadPyodide } = await import("pyodide");
    const pyodide = await loadPyodide({
      stdout: () => {},
      stderr: () => {},
    });

    // Load core packages
    await pyodide.loadPackage(["pandas", "numpy"]);

    // Inject data if provided
    if (dataJson) {
      pyodide.globals.set("_input_data_json", dataJson);
      await pyodide.runPythonAsync(`
import json
import pandas as pd
_raw_data = json.loads(_input_data_json)
df = pd.DataFrame(_raw_data)
`);
    }

    // Capture output
    await pyodide.runPythonAsync(`
import io, sys
_stdout_capture = io.StringIO()
sys.stdout = _stdout_capture
`);

    // Execute with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Python execution timed out after 30 seconds")), PYTHON_TIMEOUT_MS);
    });

    const execPromise = pyodide.runPythonAsync(code);
    await Promise.race([execPromise, timeoutPromise]);

    // Get captured output
    const output = await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
_stdout_capture.getvalue()
`);

    // Try to get result data (if code produced a DataFrame result)
    let data;
    try {
      const resultJson = await pyodide.runPythonAsync(`
try:
    if 'result' in dir():
        if hasattr(result, 'to_json'):
            result.to_json(orient='records')
        else:
            json.dumps(result)
    else:
        '[]'
except:
    '[]'
`);
      data = JSON.parse(resultJson);
    } catch {
      data = undefined;
    }

    return {
      output: String(output || ""),
      data,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err) {
    return {
      output: "",
      error: `Python error: ${(err as Error).message}`,
      executionTimeMs: Date.now() - startTime,
    };
  }
}
