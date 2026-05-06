import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getAuthenticatedAppContext } from "@/lib/exp-auth";

export const dynamic = "force-dynamic";

export default async function AuthBootstrapPage() {
  let context: Awaited<ReturnType<typeof getAuthenticatedAppContext>> = null;

  try {
    context = await getAuthenticatedAppContext();
  } catch (error) {
    return (
      <main className="min-h-screen px-4 py-6 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-[36px] p-8">
            <p className="eyebrow">Bootstrap error</p>
            <h1 className="mt-3 text-3xl">Your account signed in, but EXP could not finish workspace setup.</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
              {error instanceof Error ? error.message : "Unknown bootstrap error."}
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (!context) {
    redirect("/login");
  }

  redirect(context.profile.role === "ADMIN" ? "/admin" : "/employee");
}
