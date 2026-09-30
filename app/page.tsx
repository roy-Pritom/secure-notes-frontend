import { redirect } from "next/navigation";
import { homeFor } from "@/lib/auth/constants";
import { requireUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await requireUser();
  redirect(homeFor(user.roles));
}
