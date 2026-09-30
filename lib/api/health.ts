import "server-only";
import { API_ORIGIN } from "./config";

export type ProbeName = "health" | "liveness" | "readiness";

export interface IndicatorStatus {
  status: "up" | "down";
  [key: string]: unknown;
}

export interface HealthReport {
  status: "ok" | "error" | "shutting_down";
  info?: Record<string, IndicatorStatus>;
  error?: Record<string, IndicatorStatus>;
  details: Record<string, IndicatorStatus>;
}

export interface ProbeResult {
  name: ProbeName;
  path: string;
  httpStatus: number | null;
  latencyMs: number | null;
  report: HealthReport | null;
}

const PATHS: Record<ProbeName, string> = {
  health: "/health",
  liveness: "/health/liveness",
  readiness: "/health/readiness",
};

// Probes sit at the origin root: no /api/v1 prefix, no key, no token. 503 still carries a report.
async function probe(name: ProbeName): Promise<ProbeResult> {
  const path = PATHS[name];
  const started = Date.now();
  try {
    const response = await fetch(`${API_ORIGIN}${path}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    const report = (await response.json().catch(() => null)) as HealthReport | null;
    return { name, path, httpStatus: response.status, latencyMs: Date.now() - started, report };
  } catch {
    return { name, path, httpStatus: null, latencyMs: null, report: null };
  }
}

export function probeAll(): Promise<ProbeResult[]> {
  return Promise.all((Object.keys(PATHS) as ProbeName[]).map(probe));
}
