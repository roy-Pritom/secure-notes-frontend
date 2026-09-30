"use client";

import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="rounded-2xl bg-destructive/10 p-4 text-destructive">
        <TriangleAlertIcon className="size-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="max-w-md text-sm text-muted-foreground">{error.message || "The request could not be completed."}</p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
