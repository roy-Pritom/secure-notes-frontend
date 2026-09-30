import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { CreateUserForm } from "@/components/users/create-user-form";

export const metadata: Metadata = { title: "New user" };

export default function NewUserPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader title="New user" description="Admins can assign roles at creation time." />
      <Card>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
