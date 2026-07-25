import Link from "next/link";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { requireAdminWorkspaceSetup } from "@/lib/admin-workspace";
import { normalizeWorkspaceSetupProfile } from "@/lib/workspace-setup";

export const dynamic = "force-dynamic";

const quickActions = [
  {
    href: "/admin/tracks",
    eyebrow: "Journey design",
    title: "Build onboarding tracks",
    description: "Structure milestones and growth steps for a clear first-90-day journey.",
    tone: "blue",
  },
  {
    href: "/admin/employees",
    eyebrow: "People",
    title: "Invite employees",
    description: "Bring employees into the workspace through secure invite links.",
    tone: "purple",
  },
  {
    href: "/admin/assignments",
    eyebrow: "Delivery",
    title: "Manage assignments",
    description: "Assign active journeys and review completion across the workspace.",
    tone: "green",
  },
] as const;

const actionClasses = {
  blue: "border-blue-400/15 hover:border-blue-400/30 hover:bg-blue-400/[0.055]",
  purple:
    "border-purple-400/15 hover:border-purple-400/30 hover:bg-purple-400/[0.055]",
  green:
    "border-emerald-400/15 hover:border-emerald-400/30 hover:bg-emerald-400/[0.05]",
} as const;

export default async function AdminPage() {
  const { workspace } = await requireAdminWorkspaceSetup();
  const setupProfile = normalizeWorkspaceSetupProfile(workspace.setup_profile);

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden rounded-[38px] p-7 sm:p-10">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-purple-500/[0.07] blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <BadgePill tone="blue">Admin command center</BadgePill>
              <BadgePill tone="neutral">Workspace active</BadgePill>
            </div>
            <p className="eyebrow mt-7">Workspace</p>
            <h2 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-6xl">
              {workspace.name}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Design structured onboarding journeys, connect employees to the right
              track, and keep progress visible from one focused workspace.
            </p>
          </div>

          <Link
            href="/admin/tracks/new"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(0,0,0,0.25)] hover:-translate-y-0.5"
          >
            Create onboarding track
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="group">
            <Card
              className={`h-full rounded-[30px] border p-6 transition ${actionClasses[action.tone]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{action.eyebrow}</p>
                  <h3 className="mt-3 text-2xl">{action.title}</h3>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full border border-white/9 bg-white/[0.045] text-[var(--color-muted)] transition group-hover:translate-x-0.5 group-hover:text-white">
                  →
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
                {action.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="rounded-[30px] p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Company growth context</p>
            <h3 className="mt-2 text-2xl">Your workspace is personalized.</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{workspace.industry ?? "Industry not set"} · {workspace.company_size ?? "Company size not set"} employees</p>
          </div>
          <Link href="/admin/setup" className="text-sm font-semibold text-[var(--color-blue)]">Edit workspace setup</Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"><p className="text-2xl font-semibold">{setupProfile.departments.length}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Departments</p></div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"><p className="text-2xl font-semibold">{setupProfile.roles.length}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Roles configured</p></div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"><p className="text-2xl font-semibold">{setupProfile.skills.length}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Skills configured</p></div>
        </div>
      </Card>

      <Card className="rounded-[30px] p-6 sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Workspace foundation</p>
            <h3 className="mt-2 text-2xl">Core onboarding operations are connected.</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <BadgePill tone="green">Authentication</BadgePill>
            <BadgePill tone="blue">Tracks</BadgePill>
            <BadgePill tone="purple">Invites</BadgePill>
            <BadgePill tone="amber">Progress</BadgePill>
          </div>
        </div>
      </Card>
    </div>
  );
}
