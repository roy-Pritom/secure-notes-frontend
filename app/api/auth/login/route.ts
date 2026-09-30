import { authenticate } from "@/lib/auth/authenticate";

export function POST(request: Request) {
  return authenticate(request, "/auth/login");
}
