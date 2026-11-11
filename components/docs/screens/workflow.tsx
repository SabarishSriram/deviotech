import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Code2,
  FileText,
  Folder,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  KeyRound,
  Laptop,
  MoreHorizontal,
  Play,
  Search,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react"
import { SiGithub, SiReact, SiVite } from "react-icons/si"

import { Board, Browser, EmailCompose, Mark, Menu, MONO_FONT } from "@/components/docs/screens/kit"
import { MENTOR_EMAIL } from "@/components/docs/screens/welcome"
import { PROJECT, SERVER, term, USER } from "@/components/docs/screens/fullstack"
import { VSCode, type TermLine, type TreeNode, type VSCodeProps } from "@/components/docs/screens/vscode"
import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * Pictures for the Full-Stack "How we work" and "Environment & secrets"
 * walkthroughs (data/docs/fullstack-workflow.ts). Marker numbers match the
 * step text.
 */

type Screen = (os: OS) => React.ReactNode

const MENTOR = "devvy-mentor"
const REPO = `${USER}/my-fullstack-app`

/* ------------------------------------------------------------------ */
/* Project trees                                                       */
/* ------------------------------------------------------------------ */

const rootTree = (extra: TreeNode[] = []): TreeNode[] => [{ name: "client", dir: true }, { name: "server", dir: true }, ...extra]

const README = [
  "# My Full-Stack App",
  "",
  "A React client and an Express API, built during the Devvy Tech program.",
  "",
  "## Run it locally",
  "",
  "1. Start the API: open a terminal, run `cd server`, then `npm run dev`",
  "2. Start the client: open another terminal, run `cd client`, then `npm run dev`",
  "3. Open http://localhost:5173",
]

/** server/ opened, after Setup, optionally with .env.example. */
function serverTree({ example, active, envMark }: { example?: boolean; active?: string; envMark?: number } = {}): TreeNode[] {
  const nodes: TreeNode[] = [
    { name: "client", dir: true },
    { name: "server", dir: true, open: true },
    { name: "node_modules", dir: true, depth: 1, ignored: true },
    { name: "prisma", dir: true, depth: 1 },
    { name: "src", dir: true, depth: 1 },
    { name: ".env", depth: 1, ignored: true, mark: envMark },
    ...(example ? [{ name: ".env.example", depth: 1, status: "U" as const, mark: active === ".env.example" ? 1 : undefined }] : []),
    { name: ".gitignore", depth: 1 },
    { name: "package-lock.json", depth: 1 },
    { name: "package.json", depth: 1 },
    { name: "tsconfig.json", depth: 1 },
    { name: "README.md" },
  ]
  return nodes.map((n) => (n.name === active ? { ...n, active: true } : n))
}

/** client/ opened, for the client .env steps. */
function clientTree({
  active,
  env,
  gitignoreStatus,
  appStatus,
}: { active?: string; env?: boolean; gitignoreStatus?: "M"; appStatus?: "M" } = {}): TreeNode[] {
  const nodes: TreeNode[] = [
    { name: "client", dir: true, open: true },
    { name: "node_modules", dir: true, depth: 1, ignored: true },
    { name: "public", dir: true, depth: 1 },
    { name: "src", dir: true, depth: 1, open: active === "App.tsx" },
    ...(active === "App.tsx" ? [{ name: "App.tsx", depth: 2, status: appStatus }] : []),
    ...(env
      ? [
          { name: ".env", depth: 1, status: "U" as const },
          { name: ".env.example", depth: 1, status: "U" as const },
        ]
      : []),
    { name: ".gitignore", depth: 1, status: gitignoreStatus },
    { name: "index.html", depth: 1 },
    { name: "package.json", depth: 1 },
    { name: "server", dir: true },
    { name: "README.md" },
  ]
  return nodes.map((n) => (n.name === active ? { ...n, active: true } : n))
}

/* ------------------------------------------------------------------ */
/* GitHub (light)                                                       */
/* ------------------------------------------------------------------ */

export function Avatar({ who, size = 20 }: { who: "asha" | "mentor"; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.45, background: who === "asha" ? "#1f6feb" : "#8250df" }}
    >
      {who === "asha" ? "A" : "M"}
    </span>
  )
}

/** github.com repo page: browser, repo name, tabs. */
export function GitHubRepo({
  os,
  path,
  tab,
  children,
  repo = "my-fullstack-app",
}: {
  os: OS
  path: string
  tab: "Code" | "Pull requests" | "Settings"
  children: React.ReactNode
  repo?: string
}) {
  const tabs = [
    { label: "Code", icon: Code2 },
    { label: "Issues", icon: CircleDot },
    { label: "Pull requests", icon: GitPullRequest },
    { label: "Actions", icon: Play },
    { label: "Settings", icon: Settings },
  ]
  return (
    <Browser os={os} url={`github.com/${USER}/${repo}${path}`} tab={`${USER}/${repo}`} tabIcon={<SiGithub className="size-3.5" />}>
      <div className="bg-white text-[#1f2328]">
        <div className="border-b border-[#d1d9e0] bg-[#f6f8fa] px-6 pt-3">
          <p className="flex items-center gap-2 text-[14px]">
            <SiGithub className="size-5" />
            <span className="text-[#0969da]">{USER}</span>/<span className="font-semibold text-[#0969da]">{repo}</span>
            <span className="rounded-full border border-[#d1d9e0] px-2 text-[10.5px] text-[#59636e]">Public</span>
          </p>
          <div className="mt-3 flex gap-1 text-[12.5px]">
            {tabs.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-2 pb-2",
                  label === tab ? "border-[#fd8c73] font-semibold" : "border-transparent"
                )}
              >
                <Icon className="size-3.5 text-[#59636e]" />
                {label}
              </span>
            ))}
          </div>
        </div>
        {children}
      </div>
    </Browser>
  )
}

function PrHeader({ title, number, merged, commits = 1 }: { title: string; number: number; merged?: boolean; commits?: number }) {
  return (
    <div className="border-b border-[#d1d9e0] pb-3">
      <p className="text-[20px]">
        {title} <span className="font-light text-[#59636e]">#{number}</span>
      </p>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-[#59636e]">
        <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-white", merged ? "bg-[#8250df]" : "bg-[#1f883d]")}>
          {merged ? <GitMerge className="size-3.5" /> : <GitPullRequest className="size-3.5" />}
          {merged ? "Merged" : "Open"}
        </span>
        <span>
          <b className="text-[#1f2328]">{USER}</b> wants to merge {commits} {commits === 1 ? "commit" : "commits"} into{" "}
          <code className="rounded bg-[#ddf4ff] px-1 text-[#0969da]">main</code> from{" "}
          <code className="rounded bg-[#ddf4ff] px-1 text-[#0969da]">docs/readme</code>
        </span>
      </div>
      <div className="mt-3 flex gap-4 text-[12.5px]">
        {["Conversation", "Commits", "Checks", "Files changed"].map((t, i) => (
          <span key={t} className={cn("border-b-2 pb-1", i === 0 ? "border-[#fd8c73] font-semibold" : "border-transparent text-[#59636e]")}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function CommentBox({ who, children, header, menu }: { who: "asha" | "mentor"; children: React.ReactNode; header?: string; menu?: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Avatar who={who} size={32} />
      <div className="relative min-w-0 flex-1 rounded-md border border-[#d1d9e0]">
        <div
          className={cn(
            "flex items-center gap-2 rounded-t-md border-b border-[#d1d9e0] px-3 py-2 text-[12px]",
            who === "asha" ? "bg-[#ddf4ff]" : "bg-[#f6f8fa]"
          )}
        >
          <b>{who === "asha" ? USER : MENTOR}</b>
          <span className="text-[#59636e]">{header ?? "commented now"}</span>
          <span className="ml-auto">{menu ?? <MoreHorizontal className="size-4 text-[#59636e]" />}</span>
        </div>
        <div className="px-4 py-3 text-[12.5px] leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

const DESCRIPTION = (
  <div className="space-y-2">
    <p className="border-b border-[#d1d9e0] pb-1 text-[14px] font-semibold">What</p>
    <p>Adds a README explaining how to run the project.</p>
    <p className="border-b border-[#d1d9e0] pb-1 text-[14px] font-semibold">Why</p>
    <p>Anyone opening the repo should be able to start it.</p>
    <p className="border-b border-[#d1d9e0] pb-1 text-[14px] font-semibold">How to test</p>
    <ol className="list-decimal pl-5">
      <li>Follow the README steps from a fresh terminal.</li>
      <li>The project starts without errors.</li>
    </ol>
  </div>
)

function Sidebar({ reviewers }: { reviewers?: React.ReactNode }) {
  return (
    <div className="w-44 shrink-0 space-y-3 text-[12px]">
      {reviewers ?? (
        <div className="border-b border-[#d1d9e0] pb-3">
          <p className="flex items-center justify-between font-semibold text-[#59636e]">
            Reviewers <Settings className="size-3.5" />
          </p>
          <p className="mt-1 text-[#59636e]">No reviews</p>
        </div>
      )}
      {["Assignees", "Labels", "Projects"].map((s) => (
        <div key={s} className="border-b border-[#d1d9e0] pb-3">
          <p className="flex items-center justify-between font-semibold text-[#59636e]">
            {s} <Settings className="size-3.5" />
          </p>
          <p className="mt-1 text-[#59636e]">None yet</p>
        </div>
      ))}
    </div>
  )
}

function PrPage({
  os,
  title = "Add README with how to run the project",
  merged,
  children,
  reviewers,
  commits,
  repo,
}: {
  repo?: string
  os: OS
  title?: string
  merged?: boolean
  commits?: number
  children: React.ReactNode
  reviewers?: React.ReactNode
}) {
  return (
    <GitHubRepo os={os} path="/pull/1" tab="Pull requests" repo={repo}>
      <div className="px-6 py-4">
        <PrHeader title={title} number={1} merged={merged} commits={commits} />
        <div className="mt-4 flex gap-5">
          <div className="min-w-0 flex-1 space-y-4">{children}</div>
          <Sidebar reviewers={reviewers} />
        </div>
      </div>
    </GitHubRepo>
  )
}

/* ------------------------------------------------------------------ */
/* How we work — diagrams                                              */
/* ------------------------------------------------------------------ */

export function GoodBad({ rows, headers = ["Good", "Avoid"] }: { rows: { title: string; good: string[]; bad: string[] }[]; headers?: [string, string] }) {
  return (
    <Board>
      <div className="grid grid-cols-[110px_1fr_1fr] gap-x-4 gap-y-3 text-[12.5px]">
        <span />
        <p className="flex items-center gap-1.5 font-semibold text-[#1a7f37]">
          <CheckCircle2 className="size-4" /> {headers[0]}
        </p>
        <p className="flex items-center gap-1.5 font-semibold text-[#cf222e]">
          <X className="size-4" /> {headers[1]}
        </p>
        {rows.map((r) => (
          <div key={r.title} className="contents">
            <p className="pt-1 font-semibold text-[#59636e]">{r.title}</p>
            <div className="space-y-1.5">
              {r.good.map((g) => (
                <p key={g} className="rounded bg-[#dafbe1] px-2 py-1">
                  {g}
                </p>
              ))}
            </div>
            <div className="space-y-1.5">
              {r.bad.map((b) => (
                <p key={b} className="rounded bg-[#ffebe9] px-2 py-1">
                  {b}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Board>
  )
}

/** GitHub → Settings → Collaborators, adding the mentor. Used by every code track's Setup. */
export function CollaboratorsScreen({ repo, os }: { repo: string; os: OS }) {
  return (
    <GitHubRepo repo={repo} os={os} path="/settings/access" tab="Settings">
      <div className="relative flex min-h-[340px] gap-6 px-6 py-5">
        <div className="relative z-10 w-44 shrink-0 space-y-0.5 text-[12.5px]">
          <p className="rounded-md px-2 py-1">General</p>
          <p className="px-2 pt-2 pb-1 text-[11px] text-[#59636e]">Access</p>
          <Mark n={1} badge="r">
            <p className="rounded-md bg-[#eff2f5] px-2 py-1 font-semibold">Collaborators</p>
          </Mark>
          <p className="px-2 pt-2 pb-1 text-[11px] text-[#59636e]">Code and automation</p>
          {["Branches", "Rules", "Actions", "Webhooks"].map((s) => (
            <p key={s} className="rounded-md px-2 py-1">
              {s}
            </p>
          ))}
        </div>
        <div className="flex-1">
          <p className="border-b border-[#d1d9e0] pb-2 text-[18px]">Collaborators and teams</p>
          <div className="mt-4 rounded-md border border-[#d1d9e0] p-6 text-center">
            <p className="text-[13px] font-semibold">You haven&apos;t invited any collaborators yet</p>
            <span className="mt-3 inline-block rounded-md bg-[#1f883d] px-3 py-1.5 text-[12px] font-semibold text-white">Add people</span>
          </div>
        </div>
        <div className="absolute inset-0 flex items-start bg-black/30 pt-10 pl-[236px]">
          <div className="w-[380px] rounded-lg bg-white p-5 shadow-2xl">
            <p className="flex items-center justify-between text-[14px] font-semibold">
              Add a collaborator to {repo} <X className="size-4 text-[#59636e]" />
            </p>
            <Mark n={2} badge="r" className="mt-4">
              <div className="flex h-8 items-center gap-2 rounded-md border-2 border-[#0969da] px-2 text-[12.5px]">
                <Search className="size-3.5 text-[#59636e]" /> {MENTOR}
              </div>
            </Mark>
            <p className="mt-2 flex items-center gap-2 rounded-md bg-[#f6f8fa] px-2 py-1.5 text-[12px]">
              <Avatar who="mentor" /> <b>{MENTOR}</b> <span className="text-[#59636e]">Invite collaborator</span>
            </p>
            <Mark n={3} badge="r" className="mt-4">
              <span className="block rounded-md bg-[#1f883d] py-1.5 text-center text-[12px] font-semibold text-white">
                Add {MENTOR} to this repository
              </span>
            </Mark>
          </div>
        </div>
      </div>
    </GitHubRepo>
  )
}

export type WfCtx = {
  repo: string
  /** Top-level files and folders of the project, as VS Code's Explorer lists them. */
  root: TreeNode[]
  readme: string[]
  readmeExists: boolean
  /** Lines the "## You need" fix adds. */
  fixLines: number
  /** Short track name for email subjects, e.g. "Full-Stack". */
  tag: string
}

/** Sorts like VS Code's Explorer: folders first, then files, by name. */
function withNodes(root: TreeNode[], extra: TreeNode[]) {
  const names = new Set(extra.map((n) => n.name))
  const all = [...root.filter((n) => !names.has(n.name)), ...extra]
  return [...all.filter((n) => n.dir), ...all.filter((n) => !n.dir).sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))]
}

/** How we work screens for any code track's project. */
export function workflowScreensFor(c: WfCtx): Record<string, Screen> {
  const REPO = `${USER}/${c.repo}`
  const PROJECT = `devvy/${c.repo}`
  const README = c.readme
  const rootTree = (extra: TreeNode[] = []) => withNodes(c.root, extra)

  const wfMap: Screen = () => (
    <Board>
      <div className="flex items-center gap-4">
        <div className="flex-1 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <Laptop className="size-4" /> Your computer
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#424a53]">
            <Folder className="size-3.5" /> {c.repo} <span className="text-[#59636e]">(repository)</span>
          </p>
          <div className="mt-3 space-y-1.5">
            {["Add README", "Initial project setup"].map((c) => (
              <p key={c} className="flex items-center gap-1.5 rounded bg-white px-2 py-1 text-[11.5px]">
                <GitCommitHorizontal className="size-3.5 text-[#59636e]" /> {c}
              </p>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[#59636e]">Each line is a commit: a saved snapshot.</p>
        </div>
        <div className="flex w-36 flex-col gap-6">
          <Mark n={1} badge="tr">
            <p
              className="flex items-center justify-between rounded bg-[#ddf4ff] px-2 py-1.5 text-[12px] font-semibold text-[#0969da]"
              style={{ fontFamily: MONO_FONT }}
            >
              git push <ArrowRight className="size-4" />
            </p>
          </Mark>
          <Mark n={2} badge="br">
            <p
              className="flex items-center justify-between rounded bg-[#dafbe1] px-2 py-1.5 text-[12px] font-semibold text-[#1a7f37]"
              style={{ fontFamily: MONO_FONT }}
            >
              <ArrowLeft className="size-4" /> git pull
            </p>
          </Mark>
        </div>
        <div className="flex-1 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <SiGithub className="size-4" /> GitHub
          </p>
          <p className="mt-2 text-[12px] text-[#424a53]">{REPO}</p>
          <div className="mt-3 space-y-1.5">
            {["Add README", "Initial project setup"].map((c) => (
              <p key={c} className="flex items-center gap-1.5 rounded bg-white px-2 py-1 text-[11.5px]">
                <GitCommitHorizontal className="size-3.5 text-[#59636e]" /> {c}
              </p>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[#59636e]">The online copy your mentor reads.</p>
        </div>
      </div>
    </Board>
  )

  const wfBranchDiagram: Screen = () => (
    <Board className="p-0">
      <div className="relative h-[240px]">
        <svg className="absolute inset-0" width="100%" height="240" viewBox="0 0 712 240" fill="none">
          <line x1="40" y1="70" x2="680" y2="70" stroke="#1f2328" strokeWidth="4" strokeLinecap="round" />
          <path d="M150 70 C 190 70, 190 160, 240 160 L 470 160 C 520 160, 520 70, 560 70" stroke="#0969da" strokeWidth="4" fill="none" />
          {[90, 150, 560, 640].map((x) => (
            <circle key={x} cx={x} cy="70" r="9" fill="white" stroke="#1f2328" strokeWidth="4" />
          ))}
          {[290, 400].map((x) => (
            <circle key={x} cx={x} cy="160" r="9" fill="white" stroke="#0969da" strokeWidth="4" />
          ))}
        </svg>
        <div className="absolute top-[24px] left-[36px]">
          <Mark n={1} badge="r">
            <span className="block px-1.5 text-[13px] font-semibold" style={{ fontFamily: MONO_FONT }}>
              main
            </span>
          </Mark>
        </div>
        <div className="absolute top-[184px] left-[250px]">
          <Mark n={2} badge="r">
            <span className="block px-1.5 text-[13px] font-semibold text-[#0969da]" style={{ fontFamily: MONO_FONT }}>
              docs/readme
            </span>
          </Mark>
          <p className="mt-2 text-[11px] text-[#59636e]">your commits for one task</p>
        </div>
        <div className="absolute top-[96px] left-[476px] w-[120px]">
          <Mark n={3} badge="l">
            <span className="flex items-center gap-1 rounded bg-[#dafbe1] px-1.5 py-1 text-[11.5px] font-semibold text-[#1a7f37]">
              <GitPullRequest className="size-3.5" /> Pull request
            </span>
          </Mark>
        </div>
        <div className="absolute top-[22px] left-[512px]">
          <Mark n={4} badge="r">
            <span className="flex items-center gap-1 px-1.5 text-[12px] font-semibold text-[#8250df]">
              <GitMerge className="size-3.5" /> merge
            </span>
          </Mark>
        </div>
      </div>
    </Board>
  )

  const wfLoop: Screen = () => {
    const steps = ["Pull main", "New branch", "Commit", "Push", "Pull request", "Review → merge"]
    return (
      <Board>
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1.5">
              <div className="flex-1 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] px-2 py-3 text-center">
                <p className="mx-auto flex size-5 items-center justify-center rounded-full bg-[#1f2328] text-[10px] font-bold text-white">{i + 1}</p>
                <p className="mt-1.5 text-[11.5px] leading-tight font-semibold">{s}</p>
              </div>
              {i < steps.length - 1 && <ArrowRight className="size-3.5 shrink-0 text-[#8c959f]" />}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[12px] text-[#59636e]">↺ then start again for the next task</p>
      </Board>
    )
  }

  const wfNaming: Screen = () => (
    <GoodBad
      rows={[
        { title: "Branches", good: ["feat/login-page", "fix/cart-total"], bad: ["my-branch", "asha-changes-2"] },
        { title: "Commits", good: ["Add pagination to /orders", "Fix total when the cart is empty"], bad: ["update", "fixed stuff"] },
      ]}
    />
  )

  const wfAi: Screen = () => (
    <GoodBad
      headers={["Do", "Don't"]}
      rows={[
        {
          title: "Asking",
          good: ["“Explain this error”", "“What tests should this have?”"],
          bad: ["Pasting your .env or passwords", "“Build my whole project”"],
        },
        {
          title: "Submitting",
          good: ["Code you've read and tested", "Say what AI helped with"],
          bad: ["Code you can't explain", "Untested AI output"],
        },
      ]}
    />
  )

  /* ------------------------------------------------------------------ */
  /* How we work — terminal and editor                                   */
  /* ------------------------------------------------------------------ */

  const wfPull: Screen = (os) =>
    term(
      os,
      PROJECT,
      [
        { cmd: "git checkout main" },
        { out: "Already on 'main'" },
        { out: "Your branch is up to date with 'origin/main'." },
        { cmd: "git pull" },
        { out: "Already up to date.", tone: "ok", mark: 1 },
        { cmd: "" },
      ],
      { tree: rootTree() }
    )

  const wfNewBranch: Screen = (os) =>
    term(os, PROJECT, [{ cmd: "git checkout -b docs/readme" }, { out: "Switched to a new branch 'docs/readme'", tone: "ok", mark: 1 }, { cmd: "" }], {
      tree: rootTree(),
      branch: "docs/readme",
      branchMark: 2,
    })

  const wfReadme: Screen = (os) => (
    <VSCode
      os={os}
      folder={c.repo}
      tree={rootTree([{ name: "README.md", status: c.readmeExists ? "M" : "U", active: true, mark: 1 }])}
      editor={{ tabs: ["README.md"], active: "README.md", file: "README.md", lines: README }}
      branch="docs/readme"
    />
  )

  const wfStatus: Screen = (os) =>
    term(
      os,
      PROJECT,
      c.readmeExists
        ? [
            { cmd: "git status" },
            { out: "On branch docs/readme" },
            { out: "Changes not staged for commit:" },
            { out: '  (use "git add <file>..." to update what will be committed)', tone: "dim" },
            { out: "        modified:   README.md", tone: "err", mark: 1 },
            { out: "" },
            { out: 'no changes added to commit (use "git add" and/or "git commit -a")' },
          ]
        : [
            { cmd: "git status" },
            { out: "On branch docs/readme" },
            { out: "Untracked files:" },
            { out: '  (use "git add <file>..." to include in what will be committed)', tone: "dim" },
            { out: "        README.md", tone: "err", mark: 1 },
            { out: "" },
            { out: 'nothing added to commit but untracked files present (use "git add" to track)' },
          ],
      { tree: rootTree([{ name: "README.md", status: c.readmeExists ? "M" : "U" }]), branch: "docs/readme" }
    )

  const wfCommit: Screen = (os) =>
    term(
      os,
      PROJECT,
      [
        { cmd: "git add README.md" },
        { cmd: 'git commit -m "Add README with how to run the project"' },
        { out: "[docs/readme 8b1d4e2] Add README with how to run the project" },
        {
          out: c.readmeExists
            ? ` 1 file changed, ${README.length} insertions(+), 36 deletions(-)`
            : ` 1 file changed, ${README.length} insertions(+)`,
          tone: "ok",
          mark: 1,
        },
        ...(c.readmeExists ? [] : [{ out: " create mode 100644 README.md" }]),
        { cmd: "" },
      ],
      { tree: rootTree([{ name: "README.md" }]), branch: "docs/readme" }
    )

  const wfPush: Screen = (os) =>
    term(
      os,
      PROJECT,
      [
        { cmd: "git push -u origin docs/readme" },
        { out: "Writing objects: 100% (3/3), 412 bytes | 412.00 KiB/s, done." },
        { out: "remote:" },
        { out: "remote: Create a pull request for 'docs/readme' on GitHub by visiting:" },
        { out: `remote:      https://github.com/${REPO}/pull/new/docs/readme` },
        { out: `To https://github.com/${REPO}.git` },
        { out: " * [new branch]      docs/readme -> docs/readme", tone: "ok", mark: 1 },
        { out: "branch 'docs/readme' set up to track 'origin/docs/readme'." },
      ],
      { tree: rootTree([{ name: "README.md" }]), branch: "docs/readme", panel: 0.7 }
    )

  const wfPrCreate: Screen = (os) =>
    term(
      os,
      PROJECT,
      [
        { cmd: "gh pr create --fill" },
        { out: "" },
        { out: `Creating pull request for docs/readme into main in ${REPO}` },
        { out: "" },
        { out: `https://github.com/${REPO}/pull/1`, tone: "accent", mark: 1 },
        { cmd: "gh pr view --web" },
        { out: `Opening https://github.com/${REPO}/pull/1 in your browser.` },
      ],
      { tree: rootTree([{ name: "README.md" }]), branch: "docs/readme", panel: 0.66 }
    )

  const wfPrEdit: Screen = (os) => (
    <PrPage repo={c.repo} os={os}>
      <CommentBox
        who="asha"
        header="commented 1 minute ago"
        menu={
          <span className="relative block">
            <Mark n={1} badge="l">
              <MoreHorizontal className="size-4 text-[#59636e]" />
            </Mark>
            <span className="absolute top-6 right-0 z-10">
              <Menu
                os="mac"
                className="w-40 bg-white"
                items={[{ label: "Copy link" }, { label: "Quote reply" }, "sep", { label: "Edit", mark: 2 }, { label: "Report content" }]}
              />
            </span>
          </span>
        }
      >
        <p className="text-[#59636e] italic">No description provided.</p>
      </CommentBox>
      <div className="h-28" />
    </PrPage>
  )

  const wfReviewers: Screen = (os) => (
    <PrPage
      repo={c.repo}
      os={os}
      reviewers={
        <div className="relative border-b border-[#d1d9e0] pb-3">
          <Mark n={1} badge="tl">
            <p className="flex items-center justify-between px-1 font-semibold text-[#59636e]">
              Reviewers <Settings className="size-3.5" />
            </p>
          </Mark>
          <div className="absolute top-8 right-0 z-10 w-56 rounded-md border border-[#d1d9e0] bg-white shadow-xl">
            <p className="border-b border-[#d1d9e0] px-3 py-2 text-[11.5px] font-semibold">Request up to 15 reviewers</p>
            <div className="border-b border-[#d1d9e0] p-2">
              <div className="flex h-7 items-center rounded-md border border-[#d1d9e0] px-2 text-[11.5px] text-[#59636e]">Type or choose a user</div>
            </div>
            <Mark n={2} badge="l" className="m-1">
              <p className="flex items-center gap-2 px-2 py-1.5 text-[12px]">
                <Check className="size-3.5" />
                <Avatar who="mentor" /> <b>{MENTOR}</b>
              </p>
            </Mark>
          </div>
        </div>
      }
    >
      <CommentBox who="asha" header="commented 3 minutes ago">
        {DESCRIPTION}
      </CommentBox>
    </PrPage>
  )

  const wfReviewComment: Screen = (os) => (
    <PrPage
      repo={c.repo}
      os={os}
      reviewers={
        <div className="border-b border-[#d1d9e0] pb-3">
          <p className="flex items-center justify-between font-semibold text-[#59636e]">
            Reviewers <Settings className="size-3.5" />
          </p>
          <p className="mt-1 flex items-center gap-1.5">
            <Avatar who="mentor" size={16} /> {MENTOR}
          </p>
        </div>
      }
    >
      <p className="flex items-center gap-2 pl-2 text-[12px] text-[#59636e]">
        <Avatar who="mentor" /> <b className="text-[#1f2328]">{MENTOR}</b> requested changes 2 minutes ago
      </p>
      <Mark n={1} badge="tl">
        <div className="rounded-md border border-[#d1d9e0]">
          <p className="flex items-center gap-1.5 border-b border-[#d1d9e0] bg-[#f6f8fa] px-3 py-1.5 text-[12px] font-semibold">
            <FileText className="size-3.5" /> README.md
          </p>
          <p className="border-b border-[#d1d9e0] bg-[#dafbe1] px-3 py-1 text-[11.5px]" style={{ fontFamily: MONO_FONT }}>
            + ## Run it locally
          </p>
          <div className="flex gap-2.5 px-3 py-3 text-[12.5px]">
            <Avatar who="mentor" size={24} />
            <div>
              <p className="text-[12px]">
                <b>{MENTOR}</b> <span className="text-[#59636e]">2 minutes ago</span>
              </p>
              <p className="mt-1">
                Nice and clear! Could you add what needs to be installed first? Someone new won&apos;t know PostgreSQL has to be running.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-[#d1d9e0] px-3 py-2">
            <span className="flex h-7 flex-1 items-center rounded-md border border-[#d1d9e0] px-2 text-[11.5px] text-[#59636e]">Reply…</span>
            <Mark n={2} badge="tr">
              <span className="block rounded-md border border-[#d1d9e0] bg-[#f6f8fa] px-2.5 py-1 text-[11.5px] font-semibold">
                Resolve conversation
              </span>
            </Mark>
          </div>
        </div>
      </Mark>
    </PrPage>
  )

  const wfFixPush: Screen = (os) =>
    term(
      os,
      PROJECT,
      [
        { cmd: "git add README.md" },
        { cmd: 'git commit -m "Add requirements to README"' },
        { out: "[docs/readme 4c7a90e] Add requirements to README" },
        { out: ` 1 file changed, ${c.fixLines} insertions(+)` },
        { cmd: "git push" },
        { out: `To https://github.com/${REPO}.git` },
        { out: "   8b1d4e2..4c7a90e  docs/readme -> docs/readme", tone: "ok", mark: 1 },
        { cmd: "" },
      ],
      { tree: rootTree([{ name: "README.md", active: true }]), branch: "docs/readme", panel: 0.66 }
    )

  const wfMerge: Screen = (os) => (
    <PrPage
      repo={c.repo}
      os={os}
      commits={2}
      reviewers={
        <div className="border-b border-[#d1d9e0] pb-3">
          <p className="flex items-center justify-between font-semibold text-[#59636e]">
            Reviewers <Settings className="size-3.5" />
          </p>
          <p className="mt-1 flex items-center gap-1.5">
            <Avatar who="mentor" size={16} /> {MENTOR} <Check className="ml-auto size-3.5 text-[#1a7f37]" />
          </p>
        </div>
      }
    >
      <p className="flex items-center gap-2 pl-2 text-[12px] text-[#59636e]">
        <GitCommitHorizontal className="size-4" /> <b className="text-[#1f2328]">{USER}</b> added 1 commit: Add requirements to README
      </p>
      <p className="flex items-center gap-2 pl-2 text-[12px] text-[#59636e]">
        <CheckCircle2 className="size-4 text-[#1a7f37]" /> <b className="text-[#1f2328]">{MENTOR}</b> approved these changes
      </p>
      <div className="flex gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#1f883d] text-white">
          <GitMerge className="size-4" />
        </span>
        <div className="flex-1 rounded-md border border-[#d1d9e0]">
          <Mark n={1} badge="tr" className="m-1">
            <div className="flex items-center gap-2.5 px-3 py-2.5 text-[12.5px]">
              <CheckCircle2 className="size-5 text-[#1a7f37]" />
              <div>
                <p className="font-semibold">Changes approved</p>
                <p className="text-[11.5px] text-[#59636e]">1 approving review by {MENTOR}</p>
              </div>
            </div>
          </Mark>
          <div className="flex items-center gap-2.5 border-t border-[#d1d9e0] px-4 py-2.5 text-[12.5px]">
            <CheckCircle2 className="size-5 text-[#1a7f37]" />
            <p className="font-semibold">This branch has no conflicts with the base branch</p>
          </div>
          <div className="border-t border-[#d1d9e0] bg-[#f6f8fa] px-4 py-3">
            <Mark n={2} badge="r" className="inline-block">
              <span className="flex items-center rounded-md bg-[#1f883d] text-[12.5px] font-semibold text-white">
                <span className="px-3 py-1.5">Merge pull request</span>
                <span className="border-l border-white/30 px-2 py-1.5">
                  <ChevronDown className="size-3.5" />
                </span>
              </span>
            </Mark>
          </div>
        </div>
      </div>
    </PrPage>
  )

  const wfUpdateMain: Screen = (os) =>
    term(
      os,
      PROJECT,
      [
        { cmd: "git checkout main" },
        { out: "Switched to branch 'main'" },
        { cmd: "git pull" },
        { out: "Updating 3f9a7c2..9e04b11" },
        { out: "Fast-forward" },
        { out: ` README.md | ${README.length + c.fixLines} ${"+".repeat(README.length + c.fixLines)}`, tone: "ok", mark: 1 },
        { out: ` 1 file changed, ${README.length + c.fixLines} insertions(+)` },
        { cmd: "git branch -d docs/readme" },
        { out: "Deleted branch docs/readme (was 4c7a90e).", tone: "ok", mark: 2 },
      ],
      { tree: rootTree([{ name: "README.md" }]), panel: 0.7 }
    )

  const wfEmail: Screen = () => (
    <EmailCompose to={MENTOR_EMAIL} subject={`[${c.tag}] PR ready for review: Add README with how to run the project`} toMark={1} subjectMark={2}>
      <p>Hi! My README pull request is ready for review:</p>
      <Mark n={3} badge="r" className="mr-8 inline-block">
        <p className="px-1 text-[#0b57d0] underline">https://github.com/{REPO}/pull/1</p>
      </Mark>
      <p>Could you check the run steps are clear enough for someone new?</p>
    </EmailCompose>
  )

  /* ---- Git commands explained / Oops ---- */
  const FB = "feat/your-task"
  const withReadme = (status?: "M" | "U") => rootTree([{ name: "README.md", status }])
  const g = (os: OS, lines: TermLine[], branch = FB, extra: Partial<VSCodeProps> = {}) =>
    term(os, PROJECT, lines, { tree: withReadme("M"), branch, panel: 0.66, ...extra })

  const gcStatus: Screen = (os) =>
    g(os, [
      { cmd: "git status" },
      { out: `On branch ${FB}`, mark: 1 },
      { out: "Changes not staged for commit:" },
      { out: '  (use "git add <file>..." to update what will be committed)', tone: "dim" },
      { out: "        modified:   README.md", tone: "err", mark: 2 },
      { out: "" },
      { out: 'no changes added to commit (use "git add" and/or "git commit -a")' },
    ])
  const gcDiff: Screen = (os) =>
    g(os, [
      { cmd: "git diff" },
      { out: "diff --git a/README.md b/README.md", tone: "bold" },
      { out: "@@ -5,3 +5,4 @@", tone: "accent" },
      { out: " ## Run it locally" },
      { out: "-1. Start it", tone: "err" },
      { out: "+1. Install the libraries first", tone: "ok" },
      { out: "+2. Then start it", tone: "ok" },
    ])
  const gcAdd: Screen = (os) =>
    g(os, [
      { cmd: "git add README.md" },
      { cmd: "git status" },
      { out: `On branch ${FB}` },
      { out: "Changes to be committed:" },
      { out: "        modified:   README.md", tone: "ok", mark: 1 },
      { cmd: "" },
    ])
  const gcCommit: Screen = (os) =>
    g(
      os,
      [{ cmd: 'git commit -m "Add setup steps to README"' }, { out: `[${FB} 6e1f2a4] Add setup steps to README` }, { out: " 1 file changed, 2 insertions(+), 1 deletion(-)", tone: "ok" }, { cmd: "" }],
      FB,
      { tree: withReadme() }
    )
  const gcLog: Screen = (os) =>
    g(
      os,
      [
        { cmd: "git log --oneline" },
        { out: `6e1f2a4 (HEAD -> ${FB}) Add setup steps to README`, tone: "warn" },
        { out: "9e04b11 (origin/main, main) Merge pull request #1" },
        { out: "4c7a90e Add requirements to README" },
        { out: "8b1d4e2 Add README with how to run the project" },
        { out: "3f9a7c2 Initial project setup" },
        { cmd: "" },
      ],
      FB,
      { tree: withReadme() }
    )
  const gcPush: Screen = (os) =>
    g(
      os,
      [
        { cmd: `git push -u origin ${FB}` },
        { out: `To https://github.com/${REPO}.git` },
        { out: ` * [new branch]      ${FB} -> ${FB}`, tone: "ok" },
        { out: `branch '${FB}' set up to track 'origin/${FB}'.` },
        { cmd: "git push" },
        { out: "Everything up-to-date" },
      ],
      FB,
      { tree: withReadme() }
    )
  const gcPull: Screen = (os) =>
    g(
      os,
      [{ cmd: "git pull" }, { out: "Updating 9e04b11..c2d7e90" }, { out: "Fast-forward" }, { out: " README.md | 3 ++-", tone: "ok" }, { out: " 1 file changed, 2 insertions(+), 1 deletion(-)" }, { cmd: "" }],
      "main",
      { tree: withReadme() }
    )
  const gcBranch: Screen = (os) =>
    g(
      os,
      [
        { cmd: `git checkout -b ${FB}` },
        { out: `Switched to a new branch '${FB}'`, tone: "ok" },
        { cmd: "git branch" },
        { out: `* ${FB}`, tone: "ok", mark: 1 },
        { out: "  main" },
        { cmd: "" },
      ],
      FB,
      { tree: withReadme() }
    )

  const oopsRestore: Screen = (os) =>
    g(os, [{ cmd: "git restore README.md" }, { cmd: "git status" }, { out: `On branch ${FB}` }, { out: "nothing to commit, working tree clean", tone: "ok" }, { cmd: "" }], FB, { tree: withReadme() })
  const oopsUnstage: Screen = (os) =>
    g(os, [
      { cmd: "git restore --staged README.md" },
      { cmd: "git status" },
      { out: `On branch ${FB}` },
      { out: "Changes not staged for commit:" },
      { out: "        modified:   README.md", tone: "err", mark: 1 },
      { cmd: "" },
    ])
  const oopsAmend: Screen = (os) =>
    g(
      os,
      [
        { cmd: 'git commit --amend -m "Add setup steps to README"' },
        { out: `[${FB} 7a2c9d0] Add setup steps to README`, tone: "ok" },
        { out: " Date: Tue Nov 11 10:24:13 2026 +0530" },
        { out: " 1 file changed, 2 insertions(+), 1 deletion(-)" },
        { cmd: "" },
      ],
      FB,
      { tree: withReadme() }
    )
  const oopsReset: Screen = (os) =>
    g(os, [
      { cmd: "git reset --soft HEAD~1" },
      { cmd: "git status" },
      { out: `On branch ${FB}` },
      { out: "Changes to be committed:" },
      { out: "        modified:   README.md", tone: "ok", mark: 1 },
      { cmd: "" },
    ])
  const oopsMain: Screen = (os) =>
    g(
      os,
      [
        { cmd: `git branch ${FB}` },
        { cmd: "git reset --hard origin/main" },
        { out: "HEAD is now at 9e04b11 Merge pull request #1" },
        { cmd: `git checkout ${FB}` },
        { out: `Switched to branch '${FB}'`, tone: "ok" },
        { cmd: "git log --oneline -2" },
        { out: `6e1f2a4 (HEAD -> ${FB}) Add setup steps to README`, tone: "warn" },
        { out: "9e04b11 (origin/main, main) Merge pull request #1" },
      ],
      FB,
      { tree: withReadme() }
    )
  const oopsStash: Screen = (os) =>
    g(
      os,
      [
        { cmd: "git checkout main" },
        { out: "error: Your local changes to the following files would be overwritten by checkout:", tone: "err" },
        { out: "        README.md", tone: "err" },
        { out: "Please commit your changes or stash them before you switch branches.", tone: "err" },
        { cmd: "git stash" },
        { out: `Saved working directory and index state WIP on ${FB}: 6e1f2a4 Add setup steps to README`, tone: "ok" },
        { cmd: "git checkout main" },
        { out: "Switched to branch 'main'", tone: "ok" },
      ],
      "main",
      { panel: 0.72 }
    )
  const oopsPager: Screen = (os) =>
    g(
      os,
      [
        { cmd: "git log" },
        { out: `commit 6e1f2a4c0b… (HEAD -> ${FB})`, tone: "warn" },
        { out: "Author: Asha Rao <asha@example.com>" },
        { out: "Date:   Tue Nov 11 10:24:13 2026 +0530" },
        { out: "" },
        { out: "    Add setup steps to README" },
        { out: "(END)", tone: "bold", mark: 1 },
      ],
      FB,
      { tree: withReadme(), panel: 0.7 }
    )

  return {
    "wf-email": wfEmail,
    "gc-status": gcStatus,
    "gc-diff": gcDiff,
    "gc-add": gcAdd,
    "gc-commit": gcCommit,
    "gc-log": gcLog,
    "gc-push": gcPush,
    "gc-pull": gcPull,
    "gc-branch": gcBranch,
    "oops-restore": oopsRestore,
    "oops-unstage": oopsUnstage,
    "oops-amend": oopsAmend,
    "oops-reset": oopsReset,
    "oops-main": oopsMain,
    "oops-stash": oopsStash,
    "oops-pager": oopsPager,
    "wf-map": wfMap,
    "wf-branch-diagram": wfBranchDiagram,
    "wf-loop": wfLoop,
    "wf-naming": wfNaming,
    "wf-ai": wfAi,
    "wf-pull": wfPull,
    "wf-new-branch": wfNewBranch,
    "wf-readme": wfReadme,
    "wf-status": wfStatus,
    "wf-commit": wfCommit,
    "wf-push": wfPush,
    "wf-pr-create": wfPrCreate,
    "wf-pr-edit": wfPrEdit,
    "wf-reviewers": wfReviewers,
    "wf-review-comment": wfReviewComment,
    "wf-fix-push": wfFixPush,
    "wf-merge": wfMerge,
    "wf-update-main": wfUpdateMain,
  }
}

/* ------------------------------------------------------------------ */
/* Environment & secrets — diagrams                                    */
/* ------------------------------------------------------------------ */

export function FileChip({
  name,
  lines,
  tone = "plain",
  crossed,
}: {
  name: string
  lines?: string[]
  tone?: "plain" | "secret" | "safe"
  crossed?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-white text-[11.5px]",
        tone === "secret" ? "border-[#ff8182]" : tone === "safe" ? "border-[#4ac26b]" : "border-[#d0d7de]",
        crossed && "opacity-60"
      )}
    >
      <p
        className={cn("flex items-center gap-1.5 border-b border-inherit px-2 py-1 font-semibold", crossed && "line-through")}
        style={{ fontFamily: MONO_FONT }}
      >
        {tone === "secret" ? <KeyRound className="size-3.5 text-[#cf222e]" /> : <FileText className="size-3.5 text-[#59636e]" />}
        {name}
      </p>
      {lines && (
        <div className="px-2 py-1 text-[10.5px] leading-relaxed text-[#424a53]" style={{ fontFamily: MONO_FONT }}>
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      )}
    </div>
  )
}

const envDiagram: Screen = () => (
  <Board>
    <div className="flex items-center gap-4">
      <div className="flex-1 space-y-3 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
        <p className="flex items-center gap-2 text-[13px] font-semibold">
          <Laptop className="size-4" /> Your computer
        </p>
        <Mark n={1} badge="tr">
          <FileChip name="server/.env" tone="secret" lines={['DATABASE_URL="…:devvy123@…"', 'JWT_SECRET="9f2c…"']} />
        </Mark>
        <Mark n={2} badge="tr">
          <FileChip name="server/.gitignore" lines={["node_modules", ".env  ← skip it", "dist"]} />
        </Mark>
      </div>
      <div className="flex w-24 flex-col items-center gap-1 text-[11px] text-[#59636e]">
        <span style={{ fontFamily: MONO_FONT }}>git push</span>
        <ArrowRight className="size-6" />
        <span className="text-center">.env stays behind</span>
      </div>
      <div className="flex-1 space-y-3 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
        <p className="flex items-center gap-2 text-[13px] font-semibold">
          <SiGithub className="size-4" /> GitHub — anyone can read
        </p>
        <Mark n={3} badge="tr">
          <FileChip name="server/.env.example" tone="safe" lines={["DATABASE_URL=", "JWT_SECRET=", "PORT=4000"]} />
        </Mark>
        <FileChip name="server/.env" crossed />
      </div>
    </div>
  </Board>
)

const envHistory: Screen = () => {
  const commits = [
    { id: "a91f3c2", msg: "Remove .env", note: "the file is gone from the folder…" },
    { id: "7c0d1e9", msg: "Add login route" },
    { id: "3e8b2a4", msg: "Add .env by mistake", leak: true },
    { id: "3f9a7c2", msg: "Initial project setup" },
  ]
  return (
    <Board>
      <p className="mb-3 text-[13px] font-semibold">Your repository&apos;s history (newest first)</p>
      <div className="space-y-2">
        {commits.map((c) => {
          const row = (
            <div className={cn("rounded-md border px-3 py-2 text-[12px]", c.leak ? "border-[#ff8182] bg-[#fff5f5]" : "border-[#d0d7de]")}>
              <p className="flex items-center gap-2">
                <GitCommitHorizontal className="size-4 text-[#59636e]" />
                <code className="text-[#59636e]" style={{ fontFamily: MONO_FONT }}>
                  {c.id}
                </code>
                <b>{c.msg}</b>
                {c.note && <span className="text-[#59636e]">— {c.note}</span>}
              </p>
              {c.leak && (
                <p className="mt-1.5 ml-6 rounded bg-[#ffebe9] px-2 py-1 text-[11px] text-[#cf222e]" style={{ fontFamily: MONO_FONT }}>
                  + DATABASE_URL=&quot;postgresql://postgres:devvy123@localhost:5432/…&quot;
                </p>
              )}
            </div>
          )
          return c.leak ? (
            <Mark key={c.id} n={1} badge="r">
              {row}
            </Mark>
          ) : (
            <div key={c.id}>{row}</div>
          )
        })}
      </div>
      <p className="mt-3 text-[12px] text-[#cf222e]">…but anyone can still open commit 3e8b2a4 and read the password.</p>
    </Board>
  )
}

const envLeak: Screen = () => (
  <Board>
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: KeyRound, title: "Change it", body: "New JWT_SECRET, new database password, or a new API key." },
        { icon: FileText, title: "Update .env", body: "Paste the new value and restart the server." },
        { icon: ShieldAlert, title: "Tell your mentor", body: "Straight away. Nobody gets in trouble for reporting it." },
      ].map(({ icon: Icon, title, body }, i) => (
        <div key={title} className="rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-3">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#1f2328] text-[10px] text-white">{i + 1}</span>
            <Icon className="size-4 text-[#59636e]" /> {title}
          </p>
          <p className="mt-1.5 text-[12px] text-[#424a53]">{body}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 flex items-center gap-2 rounded-md bg-[#ffebe9] px-3 py-2 text-[12px] text-[#cf222e]">
      <X className="size-4" /> Deleting the file, the commit or even the repo doesn&apos;t make the old secret safe again.
    </p>
  </Board>
)

const envHosting: Screen = (os) => (
  <Browser os={os} url="dashboard.host.example/my-fullstack-api/environment" tab="Environment · my-fullstack-api">
    <div className="flex min-h-[260px] text-[#1f2328]">
      <div className="w-40 shrink-0 space-y-1 border-r border-[#e5e7eb] bg-[#fafafa] p-3 text-[12px]">
        {["Overview", "Deploys", "Logs", "Environment", "Settings"].map((s) => (
          <p key={s} className={cn("rounded-md px-2 py-1", s === "Environment" && "bg-[#eef0f3] font-semibold")}>
            {s}
          </p>
        ))}
      </div>
      <div className="flex-1 p-5">
        <p className="text-[16px] font-semibold">Environment variables</p>
        <p className="mt-1 text-[12px] text-[#59636e]">Your app reads these like a .env file. Values are hidden after saving.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Mark n={1} badge="tl">
            <div className="space-y-1.5 p-1">
              <p className="text-[11px] font-semibold text-[#59636e]">Key</p>
              {["DATABASE_URL", "JWT_SECRET", "CLIENT_URL"].map((k) => (
                <p key={k} className="rounded border border-[#d0d7de] px-2 py-1 text-[11.5px]" style={{ fontFamily: MONO_FONT }}>
                  {k}
                </p>
              ))}
            </div>
          </Mark>
          <Mark n={2} badge="tr">
            <div className="space-y-1.5 p-1">
              <p className="text-[11px] font-semibold text-[#59636e]">Value</p>
              {["••••••••••••••••", "••••••••••••••••", "https://my-fullstack-app.example"].map((v, i) => (
                <p key={i} className="truncate rounded border border-[#d0d7de] px-2 py-1 text-[11.5px]" style={{ fontFamily: MONO_FONT }}>
                  {v}
                </p>
              ))}
            </div>
          </Mark>
        </div>
      </div>
    </div>
  </Browser>
)

/* ------------------------------------------------------------------ */
/* Environment & secrets — terminal, editor, browser                   */
/* ------------------------------------------------------------------ */

const envCheckIgnore: Screen = (os) =>
  term(
    os,
    PROJECT,
    [{ cmd: "git check-ignore -v server/.env" }, { out: "server/.gitignore:2:.env\tserver/.env", tone: "ok", mark: 1 }, { cmd: "" }],
    {
      tree: serverTree({ envMark: 2 }),
    }
  )

const envGithubServer: Screen = (os) => (
  <GitHubRepo os={os} path="/tree/main/server" tab="Code">
    <div className="px-6 py-4">
      <p className="flex items-center gap-2 text-[13px]">
        <span className="rounded-md border border-[#d1d9e0] px-2 py-1 font-semibold">
          <GitBranch className="mr-1 inline size-3.5" />
          main
        </span>
        <span className="text-[#0969da]">my-fullstack-app</span> / <b>server</b>
      </p>
      <Mark n={1} badge="r" className="mt-3">
        <div className="overflow-hidden rounded-md border border-[#d1d9e0]">
          <p className="flex items-center gap-2 bg-[#f6f8fa] px-4 py-2 text-[12px]">
            <Avatar who="asha" /> <b>{USER}</b> Add README with how to run the project
          </p>
          {[
            { name: "prisma", dir: true },
            { name: "src", dir: true },
            { name: ".gitignore" },
            { name: "package-lock.json" },
            { name: "package.json" },
            { name: "tsconfig.json" },
          ].map((f) => (
            <p key={f.name} className="flex items-center gap-2 border-t border-[#d1d9e0] px-4 py-1.5 text-[12.5px]">
              {f.dir ? <Folder className="size-4 fill-[#54aeff] text-[#54aeff]" /> : <FileText className="size-4 text-[#59636e]" />}
              {f.name}
              <span className="ml-auto text-[11.5px] text-[#59636e]">Initial project setup</span>
            </p>
          ))}
        </div>
      </Mark>
      <p className="mt-3 text-[12px] text-[#1a7f37]">No .env here — exactly right.</p>
    </div>
  </GitHubRepo>
)

const envBranch: Screen = (os) =>
  term(
    os,
    PROJECT,
    [
      { cmd: "git checkout main" },
      { out: "Already on 'main'" },
      { cmd: "git pull" },
      { out: "Already up to date." },
      { cmd: "git checkout -b feat/env-setup" },
      { out: "Switched to a new branch 'feat/env-setup'", tone: "ok" },
      { cmd: "" },
    ],
    { tree: rootTree([{ name: "README.md" }]), branch: "feat/env-setup", branchMark: 1 }
  )

const EXAMPLE = [
  "# PostgreSQL connection: postgresql://USER:PASSWORD@HOST:PORT/DATABASE",
  "DATABASE_URL=",
  "# Long random string used to sign login tokens",
  "JWT_SECRET=",
  "# Port the API listens on",
  "PORT=4000",
  "# Where the React app runs (allowed by CORS)",
  "CLIENT_URL=http://localhost:5173",
]

const envExampleFile: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={serverTree({ example: true, active: ".env.example" })}
    editor={{ tabs: [".env.example"], active: ".env.example", file: "server/.env.example", lines: EXAMPLE }}
    branch="feat/env-setup"
  />
)

const envJwt: Screen = (os) =>
  term(
    os,
    PROJECT,
    [
      { cmd: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"" },
      { out: "9f2c41d87a0b5e63c1f8d24a97e0b3c6158d2fa4e07c9b61a3d5f82e4c0b9a71", tone: "bold", mark: 1 },
      { cmd: "" },
    ],
    { tree: serverTree({ example: true }), branch: "feat/env-setup" }
  )

const envDotenv: Screen = (os) => {
  const url = os === "mac" ? "postgresql://asha@localhost:5432/devvy_fullstack" : "postgresql://postgres:devvy123@localhost:5432/devvy_fullstack"
  return (
    <VSCode
      os={os}
      folder="my-fullstack-app"
      tree={serverTree({ example: true, active: ".env" })}
      editor={{
        tabs: [".env.example", ".env"],
        active: ".env",
        file: "server/.env",
        lines: [
          `DATABASE_URL="${url}"`,
          "PORT=4000",
          'CLIENT_URL="http://localhost:5173"',
          'JWT_SECRET="9f2c41d87a0b5e63c1f8d24a97e0b3c6158d2fa4e07c9b61a3d5f82e4c0b9a71"',
        ],
        mark: { from: 4, to: 4, n: 1 },
      }}
      branch="feat/env-setup"
    />
  )
}

const envRestart: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={serverTree({ example: true })}
    branch="feat/env-setup"
    terminal={{
      cwd: SERVER,
      list: ["node", "node", os === "windows" ? "powershell" : os === "mac" ? "zsh" : "bash"],
      lines: [
        { out: "API running on http://localhost:4000" },
        { out: "^C", tone: "bold", mark: 1 },
        { cmd: "npm run dev" },
        { out: "> server@1.0.0 dev" },
        { out: "> tsx watch src/index.ts" },
        { out: "" },
        { out: "API running on http://localhost:4000", tone: "ok", mark: 2 },
      ],
    }}
    panel={0.62}
  />
)

const envClientEnv: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={clientTree({ env: true, active: ".env" })}
    editor={{ tabs: [".env", ".env.example"], active: ".env", file: "client/.env", lines: ["VITE_API_URL=http://localhost:4000"] }}
    branch="feat/env-setup"
  />
)

const VITE_GITIGNORE = [
  "node_modules",
  "dist",
  "dist-ssr",
  "*.local",
  "",
  "# Editor directories and files",
  ".vscode/*",
  "!.vscode/extensions.json",
  ".idea",
  ".DS_Store",
  "*.suo",
  "*.sw?",
  ".env",
]

const envClientGitignore: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={clientTree({ env: true, active: ".gitignore", gitignoreStatus: "M" }).map((n) =>
      n.name === ".env" ? { ...n, status: undefined, ignored: true } : n
    )}
    editor={{
      tabs: [".env", ".gitignore"],
      active: ".gitignore",
      file: "client/.gitignore",
      lines: VITE_GITIGNORE,
      mark: { from: 13, to: 13, n: 1 },
    }}
    branch="feat/env-setup"
    height={460}
  />
)

const APP = [
  'import { useEffect, useState } from "react"',
  "",
  "const API_URL = import.meta.env.VITE_API_URL",
  "",
  "export default function App() {",
  '  const [status, setStatus] = useState("checking…")',
  "",
  "  useEffect(() => {",
  "    fetch(`${API_URL}/health`)",
  "      .then((res) => res.json())",
  '      .then((data) => setStatus(data.ok ? "connected ✅" : "not ok"))',
  '      .catch(() => setStatus("can\'t reach the API ❌"))',
  "  }, [])",
  "",
  "  return (",
  '    <main style={{ fontFamily: "sans-serif", padding: 40 }}>',
]

const envApp: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={clientTree({ env: true, active: "App.tsx", appStatus: "M" }).map((n) =>
      n.name === ".env" ? { ...n, status: undefined, ignored: true } : n
    )}
    editor={{ tabs: [".gitignore", "App.tsx"], active: "App.tsx", file: "client/src/App.tsx", lines: APP, mark: { from: 3, to: 3, n: 1 } }}
    branch="feat/env-setup"
    height={470}
  />
)

const envBrowser: Screen = (os) => (
  <Browser os={os} url="localhost:5173" tab="Vite + React + TS" tabIcon={<SiVite className="size-3.5 text-[#646cff]" />}>
    <div className="min-h-[220px] bg-[#242424] p-10 text-[rgba(255,255,255,0.87)]" style={{ fontFamily: "sans-serif" }}>
      <p className="flex items-center gap-3 text-[32px] font-bold">
        <SiReact className="size-8 text-[#61dafb]" /> My Full-Stack App
      </p>
      <Mark n={1} badge="r" className="mt-4 inline-block">
        <p className="px-1 text-[16px]">API: connected ✅</p>
      </Mark>
    </div>
  </Browser>
)

const envGitStatus: Screen = (os) =>
  term(
    os,
    PROJECT,
    [
      { cmd: "git add ." },
      { cmd: "git status" },
      { out: "On branch feat/env-setup" },
      { out: "Changes to be committed:" },
      { out: "        new file:   client/.env.example", tone: "ok", mark: 1 },
      { out: "        modified:   client/.gitignore", tone: "ok" },
      { out: "        modified:   client/src/App.tsx", tone: "ok" },
      { out: "        new file:   server/.env.example", tone: "ok", mark: 2 },
      { cmd: "" },
    ],
    { tree: rootTree([{ name: "README.md" }]), branch: "feat/env-setup", panel: 0.68 }
  )

const envPr: Screen = (os) =>
  term(
    os,
    PROJECT,
    [
      { cmd: 'git commit -m "Add env examples and show API status"' },
      { out: "[feat/env-setup 2d6b8f1] Add env examples and show API status" },
      { out: " 4 files changed, 31 insertions(+), 30 deletions(-)" },
      { cmd: "git push -u origin feat/env-setup" },
      { out: " * [new branch]      feat/env-setup -> feat/env-setup" },
      { cmd: "gh pr create --fill" },
      { out: `Creating pull request for feat/env-setup into main in ${REPO}` },
      { out: `https://github.com/${REPO}/pull/2`, tone: "accent", mark: 1 },
    ],
    { tree: rootTree([{ name: "README.md" }]), branch: "feat/env-setup", panel: 0.72 }
  )

const envPushBlocked: Screen = (os) => {
  const lines: TermLine[] = [
    { cmd: "git push -u origin feat/payments" },
    { out: "remote: error: GH013: Repository rule violations found for refs/heads/feat/payments.", tone: "err" },
    { out: "remote: - GITHUB PUSH PROTECTION" },
    { out: "remote:     Resolve the following violations before pushing again" },
    { out: "remote:     - Push cannot contain secrets", tone: "err", mark: 1 },
    { out: "remote:       —— Stripe API Key ————————————" },
    { out: "remote:         path: server/src/payments.ts:3" },
    { out: "remote:     To push, remove secret from commit(s) or follow this URL to allow the secret." },
    { out: " ! [remote rejected] feat/payments -> feat/payments (push declined due to repository rule violations)", tone: "err" },
    { out: "error: failed to push some refs", tone: "err" },
  ]
  return term(os, PROJECT, lines, { tree: rootTree([{ name: "README.md" }]), branch: "feat/payments", panel: 0.8, height: 470 })
}

/* ------------------------------------------------------------------ */

export const workflowScreens: Record<string, Screen> = {
  ...workflowScreensFor({
    repo: "my-fullstack-app",
    root: [
      { name: "client", dir: true },
      { name: "server", dir: true },
    ],
    readme: README,
    readmeExists: false,
    fixLines: 6,
    tag: "Full-Stack",
  }),
  "env-diagram": envDiagram,
  "env-history": envHistory,
  "env-check-ignore": envCheckIgnore,
  "env-github-server": envGithubServer,
  "env-branch": envBranch,
  "env-example-file": envExampleFile,
  "env-jwt": envJwt,
  "env-dotenv": envDotenv,
  "env-restart": envRestart,
  "env-client-env": envClientEnv,
  "env-client-gitignore": envClientGitignore,
  "env-app": envApp,
  "env-browser": envBrowser,
  "env-git-status": envGitStatus,
  "env-pr": envPr,
  "env-push-blocked": envPushBlocked,
  "env-leak": envLeak,
  "env-hosting": envHosting,
}
