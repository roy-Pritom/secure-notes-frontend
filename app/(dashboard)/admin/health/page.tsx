import type { Metadata } from "next";
import { ActivityIcon, DatabaseIcon, HeartPulseIcon, ServerIcon, type LucideIcon } from "lucide-react";
import { probeAll, type IndicatorStatus, type ProbeName, type ProbeResult } from "@/lib/api/health";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthRefreshButton } from "@/components/admin/health-refresh-button";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "System health" };

const PROBES: Record<ProbeName, { title: string; description: string; icon: LucideIcon }> = {
  health: { title: "Overall", description: "Mongo ping, pool state, heap and RSS", icon: HeartPulseIcon },
  liveness: { title: "Liveness", description: "Is the process up (heap only)", icon: ActivityIcon },
  readiness: { title: "Readiness", description: "Can it serve traffic (Mongo + pool)", icon: DatabaseIcon },
};

export default async function HealthPage() {
  const probes = await probeAll();
  const healthy = probes.every((probe) => probe.report?.status === "ok");

  return (
    <>
      <PageHeader
        title="System health"
        description={
          <span className="inline-flex items-center gap-2">
            <span className={cn("size-2 rounded-full", healthy ? "bg-emerald-500" : "bg-destructive")} />
            {healthy ? "All systems operational" : "One or more checks are failing"}
          </span>
        }
        actions={<HealthRefreshButton />}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {probes.map((probe) => (
          <ProbeCard key={probe.name} probe={probe} />
        ))}
      </div>
    </>
  );
}

function ProbeCard({ probe }: { probe: ProbeResult }) {
  const meta = PROBES[probe.name];
  const ok = probe.report?.status === "ok";
  const indicators = Object.entries(probe.report?.details ?? {});

  return (
    <Card className={cn(!ok && "border-destructive/40")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <meta.icon className="size-4 text-muted-foreground" />
          {meta.title}
        </CardTitle>
        <CardDescription>{meta.description}</CardDescription>
        <CardAction>
          <StatusPill up={ok} label={probe.report?.status ?? "unreachable"} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs">
          <span>GET {probe.path}</span>
          <span className="text-muted-foreground">
            {probe.httpStatus ?? "—"} · {probe.latencyMs === null ? "timeout" : `${probe.latencyMs} ms`}
          </span>
        </div>
        {indicators.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ServerIcon className="size-4" />
            No report — the API did not respond.
          </p>
        ) : (
          <ul className="space-y-2">
            {indicators.map(([key, indicator]) => (
              <Indicator key={key} name={key} indicator={indicator} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Indicator({ name, indicator }: { name: string; indicator: IndicatorStatus }) {
  const { status, ...extra } = indicator;
  const details = Object.entries(extra).filter(([, value]) => typeof value !== "object");

  return (
    <li className="rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{name}</span>
        <StatusPill up={status === "up"} label={status} />
      </div>
      {details.length > 0 && (
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          {details.map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="truncate text-right font-mono">{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
}

function StatusPill({ up, label }: { up: boolean; label: string }) {
  return (
    <Badge variant="outline" className={cn("capitalize", up ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>
      <span className={cn("size-1.5 rounded-full", up ? "bg-emerald-500" : "bg-destructive")} />
      {label}
    </Badge>
  );
}
