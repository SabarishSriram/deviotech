import { Globe, Laptop, Server } from "lucide-react"
import { SiGithub } from "react-icons/si"

import { Board, Browser, Mark, MONO_FONT } from "@/components/docs/screens/kit"
import { term, USER } from "@/components/docs/screens/fullstack"
import { ExpoWelcome, JAVA_PROPS, NextBrowser, PROJ, venvLine, type Proj } from "@/components/docs/screens/projects"
import { Phone } from "@/components/docs/screens/tools"
import { VSCode, type TermLine, type TreeNode, type VSCodeProps } from "@/components/docs/screens/vscode"
import { Avatar, FileChip, GitHubRepo, workflowScreens } from "@/components/docs/screens/workflow"
import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * "Environment & secrets" screens for every code track except Full-Stack
 * (data/docs/environment.ts). envScreensFor(track) returns the screens for
 * one track; the ids match the content.
 */

type Screen = (os: OS) => React.ReactNode

type EnvTrack = "backend" | "frontend" | "app-development" | "ai-ml" | "data-science" | "python" | "java"

type Cfg = {
  envFile: string
  hasEnv: boolean
  /** What `git check-ignore -v` prints. */
  ignoreLine: string
  example: string[]
  /** The real env file's lines, and which line to mark in env-dotenv. */
  env: (os: OS) => string[]
  envMark?: number
  diagramSecret: string[]
  diagramExample: string[]
  hosting: { url: string; title: string; nav: string[]; keys: [string, string][]; heading: string }
  status: string[]
  commit: string
}

const pgUrl = (os: OS, db: string) => (os === "mac" ? `postgresql://asha@localhost:5432/${db}` : `postgresql://postgres:devvy123@localhost:5432/${db}`)

const CFG: Record<EnvTrack, Cfg> = {
  backend: {
    envFile: ".env",
    hasEnv: true,
    ignoreLine: ".gitignore:2:.env\t.env",
    example: ["# PostgreSQL connection: postgresql://USER:PASSWORD@HOST:PORT/DATABASE", "DATABASE_URL=", "# Redis running in Docker", "REDIS_URL=redis://localhost:6379", "# Long random string used to sign login tokens", "JWT_SECRET=", "# Port the API listens on", "PORT=4000"],
    env: (os) => [`DATABASE_URL="${pgUrl(os, "devvy_api")}"`, 'REDIS_URL="redis://localhost:6379"', "PORT=4000", 'JWT_SECRET="9f2c41d87a0b5e63c1f8d24a97e0b3c6158d2fa4e07c9b61a3d5f82e4c0b9a71"'],
    envMark: 4,
    diagramSecret: ['DATABASE_URL="…:devvy123@…"', 'JWT_SECRET="9f2c…"'],
    diagramExample: ["DATABASE_URL=", "JWT_SECRET=", "PORT=4000"],
    hosting: { url: "dashboard.host.example/my-api/environment", title: "Environment · my-api", nav: ["Overview", "Deploys", "Logs", "Environment", "Settings"], heading: "Environment variables", keys: [["DATABASE_URL", "••••••••••••••••"], ["REDIS_URL", "••••••••••••••••"], ["JWT_SECRET", "••••••••••••••••"]] },
    status: [".env.example"],
    commit: "Add .env.example",
  },
  frontend: {
    envFile: ".env.local",
    hasEnv: false,
    ignoreLine: ".gitignore:34:.env*\t.env.local",
    example: ["# Shown in the browser — never put secrets in NEXT_PUBLIC_ settings", "NEXT_PUBLIC_APP_NAME=My Frontend App", "# Server-only, e.g. the movie project's API key from themoviedb.org", "TMDB_API_KEY="],
    env: () => ["# Shown in the browser — never put secrets in NEXT_PUBLIC_ settings", "NEXT_PUBLIC_APP_NAME=Asha's Frontend App", "# Server-only, e.g. the movie project's API key from themoviedb.org", "TMDB_API_KEY="],
    envMark: 2,
    diagramSecret: ["NEXT_PUBLIC_APP_NAME=…", 'TMDB_API_KEY="a8f3…"'],
    diagramExample: ["NEXT_PUBLIC_APP_NAME=", "TMDB_API_KEY="],
    hosting: { url: "dashboard.host.example/my-frontend-app/settings/environment", title: "Environment · my-frontend-app", nav: ["Overview", "Deployments", "Logs", "Environment", "Settings"], heading: "Environment variables", keys: [["NEXT_PUBLIC_APP_NAME", "My Frontend App"], ["TMDB_API_KEY", "••••••••••••••••"]] },
    status: [".env.example", "app/page.tsx"],
    commit: "Add env example and app name setting",
  },
  "app-development": {
    envFile: ".env",
    hasEnv: false,
    ignoreLine: ".gitignore:13:.env\t.env",
    example: ["# Your computer's Wi-Fi address — not localhost", "EXPO_PUBLIC_API_URL=http://192.168.1.10:4000"],
    env: () => ["# Your computer's Wi-Fi address — not localhost", "EXPO_PUBLIC_API_URL=http://192.168.1.23:4000"],
    envMark: 2,
    diagramSecret: ["EXPO_PUBLIC_API_URL=http://192.168…"],
    diagramExample: ["EXPO_PUBLIC_API_URL="],
    hosting: { url: "expo.dev/accounts/asha-rao/projects/my-mobile-app/environment-variables", title: "Environment variables · Expo", nav: ["Overview", "Builds", "Updates", "Environment variables", "Settings"], heading: "Environment variables", keys: [["EXPO_PUBLIC_API_URL", "https://api.my-mobile-app.example"]] },
    status: [".env.example", ".gitignore", "app/(tabs)/index.tsx"],
    commit: "Add env example and API address setting",
  },
  "ai-ml": {
    envFile: ".env",
    hasEnv: false,
    ignoreLine: ".gitignore:2:.env\t.env",
    example: ["# Folder with your datasets", "DATA_DIR=data", "# Only for projects that call an LLM, like the document Q&A bot", "LLM_API_KEY="],
    env: () => ["DATA_DIR=data", "LLM_API_KEY="],
    diagramSecret: ["DATA_DIR=data", 'LLM_API_KEY="sk-…"'],
    diagramExample: ["DATA_DIR=data", "LLM_API_KEY="],
    hosting: { url: "share.streamlit.io/asha-rao/my-ml-project/settings", title: "App settings · Streamlit", nav: ["General", "Sharing", "Secrets"], heading: "Secrets", keys: [["LLM_API_KEY", "••••••••••••••••"]] },
    status: [".env.example", "config.py", "requirements.txt"],
    commit: "Add env example and config",
  },
  "data-science": {
    envFile: ".env",
    hasEnv: false,
    ignoreLine: ".gitignore:2:.env\t.env",
    example: ["# Folder with your datasets", "DATA_DIR=data", "# Only if you use an LLM for summaries", "LLM_API_KEY="],
    env: () => ["DATA_DIR=data", "LLM_API_KEY="],
    diagramSecret: ["DATA_DIR=data", 'LLM_API_KEY="sk-…"'],
    diagramExample: ["DATA_DIR=data", "LLM_API_KEY="],
    hosting: { url: "share.streamlit.io/asha-rao/my-analysis/settings", title: "App settings · Streamlit", nav: ["General", "Sharing", "Secrets"], heading: "Secrets", keys: [["LLM_API_KEY", "••••••••••••••••"]] },
    status: [".env.example", "config.py", "requirements.txt"],
    commit: "Add env example and config",
  },
  python: {
    envFile: ".env",
    hasEnv: false,
    ignoreLine: ".gitignore:2:.env\t.env",
    example: ["# Where the tool keeps its data", "DATABASE_PATH=data.db", "# Only for web scraper alerts", "TELEGRAM_BOT_TOKEN=", "TELEGRAM_CHAT_ID="],
    env: () => ["DATABASE_PATH=data.db", "TELEGRAM_BOT_TOKEN=", "TELEGRAM_CHAT_ID="],
    diagramSecret: ["DATABASE_PATH=data.db", 'TELEGRAM_BOT_TOKEN="7312…"'],
    diagramExample: ["DATABASE_PATH=data.db", "TELEGRAM_BOT_TOKEN="],
    hosting: { url: "dashboard.host.example/my-python-tool/environment", title: "Environment · my-python-tool", nav: ["Overview", "Deploys", "Logs", "Environment", "Settings"], heading: "Environment variables", keys: [["DATABASE_PATH", "/data/app.db"], ["TELEGRAM_BOT_TOKEN", "••••••••••••••••"]] },
    status: [".env.example", "app/config.py", "requirements.txt"],
    commit: "Add env example and config",
  },
  java: {
    envFile: ".env",
    hasEnv: true,
    ignoreLine: ".gitignore:34:.env\t.env",
    example: ["# JDBC address of your PostgreSQL database", "DATABASE_URL=jdbc:postgresql://localhost:5432/devvy_java", "# Your PostgreSQL username and password", "DATABASE_USER=postgres", "DATABASE_PASSWORD="],
    env: (os) => ["DATABASE_URL=jdbc:postgresql://localhost:5432/devvy_java", `DATABASE_USER=${os === "mac" ? "asha" : "postgres"}`, `DATABASE_PASSWORD=${os === "mac" ? "" : "devvy123"}`],
    diagramSecret: ["DATABASE_USER=postgres", "DATABASE_PASSWORD=devvy123"],
    diagramExample: ["DATABASE_URL=jdbc:…", "DATABASE_PASSWORD="],
    hosting: { url: "dashboard.host.example/my-java-api/environment", title: "Environment · my-java-api", nav: ["Overview", "Deploys", "Logs", "Environment", "Settings"], heading: "Environment variables", keys: [["DATABASE_URL", "••••••••••••••••"], ["DATABASE_USER", "••••••••"], ["DATABASE_PASSWORD", "••••••••••••••••"]] },
    status: [".env.example"],
    commit: "Add .env.example",
  },
}

/* ------------------------------------------------------------------ */

function Hosting({ os, h }: { os: OS; h: Cfg["hosting"] }) {
  return (
    <Browser os={os} url={h.url} tab={h.title}>
      <div className="flex min-h-[250px] text-[#1f2328]">
        <div className="w-44 shrink-0 space-y-1 border-r border-[#e5e7eb] bg-[#fafafa] p-3 text-[12px]">
          {h.nav.map((s) => (
            <p key={s} className={cn("rounded-md px-2 py-1", s === h.heading && "bg-[#eef0f3] font-semibold")}>
              {s}
            </p>
          ))}
        </div>
        <div className="flex-1 p-5">
          <p className="text-[16px] font-semibold">{h.heading}</p>
          <p className="mt-1 text-[12px] text-[#59636e]">Your app reads these instead of a .env file. Values are hidden after saving.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Mark n={1} badge="tl">
              <div className="space-y-1.5 p-1">
                <p className="text-[11px] font-semibold text-[#59636e]">Name</p>
                {h.keys.map(([k]) => (
                  <p key={k} className="truncate rounded border border-[#d0d7de] px-2 py-1 text-[11px]" style={{ fontFamily: MONO_FONT }}>
                    {k}
                  </p>
                ))}
              </div>
            </Mark>
            <Mark n={2} badge="tr">
              <div className="space-y-1.5 p-1">
                <p className="text-[11px] font-semibold text-[#59636e]">Value</p>
                {h.keys.map(([k, v]) => (
                  <p key={k} className="truncate rounded border border-[#d0d7de] px-2 py-1 text-[11px]" style={{ fontFamily: MONO_FONT }}>
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
}

function sortNodes(nodes: TreeNode[]) {
  return [...nodes.filter((n) => n.dir), ...nodes.filter((n) => !n.dir).sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))]
}

/** The project's top level, plus README from How we work, plus extra/changed nodes. */
function rootWith(p: Proj, extra: TreeNode[] = []): TreeNode[] {
  const names = new Set(extra.map((n) => n.name))
  const base = p.root.some((n) => n.name === "README.md") ? p.root : [...p.root, { name: "README.md" }]
  return sortNodes([...base.filter((n) => !names.has(n.name)), ...extra])
}

export function envScreensFor(track: EnvTrack): Record<string, Screen> {
  const c = CFG[track]
  const p = PROJ[track]
  const cwd = `devvy/${p.repo}`
  const py = p.python
  const cmd = (s: string): TermLine => (py ? venvLine(s) : { cmd: s })
  const envNode = (extra: Partial<TreeNode> = {}): TreeNode => ({ name: c.envFile, ignored: true, ...extra })
  const branch = "feat/env-setup"
  const file = (os: OS, name: string, path: string, lines: string[], tree: TreeNode[], extra: Partial<VSCodeProps> = {}) => (
    <VSCode os={os} folder={p.repo} tree={tree} editor={{ tabs: [name], active: name, file: path, lines }} branch={branch} {...extra} />
  )

  const screens: Record<string, Screen> = {
    "env-diagram": () => (
      <Board>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-3 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              <Laptop className="size-4" /> Your computer
            </p>
            <Mark n={1} badge="tr">
              <FileChip name={c.envFile} tone="secret" lines={c.diagramSecret} />
            </Mark>
            <Mark n={2} badge="tr">
              <FileChip name=".gitignore" lines={[`${c.envFile === ".env.local" ? ".env*" : ".env"}  ← skip it`]} />
            </Mark>
          </div>
          <div className="flex w-24 flex-col items-center gap-1 text-center text-[11px] text-[#59636e]">
            <span style={{ fontFamily: MONO_FONT }}>git push</span>
            <span className="text-[22px]">→</span>
            <span>{c.envFile} stays behind</span>
          </div>
          <div className="flex-1 space-y-3 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              <SiGithub className="size-4" /> GitHub — anyone can read
            </p>
            <Mark n={3} badge="tr">
              <FileChip name=".env.example" tone="safe" lines={c.diagramExample} />
            </Mark>
            <FileChip name={c.envFile} crossed />
          </div>
        </div>
      </Board>
    ),
    "env-history": workflowScreens["env-history"],
    "env-leak": workflowScreens["env-leak"],
    "env-check-ignore": (os) =>
      term(os, cwd, [cmd(`git check-ignore -v ${c.envFile}`), { out: c.ignoreLine, tone: "ok", mark: 1 }, cmd("")], {
        tree: rootWith(p, c.hasEnv ? [envNode({ mark: 2 })] : []),
      }),
    "env-check-empty": (os) => term(os, cwd, [cmd(`git check-ignore -v ${c.envFile}`), { ...cmd(""), mark: 1 }], { tree: rootWith(p) }),
    "env-check-fixed": (os) => {
      const lines = ["# dependencies", "node_modules/", "", "# Expo", ".expo/", "dist/", "web-build/", "expo-env.d.ts", "", "# local env files", ".env*.local", "", ".env"]
      return (
        <VSCode
          os={os}
          folder={p.repo}
          tree={rootWith(p, [{ name: ".gitignore", active: true, status: "M" }])}
          editor={{ tabs: [".gitignore"], active: ".gitignore", file: ".gitignore", lines, mark: { from: 13, to: 13, n: 1 } }}
          terminal={{ cwd, lines: [cmd(`git check-ignore -v ${c.envFile}`), { out: c.ignoreLine, tone: "ok", mark: 2 }] }}
          panel={0.3}
          height={480}
        />
      )
    },
    "env-github": (os) => (
      <GitHubRepo os={os} path="" tab="Code" repo={p.repo}>
        <div className="px-6 py-4">
          <Mark n={1} badge="r">
            <div className="overflow-hidden rounded-md border border-[#d1d9e0]">
              <p className="flex items-center gap-2 bg-[#f6f8fa] px-4 py-2 text-[12px]">
                <Avatar who="asha" /> <b>{USER}</b> Add README with how to run the project
              </p>
              {rootWith(p)
                .filter((n) => !n.ignored)
                .map((n) => (
                  <p key={n.name} className="flex items-center gap-2 border-t border-[#d1d9e0] px-4 py-1.5 text-[12.5px]">
                    <span className={n.dir ? "text-[#54aeff]" : "text-[#59636e]"}>{n.dir ? "📁" : "📄"}</span> {n.name}
                  </p>
                ))}
            </div>
          </Mark>
          <p className="mt-3 text-[12px] text-[#1a7f37]">No {c.envFile} here — exactly right.</p>
        </div>
      </GitHubRepo>
    ),
    "env-branch": (os) =>
      term(
        os,
        cwd,
        [cmd("git checkout main"), { out: "Already on 'main'" }, cmd("git pull"), { out: "Already up to date." }, cmd(`git checkout -b ${branch}`), { out: `Switched to a new branch '${branch}'`, tone: "ok" }, cmd("")],
        { tree: rootWith(p), branch, branchMark: 1 }
      ),
    "env-example-file": (os) =>
      file(os, ".env.example", ".env.example", c.example, rootWith(p, [{ name: ".env.example", status: "U", active: true, mark: 1 }, ...(c.hasEnv || py ? [envNode()] : [])])),
    "env-dotenv": (os) =>
      file(os, c.envFile, c.envFile, c.env(os), rootWith(p, [{ name: ".env.example", status: "U" }, envNode({ active: true })]), {
        editor: { tabs: [".env.example", c.envFile], active: c.envFile, file: c.envFile, lines: c.env(os), mark: c.envMark ? { from: c.envMark, to: c.envMark, n: 1 } : undefined },
      }),
    "env-git-status": (os) =>
      term(
        os,
        cwd,
        [
          cmd("git add ."),
          cmd("git status"),
          { out: `On branch ${branch}` },
          { out: "Changes to be committed:" },
          ...c.status.map((s, i): TermLine => ({ out: `        ${s === ".env.example" || s === "config.py" || s === "app/config.py" ? "new file" : "modified"}:   ${s}`, tone: "ok", mark: i === 0 ? 1 : undefined })),
          cmd(""),
        ],
        { tree: rootWith(p), branch, panel: 0.62 }
      ),
    "env-pr": (os) =>
      term(
        os,
        cwd,
        [
          cmd(`git commit -m "${c.commit}"`),
          { out: `[${branch} 2d6b8f1] ${c.commit}` },
          cmd(`git push -u origin ${branch}`),
          { out: ` * [new branch]      ${branch} -> ${branch}` },
          cmd("gh pr create --fill"),
          { out: `Creating pull request for ${branch} into main in ${USER}/${p.repo}` },
          { out: `https://github.com/${USER}/${p.repo}/pull/2`, tone: "accent", mark: 1 },
        ],
        { tree: rootWith(p), branch, panel: 0.7 }
      ),
    "env-push-blocked": (os) =>
      term(
        os,
        cwd,
        [
          cmd("git push -u origin feat/payments"),
          { out: "remote: error: GH013: Repository rule violations found for refs/heads/feat/payments.", tone: "err" },
          { out: "remote: - GITHUB PUSH PROTECTION" },
          { out: "remote:     Resolve the following violations before pushing again" },
          { out: "remote:     - Push cannot contain secrets", tone: "err", mark: 1 },
          { out: "remote:       —— Stripe API Key ————————————" },
          { out: "remote:     To push, remove secret from commit(s) or follow this URL to allow the secret." },
          { out: " ! [remote rejected] feat/payments -> feat/payments (push declined due to repository rule violations)", tone: "err" },
          { out: "error: failed to push some refs", tone: "err" },
        ],
        { tree: rootWith(p), branch: "feat/payments", panel: 0.8, height: 470 }
      ),
    "env-hosting": (os) => <Hosting os={os} h={c.hosting} />,
  }

  /* ---------------- stack-specific ---------------- */

  if (track === "backend") {
    screens["env-jwt"] = (os) =>
      term(os, cwd, [{ cmd: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"" }, { out: "9f2c41d87a0b5e63c1f8d24a97e0b3c6158d2fa4e07c9b61a3d5f82e4c0b9a71", tone: "bold", mark: 1 }, { cmd: "" }], {
        tree: rootWith(p, [{ name: ".env.example", status: "U" }]),
        branch,
      })
    screens["env-restart"] = (os) => (
      <VSCode
        os={os}
        folder={p.repo}
        tree={rootWith(p, [{ name: ".env.example", status: "U" }])}
        branch={branch}
        terminal={{
          cwd,
          list: ["node", os === "windows" ? "powershell" : os === "mac" ? "zsh" : "bash"],
          lines: [{ out: "API running on http://localhost:4000" }, { out: "^C", tone: "bold", mark: 1 }, { cmd: "npm run dev" }, { out: "> my-api@1.0.0 dev" }, { out: "> tsx watch src/index.ts" }, { out: "" }, { out: "API running on http://localhost:4000", tone: "ok", mark: 2 }],
        }}
        panel={0.62}
      />
    )
  }

  if (track === "frontend") {
    screens["env-next-kinds"] = () => (
      <Board>
        <div className="grid grid-cols-2 gap-5">
          <Mark n={1} badge="tr">
            <div className="h-full rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold">
                <Globe className="size-4 text-[#0969da]" /> NEXT_PUBLIC_…
              </p>
              <p className="mt-1 text-[12px] text-[#59636e]">Copied into the website. Anyone can read it.</p>
              <p className="mt-3 rounded bg-[#dafbe1] px-2 py-1 text-[11.5px]" style={{ fontFamily: MONO_FONT }}>
                NEXT_PUBLIC_APP_NAME=My Frontend App
              </p>
              <p className="mt-1.5 rounded bg-[#dafbe1] px-2 py-1 text-[11.5px]" style={{ fontFamily: MONO_FONT }}>
                NEXT_PUBLIC_API_URL=https://api.example.com
              </p>
            </div>
          </Mark>
          <Mark n={2} badge="tr">
            <div className="h-full rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold">
                <Server className="size-4 text-[#8250df]" /> Everything else
              </p>
              <p className="mt-1 text-[12px] text-[#59636e]">Server-only. Never sent to the browser.</p>
              <p className="mt-3 rounded bg-[#fbefff] px-2 py-1 text-[11.5px]" style={{ fontFamily: MONO_FONT }}>
                TMDB_API_KEY=a8f3…
              </p>
              <p className="mt-1.5 rounded bg-[#fbefff] px-2 py-1 text-[11.5px]" style={{ fontFamily: MONO_FONT }}>
                DATABASE_URL=postgres://…
              </p>
            </div>
          </Mark>
        </div>
      </Board>
    )
    screens["env-next-page"] = (os) =>
      file(
        os,
        "page.tsx",
        "app/page.tsx",
        [
          'import { Button } from "@/components/ui/button"',
          "",
          "export default function Home() {",
          "  return (",
          '    <main className="flex min-h-screen flex-col items-center justify-center gap-4">',
          '      <h1 className="text-4xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</h1>',
          '      <p className="text-zinc-500">Built with Next.js and Tailwind CSS.</p>',
          "      <Button>Get started</Button>",
          "    </main>",
          "  )",
          "}",
        ],
        rootWith(p, [{ name: ".env.example", status: "U" }, envNode()]),
        {
          sidebar: null,
          editor: {
            tabs: [".env.local", "page.tsx"],
            active: "page.tsx",
            file: "app/page.tsx",
            lines: [
              'import { Button } from "@/components/ui/button"',
              "",
              "export default function Home() {",
              "  return (",
              '    <main className="flex min-h-screen flex-col items-center justify-center gap-4">',
              '      <h1 className="text-4xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</h1>',
              '      <p className="text-zinc-500">Built with Next.js and Tailwind CSS.</p>',
              "      <Button>Get started</Button>",
              "    </main>",
              "  )",
              "}",
            ],
            mark: { from: 6, to: 6, n: 1 },
          },
        }
      )
    screens["env-next-browser"] = (os) => (
      <NextBrowser os={os}>
        <Mark n={1} className="inline-block">
          <p className="px-2 text-[36px] font-bold">Asha&apos;s Frontend App</p>
        </Mark>
        <p className="text-[#71717a]">Built with Next.js and Tailwind CSS.</p>
        <span className="rounded-md bg-[#171717] px-4 py-2 text-[13px] font-medium text-white">Get started</span>
      </NextBrowser>
    )
  }

  if (track === "app-development") {
    screens["env-ip"] = (os) =>
      term(
        os,
        cwd,
        os === "mac"
          ? [{ cmd: "ipconfig getifaddr en0" }, { out: "192.168.1.23", tone: "bold", mark: 1 }, { cmd: "" }]
          : os === "windows"
            ? [
                { cmd: "ipconfig" },
                { out: "Windows IP Configuration" },
                { out: "" },
                { out: "Wireless LAN adapter Wi-Fi:" },
                { out: "   Connection-specific DNS Suffix  . : home" },
                { out: "   IPv4 Address. . . . . . . . . . . : 192.168.1.23", tone: "bold", mark: 1 },
                { out: "   Subnet Mask . . . . . . . . . . . : 255.255.255.0" },
                { out: "   Default Gateway . . . . . . . . . : 192.168.1.1" },
              ]
            : [{ cmd: "hostname -I" }, { out: "192.168.1.23 172.17.0.1", tone: "bold", mark: 1 }, { cmd: "" }],
        { tree: rootWith(p, [{ name: ".gitignore", status: "M" }]), branch, panel: 0.66 }
      )
    screens["env-expo-code"] = (os) => {
      const lines = [
        "export default function HomeScreen() {",
        "  return (",
        "    <ParallaxScrollView",
        "      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>",
        "      <ThemedView style={styles.titleContainer}>",
        '        <ThemedText type="title">Hello, Devvy!</ThemedText>',
        "        <ThemedText>API: {process.env.EXPO_PUBLIC_API_URL}</ThemedText>",
        "        <HelloWave />",
        "      </ThemedView>",
      ]
      return (
        <VSCode
          os={os}
          folder={p.repo}
          tree={[{ name: "app", dir: true, open: true }, { name: "(tabs)", dir: true, depth: 1, open: true }, { name: "index.tsx", depth: 2, active: true, status: "M" }, { name: "assets", dir: true }, { name: ".env", ignored: true }, { name: ".env.example", status: "U" }]}
          editor={{ tabs: ["index.tsx"], active: "index.tsx", file: "app/(tabs)/index.tsx", lines, mark: { from: 7, to: 7, n: 1 } }}
          branch={branch}
          sidebar={null}
        />
      )
    }
    screens["env-expo-phone"] = () => (
      <div className="flex justify-center">
        <Phone kind="android">
          <div className="relative h-full">
            <ExpoWelcome title="Hello, Devvy!" api="http://192.168.1.23:4000" />
            <div className="absolute top-[192px] left-3">
              <Mark n={1}>
                <span className="block h-5 w-44" />
              </Mark>
            </div>
          </div>
        </Phone>
      </div>
    )
  }

  if (py) {
    const configPath = track === "python" ? "app/config.py" : "config.py"
    const configLines =
      track === "python"
        ? ["import os", "", "from dotenv import load_dotenv", "", "load_dotenv()", "", 'DATABASE_PATH = os.getenv("DATABASE_PATH", "data.db")', 'TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")', 'TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")']
        : ["import os", "", "from dotenv import load_dotenv", "", "load_dotenv()", "", 'DATA_DIR = os.getenv("DATA_DIR", "data")', 'LLM_API_KEY = os.getenv("LLM_API_KEY")']
    const withConfig: TreeNode[] =
      track === "python"
        ? [{ name: "app", dir: true, open: true }, { name: "__init__.py", depth: 1 }, { name: "config.py", depth: 1, status: "U", active: true }, { name: "main.py", depth: 1 }, { name: "tests", dir: true }, { name: ".env", ignored: true }, { name: ".env.example", status: "U" }, { name: ".gitignore" }, { name: "README.md" }, { name: "requirements.txt", status: "M" }]
        : rootWith(p, [{ name: "config.py", status: "U", active: true }, { name: ".env.example", status: "U" }, envNode(), { name: "requirements.txt", status: "M" }])
    screens["env-py-install"] = (os) =>
      term(
        os,
        cwd,
        [
          venvLine("pip install python-dotenv"),
          { out: "Collecting python-dotenv" },
          { out: "  Downloading python_dotenv-1.1.1-py3-none-any.whl (20 kB)" },
          { out: "Successfully installed python-dotenv-1.1.1", tone: "ok", mark: 1 },
          venvLine(os === "windows" ? "pip freeze | Out-File -Encoding utf8 requirements.txt" : "pip freeze > requirements.txt"),
          venvLine(""),
        ],
        { tree: rootWith(p, [{ name: "requirements.txt", status: "M" }]), branch }
      )
    screens["env-py-config"] = (os) => file(os, "config.py", configPath, configLines, withConfig)
    screens["env-py-check"] = (os) =>
      term(
        os,
        cwd,
        [
          venvLine(track === "python" ? 'python -c "from app.config import DATABASE_PATH; print(DATABASE_PATH)"' : 'python -c "import config; print(config.DATA_DIR)"'),
          { out: track === "python" ? "data.db" : "data", tone: "bold", mark: 1 },
          venvLine(""),
        ],
        { tree: withConfig.map((n) => ({ ...n, active: false })), branch }
      )
  }

  if (track === "java") {
    screens["env-java-properties"] = (os) =>
      file(
        os,
        "application.properties",
        "src/main/resources/application.properties",
        JAVA_PROPS,
        [
          { name: ".mvn", dir: true },
          { name: "src", dir: true, open: true },
          { name: "main", dir: true, depth: 1, open: true },
          { name: "resources", dir: true, depth: 2, open: true },
          { name: "application.properties", depth: 3, active: true },
          { name: "target", dir: true, ignored: true },
          { name: ".env", ignored: true },
          { name: ".gitignore" },
          { name: "pom.xml" },
          { name: "README.md" },
        ],
        {
          editor: {
            tabs: ["application.properties"],
            active: "application.properties",
            file: "src/main/resources/application.properties",
            lines: JAVA_PROPS,
            mark: [
              { from: 2, to: 2, n: 1 },
              { from: 3, to: 5, n: 2 },
            ],
          },
        }
      )
  }

  return screens
}
