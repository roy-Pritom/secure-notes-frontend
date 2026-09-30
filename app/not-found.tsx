import Link from "next/link";
import { FileQuestionIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60svh] flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="rounded-2xl bg-muted p-4 text-muted-foreground">
        <FileQuestionIcon className="size-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Not found</h1>
        <p className="max-w-md text-muted-foreground">It doesn&apos;t exist, or it isn&apos;t yours to see.</p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
