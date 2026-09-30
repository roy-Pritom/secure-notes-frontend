import { LockKeyholeIcon, ShieldCheckIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const FEATURES = [
  { icon: ShieldCheckIcon, text: "httpOnly cookie sessions with rotating refresh tokens" },
  { icon: UsersIcon, text: "Role-based access for users and admins" },
  { icon: SparklesIcon, text: "Pin, tag, colour and archive your notes" },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(124_58_237/0.5),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(14_165_233/0.3),transparent_50%)]" />
        <div className="relative flex items-center gap-2 text-lg font-semibold">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
            <LockKeyholeIcon className="size-4" />
          </div>
          Secure Notes
        </div>
        <div className="relative space-y-8">
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Your thoughts, kept private.
          </h2>
          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/80">
                <Icon className="size-5 text-violet-300" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/50">© {new Date().getFullYear()} Secure Notes</p>
      </aside>
      <main className="relative flex items-center justify-center p-6 md:p-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
