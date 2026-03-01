// Execution sandbox limits

export const SQL_TIMEOUT_MS = 30_000;       // 30 seconds
export const SQL_MAX_ROWS = 10_000;         // Max rows returned
export const PYTHON_TIMEOUT_MS = 30_000;    // 30 seconds
export const PYTHON_MAX_MEMORY_MB = 256;    // 256 MB

export const PYTHON_ALLOWED_PACKAGES = [
  "pandas",
  "numpy",
  "scipy",
  "sklearn",
  "matplotlib",
  "statistics",
  "math",
  "json",
  "re",
  "datetime",
  "collections",
  "itertools",
  "functools",
];

export const PYTHON_BLOCKED_IMPORTS = [
  "os", "sys", "subprocess", "shutil", "socket",
  "http", "urllib", "requests", "pathlib",
  "importlib", "ctypes", "signal",
];
