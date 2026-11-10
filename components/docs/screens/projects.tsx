import { ArrowRight, Camera, FileArchive, QrCode } from "lucide-react"
import { SiExpo, SiGithub, SiJupyter, SiNextdotjs, SiReact, SiSpring } from "react-icons/si"

import { Browser, Checkbox, Finder, MacFolder, Mark, MONO_FONT, Radio, TextField, WinButton, WinWindow } from "@/components/docs/screens/kit"
import { fileMenu, pickFolder, term, USER } from "@/components/docs/screens/fullstack"
import { Phone } from "@/components/docs/screens/tools"
import { VSCode, type TermLine, type TreeNode, type VSCodeProps } from "@/components/docs/screens/vscode"
import type { OS } from "@/data/docs/types"

/*
 * Screens for each code track's "Create your project" and "Starting work
 * next time" parts (data/docs/setup/projects.ts). Ids are `${key}-…`.
 */

type Screen = (os: OS) => React.ReactNode

/* ------------------------------------------------------------------ */
/* The projects                                                        */
/* ------------------------------------------------------------------ */

export type Proj = {
  key: string
  repo: string
  /** Top-level files and folders once Setup is finished, as VS Code's Explorer lists them. */
  root: TreeNode[]
  python?: boolean
}

const f = (name: string, extra: Partial<TreeNode> = {}): TreeNode => ({ name, ...extra })
const d = (name: string, extra: Partial<TreeNode> = {}): TreeNode => ({ name, dir: true, ...extra })
const ignored = { ignored: true }

export const PROJ: Record<string, Proj> = {
  backend: {
    key: "be",
    repo: "my-api",
    root: [
      d("node_modules", ignored),
      d("prisma"),
      d("src"),
      f(".env", ignored),
      f(".gitignore"),
      f("package-lock.json"),
      f("package.json"),
      f("tsconfig.json"),
    ],
  },
  frontend: {
    key: "fe",
    repo: "my-frontend-app",
    root: [
      d("app"),
      d("components"),
      d("lib"),
      d("node_modules", ignored),
      d("public"),
      f(".gitignore"),
      f("components.json"),
      f("next.config.ts"),
      f("package.json"),
      f("README.md"),
      f("tsconfig.json"),
    ],
  },
  "app-development": {
    key: "app",
    repo: "my-mobile-app",
    root: [
      d("app"),
      d("assets"),
      d("components"),
      d("constants"),
      d("hooks"),
      d("node_modules", ignored),
      f(".gitignore"),
      f("app.json"),
      f("package.json"),
      f("README.md"),
      f("tsconfig.json"),
    ],
  },
  "ai-ml": {
    key: "ml",
    repo: "my-ml-project",
    python: true,
    root: [d(".venv", ignored), d("app"), d("data"), d("notebooks"), f(".gitignore"), f("requirements.txt")],
  },
  "data-science": {
    key: "ds",
    repo: "my-analysis",
    python: true,
    root: [d(".venv", ignored), d("dashboard"), d("data"), d("notebooks"), f(".gitignore"), f("requirements.txt")],
  },
  python: {
    key: "py",
    repo: "my-python-tool",
    python: true,
    root: [d(".venv", ignored), d("app"), d("tests"), f(".gitignore"), f("requirements.txt")],
  },
  java: {
    key: "java",
    repo: "my-java-api",
    root: [d(".mvn"), d("src"), d("target", ignored), f(".env", ignored), f(".gitignore"), f("HELP.md"), f("mvnw"), f("mvnw.cmd"), f("pom.xml")],
  },
}

const path = (p: Proj, sub = "") => `devvy/${p.repo}${sub ? "/" + sub : ""}`
const venv = (cmd: string, cwd?: string): TermLine => ({ cmd, prefix: "(.venv)", cwd })
const mark = (nodes: TreeNode[], name: string, extra: Partial<TreeNode>) => nodes.map((n) => (n.name === name ? { ...n, ...extra } : n))

/** A file open in VS Code's editor inside a project. */
function editor(os: OS, p: Proj, file: string, lines: string[], tree: TreeNode[], extra: Partial<VSCodeProps> = {}) {
  const name = file.split("/").pop()!
  return <VSCode os={os} folder={p.repo} tree={tree} editor={{ tabs: [name], active: name, file, lines }} {...extra} />
}

function pwdOut(os: OS, cwd: string): TermLine[] {
  if (os === "windows")
    return [{ out: "" }, { out: "Path" }, { out: "----" }, { out: `C:\\Users\\Asha\\${cwd.split("/").join("\\")}`, mark: 1 }, { out: "" }]
  return [{ out: os === "mac" ? `/Users/asha/${cwd}` : `/home/asha/${cwd}`, mark: 1 }]
}

const homePath = (os: OS, sub: string) =>
  os === "windows" ? `C:\\Users\\Asha\\${sub.split("/").join("\\")}` : os === "mac" ? `/Users/asha/${sub}` : `/home/asha/${sub}`

/* ------------------------------------------------------------------ */
/* Screens every project shares                                        */
/* ------------------------------------------------------------------ */

function shared(p: Proj, opts: { status: TermLine[]; github: { entries: string[]; message: string }; gitTree?: TreeNode[] }): Record<string, Screen> {
  const k = p.key
  return {
    [`${k}-repo-create`]: (os) =>
      term(
        os,
        "devvy",
        [
          { cmd: `gh repo create ${p.repo} --public --clone` },
          { out: `✓ Created repository ${USER}/${p.repo} on GitHub`, tone: "ok", mark: 1 },
          { out: `  https://github.com/${USER}/${p.repo}` },
          { out: `Cloning into '${p.repo}'...` },
          { out: "warning: You appear to have cloned an empty repository.", tone: "warn" },
          { cmd: "" },
        ],
        { tree: [d(p.repo)] }
      ),
    [`${k}-pick-project`]: (os) => pickFolder(os === "mac" ? "linux" : os, "devvy", p.repo, [p.repo]),
    [`${k}-project-terminal`]: (os) => term(os, path(p), [{ cmd: "pwd" }, ...pwdOut(os, path(p)), { cmd: "" }], { tree: [] }),
    [`${k}-git-status`]: (os) => term(os, path(p), opts.status, { tree: opts.gitTree ?? p.root, panel: 0.8, height: 470 }),
    [`${k}-git-push`]: (os) =>
      term(
        os,
        path(p),
        [
          { cmd: "git push -u origin main" },
          { out: "Enumerating objects: 21, done." },
          { out: "Writing objects: 100% (21/21), 18.07 KiB | 2.58 MiB/s, done." },
          { out: `To https://github.com/${USER}/${p.repo}.git` },
          { out: " * [new branch]      main -> main" },
          { out: "branch 'main' set up to track 'origin/main'.", tone: "ok", mark: 1 },
          { cmd: "" },
        ],
        { tree: p.root, panel: 0.66 }
      ),
    [`${k}-gh-create`]: (os) =>
      term(
        os,
        path(p),
        [
          { cmd: `gh repo create ${p.repo} --public --source=. --push` },
          { out: `✓ Created repository ${USER}/${p.repo} on GitHub`, tone: "ok" },
          { out: `  https://github.com/${USER}/${p.repo}` },
          { out: `✓ Added remote https://github.com/${USER}/${p.repo}.git`, tone: "ok" },
          { out: `✓ Pushed commits to https://github.com/${USER}/${p.repo}.git`, tone: "ok", mark: 1 },
          { cmd: "" },
        ],
        { tree: p.root, panel: 0.62 }
      ),
    [`${k}-github-repo`]: (os) => (
      <Browser os={os} url={`github.com/${USER}/${p.repo}`} tab={`${USER}/${p.repo}`} tabIcon={<SiGithub className="size-3.5" />}>
        <div className="bg-white px-8 py-6 text-[#1f2328]">
          <p className="flex items-center gap-2 text-[18px]">
            <SiGithub className="size-5" />
            <span className="text-[#0969da]">{USER}</span> / <span className="font-semibold text-[#0969da]">{p.repo}</span>
            <span className="rounded-full border border-[#d0d7de] px-2 text-[11px] text-[#59636e]">Public</span>
          </p>
          <div className="mt-5 overflow-hidden rounded-md border border-[#d0d7de]">
            <Mark n={2} className="rounded-none">
              <div className="flex items-center gap-2 bg-[#f6f8fa] px-4 py-2.5 text-[12.5px]">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1f6feb] text-[10px] font-bold text-white">A</span>
                <span className="font-semibold">{USER}</span>
                <span>{opts.github.message}</span>
                <span className="ml-auto text-[#59636e]">1 minute ago</span>
              </div>
            </Mark>
            <Mark n={1} className="rounded-none">
              <div>
                {opts.github.entries.map((e) => (
                  <p key={e} className="flex items-center gap-2 border-t border-[#d0d7de] px-4 py-1.5 text-[12.5px]">
                    <span className={e.endsWith("/") ? "text-[#54aeff]" : "text-[#59636e]"}>{e.endsWith("/") ? "📁" : "📄"}</span>{" "}
                    {e.replace(/\/$/, "")}
                    <span className="ml-auto text-[#59636e]">{opts.github.message}</span>
                  </p>
                ))}
              </div>
            </Mark>
          </div>
        </div>
      </Browser>
    ),
    [`${k}-open-recent`]: (os) => (
      <VSCode
        os={os}
        sidebar="explorer"
        menu={{
          name: "File",
          items: fileMenu(os).map((i) => (i !== "sep" && i.label === "Open Recent" ? { ...i, mark: 1 } : i)),
          submenu: {
            at: 6,
            items: [
              { label: "Reopen Closed Editor" },
              "sep",
              { label: `~/devvy/${p.repo}`, mark: 2 },
              { label: "~/devvy" },
              "sep",
              { label: "More…" },
            ],
          },
        }}
      />
    ),
  }
}

/** git add . / git status / git commit, listing `files` as new. */
function statusLines(files: string[], message: string, branchNote = "No commits yet", modified: string[] = []): TermLine[] {
  return [
    { cmd: "git add ." },
    { cmd: "git status" },
    { out: "On branch main" },
    ...(branchNote ? [{ out: branchNote }] : []),
    { out: "Changes to be committed:" },
    ...modified.map((m, i): TermLine => ({ out: `        modified:   ${m}`, tone: "ok", mark: i === 0 ? 1 : undefined })),
    ...files.map((file, i): TermLine => ({ out: `        new file:   ${file}`, tone: "ok", mark: i === 0 && modified.length === 0 ? 1 : undefined })),
    { cmd: `git commit -m "${message}"` },
    { out: `[main ${branchNote ? "(root-commit) " : ""}3f9a7c2] ${message}` },
    { out: ` ${files.length + modified.length} files changed` },
  ]
}

/* ------------------------------------------------------------------ */
/* Backend                                                             */
/* ------------------------------------------------------------------ */

const BE = PROJ.backend
const beTree = (stage: "deps" | "src" | "prisma" | "done", active?: string): TreeNode[] => {
  const t: TreeNode[] = [d("node_modules", stage === "done" ? ignored : {})]
  if (stage === "prisma" || stage === "done") t.push(d("prisma", { open: true }), f("schema.prisma", { depth: 1 }))
  if (stage !== "deps") t.push(d("src", { open: true }), f("app.ts", { depth: 1 }), f("index.ts", { depth: 1 }))
  if (stage === "prisma" || stage === "done") t.push(f(".env", stage === "done" ? ignored : {}))
  if (stage === "done") t.push(f(".gitignore"))
  t.push(f("package-lock.json"), f("package.json"))
  if (stage !== "deps") t.push(f("tsconfig.json"))
  return active ? mark(t, active, { active: true }) : t
}
const beFile = (os: OS, file: string, lines: string[], stage: Parameters<typeof beTree>[0], extra: Partial<VSCodeProps> = {}) =>
  editor(os, BE, file, lines, beTree(stage, file.split("/").pop()), extra)

const backendScreens: Record<string, Screen> = {
  ...shared(BE, {
    status: statusLines(
      [
        ".gitignore",
        "package-lock.json",
        "package.json",
        "prisma/migrations/…/migration.sql",
        "prisma/schema.prisma",
        "src/app.ts",
        "src/index.ts",
        "tsconfig.json",
      ],
      "Initial project setup"
    ),
    github: { entries: ["prisma/", "src/", ".gitignore", "package-lock.json", "package.json", "tsconfig.json"], message: "Initial project setup" },
    gitTree: beTree("done"),
  }),
  "be-install": (os) =>
    term(
      os,
      path(BE),
      [
        { cmd: "npm init -y" },
        { out: "Wrote to package.json" },
        { cmd: "npm install express dotenv zod ioredis jsonwebtoken" },
        { out: "added 86 packages, and audited 87 packages in 5s", mark: 1 },
        { cmd: "npm install -D typescript tsx @types/node @types/express @types/jsonwebtoken" },
        { out: "added 20 packages, and audited 107 packages in 4s" },
        { cmd: "npm install @prisma/client@6" },
        { out: "added 2 packages, and audited 109 packages in 3s" },
        { cmd: "npm install -D prisma@6" },
        { out: "added 6 packages, and audited 115 packages in 5s" },
        { out: "found 0 vulnerabilities" },
      ],
      { tree: beTree("deps"), panel: 0.78 }
    ),
  "be-package-json": (os) => {
    const lines = [
      "{",
      '  "name": "my-api",',
      '  "version": "1.0.0",',
      '  "main": "index.js",',
      '  "type": "module",',
      '  "scripts": {',
      '    "dev": "tsx watch src/index.ts",',
      '    "build": "tsc",',
      '    "start": "node dist/index.js"',
      "  },",
      '  "dependencies": {',
      '    "@prisma/client": "^6.19.0",',
    ]
    return beFile(os, "package.json", lines, "deps", {
      editor: { tabs: ["package.json"], active: "package.json", file: "package.json", lines, mark: { from: 5, to: 10, n: 1 } },
    })
  },
  "be-tsconfig": (os) =>
    beFile(
      os,
      "tsconfig.json",
      [
        "{",
        '  "compilerOptions": {',
        '    "target": "ES2022",',
        '    "module": "NodeNext",',
        '    "moduleResolution": "NodeNext",',
        '    "rootDir": "src",',
        '    "outDir": "dist",',
        '    "strict": true,',
        '    "esModuleInterop": true,',
        '    "skipLibCheck": true',
        "  },",
        '  "include": ["src"]',
        "}",
      ],
      "deps",
      { tree: [...beTree("deps"), f("tsconfig.json", { active: true, status: "U" })] }
    ),
  "be-editor-app": (os) =>
    beFile(
      os,
      "src/app.ts",
      [
        'import express from "express"',
        "",
        "export const app = express()",
        "",
        "app.use(express.json())",
        "",
        "// A tiny route to check the server is alive",
        'app.get("/health", (req, res) => {',
        "  res.json({ ok: true })",
        "})",
      ],
      "src"
    ),
  "be-editor-index": (os) =>
    beFile(
      os,
      "src/index.ts",
      [
        'import "dotenv/config"',
        'import { app } from "./app.js"',
        "",
        "const port = Number(process.env.PORT) || 4000",
        "",
        "app.listen(port, () => {",
        '  console.log("API running on http://localhost:" + port)',
        "})",
      ],
      "src"
    ),
  "be-editor-schema": (os) =>
    beFile(
      os,
      "prisma/schema.prisma",
      [
        "generator client {",
        '  provider = "prisma-client-js"',
        "}",
        "",
        "datasource db {",
        '  provider = "postgresql"',
        '  url      = env("DATABASE_URL")',
        "}",
      ],
      "prisma",
      {
        terminal: {
          cwd: path(BE),
          lines: [
            { cmd: "npx prisma init" },
            { out: "✔ Your Prisma schema was created at prisma/schema.prisma", tone: "ok" },
            { out: "  You can now open it in your favorite editor." },
          ],
        },
        panel: 0.36,
        height: 450,
      }
    ),
  "be-editor-env": (os) => {
    const url = os === "mac" ? "postgresql://asha@localhost:5432/devvy_api" : "postgresql://postgres:devvy123@localhost:5432/devvy_api"
    return beFile(os, ".env", [`DATABASE_URL="${url}"`, 'REDIS_URL="redis://localhost:6379"', "PORT=4000"], "prisma", {
      terminal: os === "mac" ? { cwd: path(BE), lines: [{ cmd: "whoami" }, { out: "asha", tone: "bold" }, { cmd: "" }] } : undefined,
      panel: 0.32,
      height: os === "mac" ? 440 : 380,
    })
  },
  "be-prisma-migrate": (os) =>
    term(
      os,
      path(BE),
      [
        { cmd: "npx prisma migrate dev --name init" },
        { out: "Environment variables loaded from .env" },
        { out: "Prisma schema loaded from prisma/schema.prisma" },
        { out: 'Datasource "db": PostgreSQL database "devvy_api", schema "public" at "localhost:5432"' },
        { out: "" },
        { out: "PostgreSQL database devvy_api created at localhost:5432", tone: "ok", mark: 1 },
        { out: "" },
        { out: "Already in sync, no schema change or pending migration was found." },
      ],
      { tree: beTree("prisma"), panel: 0.72 }
    ),
  "be-redis": (os) =>
    term(
      os,
      path(BE),
      [
        { cmd: "docker run -d --name redis -p 6379:6379 redis" },
        { out: "Unable to find image 'redis:latest' locally" },
        { out: "latest: Pulling from library/redis" },
        { out: "Status: Downloaded newer image for redis:latest" },
        { out: "8c1f0e2a9b7d4c3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e" },
        { cmd: "docker ps" },
        { out: "CONTAINER ID   IMAGE   STATUS         PORTS                    NAMES" },
        { out: "8c1f0e2a9b7d   redis   Up 5 seconds   0.0.0.0:6379->6379/tcp   redis", tone: "ok", mark: 1 },
      ],
      { tree: beTree("prisma"), panel: 0.72 }
    ),
  "be-api-running": (os) =>
    term(
      os,
      path(BE),
      [
        { cmd: "npm run dev" },
        { out: "> my-api@1.0.0 dev" },
        { out: "> tsx watch src/index.ts" },
        { out: "" },
        { out: "API running on http://localhost:4000", tone: "ok", mark: 1 },
      ],
      { tree: beTree("prisma") }
    ),
  "be-health": (os) => <HealthBrowser os={os} url="localhost:4000/health" />,
  "be-gitignore": (os) => beFile(os, ".gitignore", ["node_modules", ".env", "dist"], "done"),
}

function HealthBrowser({ os, url }: { os: OS; url: string }) {
  return (
    <Browser os={os} url={url} tab={url}>
      <div className="min-h-[200px] p-4 text-[13px]">
        <p className="mb-2 flex items-center gap-1.5 text-[12px] text-[#5f6368]">
          <span className="size-3 rounded-sm border border-[#5f6368]" />
          Pretty-print
        </p>
        <Mark n={1} className="inline-block">
          <p className="px-1" style={{ fontFamily: MONO_FONT }}>
            {'{"ok":true}'}
          </p>
        </Mark>
      </div>
    </Browser>
  )
}

/* ------------------------------------------------------------------ */
/* Frontend                                                            */
/* ------------------------------------------------------------------ */

const FE = PROJ.frontend
const feTree = (active?: string, extra: TreeNode[] = []): TreeNode[] => {
  const t: TreeNode[] = [
    d("app", { open: true }),
    f("favicon.ico", { depth: 1 }),
    f("globals.css", { depth: 1 }),
    f("layout.tsx", { depth: 1 }),
    f("page.tsx", { depth: 1 }),
    d("node_modules", ignored),
    d("public"),
    ...extra,
    f(".gitignore"),
    f("next.config.ts"),
    f("package.json"),
    f("README.md"),
    f("tsconfig.json"),
  ]
  return active ? mark(t, active, { active: true }) : t
}

function NextBrowser({ os, children }: { os: OS; children: React.ReactNode }) {
  return (
    <Browser os={os} url="localhost:3000" tab="Create Next App" tabIcon={<SiNextdotjs className="size-3.5" />}>
      <div
        className="flex min-h-[300px] flex-col items-center justify-center gap-4 bg-white p-10 text-[#171717]"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {children}
      </div>
    </Browser>
  )
}

const MyPage = ({ button }: { button?: boolean }) => (
  <>
    <Mark n={1} className="inline-block">
      <p className="px-2 text-[36px] font-bold">My Frontend App</p>
    </Mark>
    <p className="text-[#71717a]">Built with Next.js and Tailwind CSS.</p>
    {button && <span className="rounded-md bg-[#171717] px-4 py-2 text-[13px] font-medium text-white">Get started</span>}
  </>
)

const frontendScreens: Record<string, Screen> = {
  ...shared(FE, {
    status: [
      { cmd: "git add ." },
      { cmd: "git status" },
      { out: "On branch main" },
      { out: "Changes to be committed:" },
      { out: "        modified:   app/globals.css", tone: "ok", mark: 1 },
      { out: "        modified:   app/page.tsx", tone: "ok" },
      { out: "        new file:   components.json", tone: "ok" },
      { out: "        new file:   components/ui/button.tsx", tone: "ok" },
      { out: "        new file:   components/ui/card.tsx", tone: "ok" },
      { out: "        new file:   components/ui/input.tsx", tone: "ok" },
      { out: "        new file:   lib/utils.ts", tone: "ok" },
      { out: "        modified:   package.json", tone: "ok" },
      { cmd: 'git commit -m "Add shadcn/ui and data libraries"' },
      { out: "[main 5b2e9d1] Add shadcn/ui and data libraries" },
    ],
    github: {
      entries: ["app/", "components/", "lib/", "public/", ".gitignore", "README.md", "package.json"],
      message: "Add shadcn/ui and data libraries",
    },
  }),
  "fe-create": (os) =>
    term(
      os,
      "devvy",
      [
        { cmd: "npx create-next-app@latest my-frontend-app" },
        { out: "Ok to proceed? (y) y" },
        { out: "✔ Would you like to use the recommended Next.js defaults? › Yes, use recommended defaults", tone: "accent", mark: 1 },
        { out: `Creating a new Next.js app in ${homePath(os, "devvy/my-frontend-app")}.` },
        { out: "Installing dependencies: next, react, react-dom …" },
        { out: "added 337 packages in 31s" },
        { out: "Initialized a git repository." },
        { out: `Success! Created my-frontend-app at ${homePath(os, "devvy/my-frontend-app")}`, tone: "ok", mark: 2 },
      ],
      { tree: [d("my-frontend-app")], panel: 0.74 }
    ),
  "fe-dev": (os) =>
    term(
      os,
      path(FE),
      [
        { cmd: "npm run dev" },
        { out: "> my-frontend-app@0.1.0 dev" },
        { out: "> next dev --turbopack" },
        { out: "" },
        { out: "   ▲ Next.js 16.0.1 (Turbopack)" },
        { out: "   - Local:        http://localhost:3000", tone: "accent", mark: 1 },
        { out: "" },
        { out: " ✓ Ready in 1.1s", tone: "ok" },
      ],
      { tree: feTree(), panel: 0.66 }
    ),
  "fe-browser-start": (os) => (
    <NextBrowser os={os}>
      <Mark n={1} className="inline-block">
        <div className="flex flex-col items-center gap-4 px-6 py-3">
          <p className="flex items-center gap-2 text-[30px] font-bold tracking-tight">
            <SiNextdotjs className="size-8" /> NEXT.js
          </p>
          <p className="text-[18px] font-semibold">To get started, edit the page.tsx file.</p>
          <div className="flex gap-3 text-[12.5px]">
            <span className="rounded-full bg-[#171717] px-4 py-2 text-white">▲ Deploy Now</span>
            <span className="rounded-full border border-[#e5e5e5] px-4 py-2">Documentation</span>
          </div>
        </div>
      </Mark>
    </NextBrowser>
  ),
  "fe-browser-yours": (os) => (
    <NextBrowser os={os}>
      <MyPage />
    </NextBrowser>
  ),
  "fe-shadcn": (os) => (
    <VSCode
      os={os}
      folder={FE.repo}
      tree={feTree(undefined, [
        d("components", { open: true }),
        d("ui", { depth: 1, open: true }),
        f("button.tsx", { depth: 2, status: "U" }),
        f("card.tsx", { depth: 2, status: "U" }),
        f("input.tsx", { depth: 2, status: "U" }),
      ]).filter((n) => !["favicon.ico", "globals.css", "layout.tsx"].includes(n.name))}
      terminal={{
        cwd: path(FE),
        list: ["node", os === "windows" ? "powershell" : os === "mac" ? "zsh" : "bash"],
        lines: [
          { cmd: "npx shadcn@latest init" },
          { out: "✔ Preflight checks." },
          { out: "✔ Writing components.json." },
          { out: "✔ Updating app/globals.css" },
          { out: "Success! Project initialization completed.", tone: "ok" },
          { cmd: "npx shadcn@latest add button card input" },
          { out: "✔ Created 3 files:", tone: "ok" },
          { out: "  - components/ui/button.tsx", mark: 1 },
          { out: "  - components/ui/card.tsx" },
          { out: "  - components/ui/input.tsx" },
        ],
      }}
      panel={0.74}
      height={460}
    />
  ),
  "fe-browser-button": (os) => (
    <NextBrowser os={os}>
      <p className="text-[36px] font-bold">My Frontend App</p>
      <p className="text-[#71717a]">Built with Next.js and Tailwind CSS.</p>
      <Mark n={1} className="inline-block">
        <span className="block rounded-md bg-[#171717] px-4 py-2 text-[13px] font-medium text-white">Get started</span>
      </Mark>
    </NextBrowser>
  ),
  "fe-install": (os) =>
    term(
      os,
      path(FE),
      [
        { cmd: "npm install @tanstack/react-query zustand" },
        { out: "added 3 packages, and audited 341 packages in 4s", tone: "ok", mark: 1 },
        { out: "found 0 vulnerabilities" },
        { cmd: "" },
      ],
      { tree: feTree(undefined, [d("components"), d("lib")]) }
    ),
}

/* ------------------------------------------------------------------ */
/* App development                                                     */
/* ------------------------------------------------------------------ */

const APP = PROJ["app-development"]

/** A deterministic, QR-looking pattern in half-block characters. */
function qrLines(): string[] {
  const n = 25
  const cell = (x: number, y: number) => {
    const finder = (cx: number, cy: number) => {
      const dx = x - cx
      const dy = y - cy
      if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null
      return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
    }
    for (const [cx, cy] of [
      [0, 0],
      [n - 7, 0],
      [0, n - 7],
    ]) {
      const v = finder(cx, cy)
      if (v !== null) return v
    }
    return (x * 7 + y * 13 + ((x * y) % 5)) % 3 === 0
  }
  const out: string[] = []
  for (let y = 0; y < n; y += 2) {
    let line = "  "
    for (let x = 0; x < n; x++) {
      const top = cell(x, y)
      const bottom = y + 1 < n ? cell(x, y + 1) : false
      line += top && bottom ? "█" : top ? "▀" : bottom ? "▄" : " "
    }
    out.push(line)
  }
  return out
}

function ExpoWelcome({ title = "Welcome!", api }: { title?: string; api?: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-36 items-end bg-[#a1cedc] p-3">
        <SiReact className="size-20 text-[#61dafb] opacity-70" />
      </div>
      <div className="space-y-3 p-4">
        <p className="text-[22px] font-bold">{title} 👋</p>
        {api && <p className="text-[12px]">API: {api}</p>}
        <p className="text-[13px] font-semibold">Step 1: Try it</p>
        <p className="text-[11px] text-[#444]">Edit app/(tabs)/index.tsx to see changes.</p>
        <p className="text-[13px] font-semibold">Step 2: Explore</p>
        <p className="text-[11px] text-[#444]">Tap the Explore tab to learn more about what&apos;s included.</p>
      </div>
    </div>
  )
}

export { ExpoWelcome }

const INDEX_LINES = (title: string) => [
  "export default function HomeScreen() {",
  "  return (",
  "    <ParallaxScrollView",
  "      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>",
  "      <ThemedView style={styles.titleContainer}>",
  `        <ThemedText type="title">${title}</ThemedText>`,
  "        <HelloWave />",
  "      </ThemedView>",
]

const appScreens: Record<string, Screen> = {
  ...shared(APP, {
    status: [],
    github: {
      entries: ["app/", "assets/", "components/", "constants/", "hooks/", ".gitignore", "README.md", "app.json", "package.json"],
      message: "Initial Expo app",
    },
  }),
  "app-create": (os) =>
    term(
      os,
      "devvy",
      [
        { cmd: "npx create-expo-app@latest my-mobile-app" },
        { out: "Ok to proceed? (y) y" },
        { out: "Creating an Expo project using the default template." },
        { out: "✔ Downloaded and extracted project files." },
        { out: "✔ Installed JavaScript dependencies." },
        { out: "✅ Your project is ready!", tone: "ok", mark: 1 },
        { out: "To run your project, navigate to the directory and run one of the following npm commands." },
        { out: "- cd my-mobile-app" },
        { out: "- npm run android" },
      ],
      { tree: [d("my-mobile-app")], panel: 0.74 }
    ),
  "app-start": (os) =>
    term(
      os,
      path(APP),
      [
        { cmd: "npx expo start" },
        { out: "Starting Metro Bundler" },
        ...qrLines().map((l): TermLine => ({ out: l, tone: "bold" })),
        { out: "› Metro waiting on exp://192.168.1.10:8081" },
        { out: "› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)", tone: "accent", mark: 1 },
      ],
      { tree: APP.root, panel: 0.84, height: 520 }
    ),
  "app-scan": () => (
    <div className="flex justify-center gap-14">
      <div className="flex flex-col items-center gap-2">
        <p className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#333] shadow-sm">Android — Expo Go</p>
        <Phone kind="android">
          <div className="p-4">
            <p className="flex items-center gap-2 text-[16px] font-bold">
              <SiExpo className="size-5" /> Expo Go
            </p>
            <p className="mt-5 text-[11px] font-semibold text-[#666] uppercase">Development servers</p>
            <Mark n={1} className="mt-2">
              <span className="flex items-center gap-2 rounded-lg bg-[#f0f0f0] px-3 py-3 text-[13px] font-semibold">
                <QrCode className="size-4" /> Scan QR code
              </span>
            </Mark>
            <p className="mt-6 text-[11px] font-semibold text-[#666] uppercase">Recently opened</p>
            <p className="mt-2 text-[11px] text-[#888]">Nothing yet</p>
          </div>
        </Phone>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#333] shadow-sm">iPhone — Camera app</p>
        <Phone kind="iphone">
          <div className="relative flex h-full flex-col items-center justify-center bg-[#222]">
            <div className="grid size-28 grid-cols-5 gap-0.5 bg-white p-2">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} className={(i * 7) % 3 === 0 || [0, 4, 20].includes(i) ? "bg-black" : "bg-white"} />
              ))}
            </div>
            <Camera className="mt-6 size-6 text-white/60" />
            <div className="absolute top-12 right-3 left-3">
              <Mark n={2}>
                <span className="block rounded-xl bg-[#ffd60a] px-3 py-2 text-center text-[12px] font-semibold text-black">Open in Expo Go</span>
              </Mark>
            </div>
          </div>
        </Phone>
      </div>
    </div>
  ),
  "app-phone-welcome": () => (
    <div className="flex justify-center">
      <Phone kind="android">
        <div className="relative h-full">
          <ExpoWelcome />
          <div className="absolute top-[150px] left-3">
            <Mark n={1}>
              <span className="block h-8 w-40" />
            </Mark>
          </div>
        </div>
      </Phone>
    </div>
  ),
  "app-edit": (os) => (
    <div className="flex items-center gap-4">
      <div className="w-[520px] shrink-0">
        <VSCode
          os={os}
          sidebar={null}
          folder={APP.repo}
          tree={[
            d("app", { open: true }),
            d("(tabs)", { depth: 1, open: true }),
            f("_layout.tsx", { depth: 2 }),
            f("explore.tsx", { depth: 2 }),
            f("index.tsx", { depth: 2, active: true, status: "M" }),
            d("assets"),
            d("components"),
          ]}
          editor={{
            tabs: ["index.tsx"],
            active: "index.tsx",
            file: "app/(tabs)/index.tsx",
            lines: INDEX_LINES("Hello, Devvy!"),
            mark: { from: 6, to: 6, n: 1 },
          }}
        />
      </div>
      <div className="h-[390px] w-[190px] shrink-0 [&>*]:origin-top-left [&>*]:scale-[0.85]">
        <Phone kind="android">
          <div className="relative h-full">
            <ExpoWelcome title="Hello, Devvy!" />
            <div className="absolute top-[150px] left-3">
              <Mark n={2}>
                <span className="block h-8 w-44" />
              </Mark>
            </div>
          </div>
        </Phone>
      </div>
    </div>
  ),
  "app-eas": (os) =>
    term(
      os,
      path(APP),
      [
        { cmd: "npm install -g eas-cli" },
        { out: "added 447 packages in 24s" },
        { cmd: "eas login" },
        { out: "Log in to EAS with email or username (exit and run eas login --help to see other login options)" },
        { out: "✔ Email or username … asha-rao" },
        { out: "✔ Password … ********" },
        { out: "Logged in as asha-rao", tone: "ok", mark: 1 },
        { cmd: "" },
      ],
      { tree: APP.root, panel: 0.7 }
    ),
  "app-git-commit": (os) =>
    term(
      os,
      path(APP),
      [
        { cmd: "git init" },
        { out: `Reinitialized existing Git repository in ${homePath(os, "devvy/my-mobile-app/.git/")}` },
        { cmd: "git add ." },
        { cmd: 'git commit -m "Initial Expo app"' },
        { out: "[main (root-commit) 7d3c1a9] Initial Expo app", tone: "ok", mark: 1 },
        { out: " 41 files changed, 14320 insertions(+)" },
        { cmd: "" },
      ],
      { tree: APP.root, panel: 0.62 }
    ),
}

/* ------------------------------------------------------------------ */
/* Python tracks                                                       */
/* ------------------------------------------------------------------ */

function venvToast() {
  return (
    <div className="w-[330px] rounded-md border border-[#454545] bg-[#252526] p-3 text-[12px] text-[#cccccc] shadow-2xl">
      <p>
        <span className="mr-1.5 text-[#3794ff]">ⓘ</span>We noticed a new environment has been created. Do you want to select it for the workspace
        folder?
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <Mark n={1}>
          <span className="block rounded-sm bg-[#0078d4] px-3 py-1 text-white">Yes</span>
        </Mark>
        <span className="rounded-sm bg-[#3a3d41] px-3 py-1">No</span>
      </div>
    </div>
  )
}

function pythonScreens(
  p: Proj,
  opts: { packages: string; installed: string; folders: string[]; extra: Record<string, Screen> }
): Record<string, Screen> {
  const k = p.key
  const cwd = path(p)
  const venvNode = d(".venv")
  const files = [f(".gitignore"), f("requirements.txt")]
  return {
    ...shared(p, {
      status: [
        { cmd: "git add .", prefix: "(.venv)" },
        { cmd: "git status", prefix: "(.venv)" },
        { out: "On branch main" },
        { out: "No commits yet" },
        { out: "Changes to be committed:" },
        { out: "        new file:   .gitignore", tone: "ok", mark: 1 },
        ...(k === "py"
          ? (["app/__init__.py", "app/main.py", "requirements.txt", "tests/test_main.py"].map((x) => ({
              out: `        new file:   ${x}`,
              tone: "ok",
            })) as TermLine[])
          : ([`notebooks/${k === "ml" ? "01-exploration" : "01-cleaning"}.ipynb`, "requirements.txt"].map((x) => ({
              out: `        new file:   ${x}`,
              tone: "ok",
            })) as TermLine[])),
        { cmd: 'git commit -m "Initial project setup"', prefix: "(.venv)" },
        { out: "[main (root-commit) 3f9a7c2] Initial project setup" },
      ],
      github: {
        entries: k === "py" ? ["app/", "tests/", ".gitignore", "requirements.txt"] : ["notebooks/", ".gitignore", "requirements.txt"],
        message: "Initial project setup",
      },
    }),
    [`${k}-venv`]: (os) => (
      <VSCode
        os={os}
        folder={p.repo}
        tree={[{ ...venvNode, status: "U" }]}
        terminal={{ cwd, lines: [{ cmd: os === "windows" ? "python -m venv .venv" : "python3 -m venv .venv" }, { cmd: "" }] }}
        toast={venvToast()}
        panel={0.42}
      />
    ),
    [`${k}-activate`]: (os) =>
      term(os, cwd, [{ cmd: os === "windows" ? ".venv\\Scripts\\Activate.ps1" : "source .venv/bin/activate" }, { ...venv(""), mark: 1 }], {
        tree: [venvNode],
      }),
    [`${k}-pip`]: (os) =>
      term(
        os,
        cwd,
        [
          venv(`pip install ${opts.packages}`),
          { out: `Collecting ${opts.packages.split(" ")[0].replace(/"/g, "")}` },
          { out: "  Downloading … (12.8 MB)" },
          { out: "Installing collected packages: …" },
          { out: `Successfully installed ${opts.installed}`, tone: "ok", mark: 1 },
          venv(""),
        ],
        { tree: [venvNode], panel: 0.66 }
      ),
    [`${k}-requirements`]: (os) =>
      editor(
        os,
        p,
        "requirements.txt",
        opts.installed
          .split(" ")
          .slice(0, 9)
          .map((x) => x.replace(/-(\d)/, "==$1")),
        [venvNode, f("requirements.txt", { active: true, status: "U" })],
        {
          editor: {
            tabs: ["requirements.txt"],
            active: "requirements.txt",
            file: "requirements.txt",
            lines: opts.installed
              .split(" ")
              .slice(0, 9)
              .map((x) => x.replace(/-(\d)/, "==$1")),
            mark: { from: 1, to: 3, n: 1 },
          },
        }
      ),
    [`${k}-gitignore`]: (os) =>
      editor(
        os,
        p,
        ".gitignore",
        [".venv/", ".env", "__pycache__/", ".ipynb_checkpoints/"],
        [{ ...venvNode, ignored: true, mark: 1 }, f(".gitignore", { active: true, status: "U" }), f("requirements.txt", { status: "U" })]
      ),
    [`${k}-folders`]: (os) =>
      term(
        os,
        cwd,
        os === "windows"
          ? [
              venv(`mkdir ${opts.folders.join(", ")}`),
              { out: "" },
              { out: `    Directory: C:\\Users\\Asha\\devvy\\${p.repo}` },
              { out: "" },
              { out: "Mode                 LastWriteTime         Length Name" },
              ...opts.folders.map((x): TermLine => ({ out: `d-----        10/11/2026     10:24                ${x}` })),
            ]
          : [venv(`mkdir ${opts.folders.join(" ")}`), venv("")],
        { tree: [d(".venv", ignored), ...[...opts.folders].sort().map((x, i) => d(x, i === 0 ? { mark: 1 } : {})), ...files] }
      ),
    ...opts.extra,
  }
}

function JupyterLab({ os, tab, children, files }: { os: OS; tab: string; children: React.ReactNode; files: React.ReactNode }) {
  return (
    <Browser os={os} url="localhost:8888/lab" tab={tab} tabIcon={<SiJupyter className="size-3.5 text-[#f37626]" />}>
      <div className="flex min-h-[330px] bg-white text-[#212121]" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="w-48 shrink-0 border-r border-[#e0e0e0] bg-[#fafafa] p-2 text-[12px]">
          <p className="mb-2 flex items-center gap-1.5 font-semibold">
            <SiJupyter className="size-4 text-[#f37626]" /> File Browser
          </p>
          {files}
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
    </Browser>
  )
}

function jupyterScreens(p: Proj, notebook: string, cell: string[], output: string): Record<string, Screen> {
  const folders = p.key === "ml" ? ["app", "data", "notebooks"] : ["dashboard", "data", "notebooks"]
  return {
    [`${p.key}-jupyter-launcher`]: (os) => (
      <JupyterLab
        os={os}
        tab="JupyterLab"
        files={
          <div className="space-y-0.5">
            {folders.map((x) =>
              x === "notebooks" ? (
                <Mark key={x} n={1} badge="r" className="mr-6">
                  <p className="rounded bg-[#e3f2fd] px-2 py-1">📁 {x}</p>
                </Mark>
              ) : (
                <p key={x} className="px-2 py-1">
                  📁 {x}
                </p>
              )
            )}
            <p className="px-2 py-1">📄 requirements.txt</p>
          </div>
        }
      >
        <p className="text-[15px] font-semibold">Launcher</p>
        <p className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-[#616161]">📓 Notebook</p>
        <div className="mt-2 flex gap-3">
          <Mark n={2}>
            <div className="flex h-28 w-24 flex-col items-center justify-center gap-2 rounded border border-[#e0e0e0] bg-white p-2 text-center text-[11px] shadow-sm">
              <span className="text-[30px]">🐍</span>
              Python 3 (ipykernel)
            </div>
          </Mark>
        </div>
        <p className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-[#616161]">▶ Console</p>
        <p className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-[#616161]">$_ Other</p>
      </JupyterLab>
    ),
    [`${p.key}-jupyter-cell`]: (os) => (
      <JupyterLab
        os={os}
        tab={`${notebook}.ipynb`}
        files={
          <div className="space-y-0.5">
            <p className="px-2 py-1 text-[#616161]">/ notebooks /</p>
            <p className="rounded bg-[#e3f2fd] px-2 py-1">📓 {notebook}.ipynb</p>
          </div>
        }
      >
        <p className="inline-block rounded-t border border-b-0 border-[#e0e0e0] px-3 py-1 text-[12px]">{notebook}.ipynb</p>
        <div className="border border-[#e0e0e0] p-3">
          <div className="flex gap-2">
            <span className="w-10 shrink-0 pt-1 text-right text-[11px] text-[#307fc1]" style={{ fontFamily: MONO_FONT }}>
              [1]:
            </span>
            <div className="flex-1 rounded border border-[#e0e0e0] bg-[#f7f7f7] p-2 text-[12px] leading-relaxed" style={{ fontFamily: MONO_FONT }}>
              {cell.map((l, i) => (
                <p key={i}>
                  {l.split(/(\bimport\b|\bprint\b)/).map((t, j) => (
                    <span key={j} className={t === "import" ? "font-bold text-[#008000]" : t === "print" ? "text-[#008000]" : ""}>
                      {t}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="w-10 shrink-0" />
            <Mark n={1} className="inline-block">
              <p className="px-2 py-1 text-[12px]" style={{ fontFamily: MONO_FONT }}>
                {output}
              </p>
            </Mark>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="w-10 shrink-0 text-right text-[11px] text-[#307fc1]" style={{ fontFamily: MONO_FONT }}>
              [ ]:
            </span>
            <div className="h-7 flex-1 rounded border border-[#e0e0e0] bg-[#f7f7f7]" />
          </div>
        </div>
      </JupyterLab>
    ),
  }
}

const ML = PROJ["ai-ml"]
const DS = PROJ["data-science"]
const PY = PROJ.python

const mlScreens = pythonScreens(ML, {
  packages: "numpy pandas scikit-learn matplotlib jupyterlab",
  installed:
    "contourpy-1.3.3 jupyterlab-4.4.9 matplotlib-3.10.6 numpy-2.3.3 pandas-2.3.3 scikit-learn-1.7.2 scipy-1.16.2 threadpoolctl-3.6.0 tornado-6.5.2",
  folders: ["data", "notebooks", "app"],
  extra: jupyterScreens(ML, "01-exploration", ["import pandas as pd", "import sklearn", "print(pd.__version__, sklearn.__version__)"], "2.3.3 1.7.2"),
})

const dsScreens = pythonScreens(DS, {
  packages: "pandas matplotlib plotly jupyterlab streamlit",
  installed: "altair-5.5.0 jupyterlab-4.4.9 matplotlib-3.10.6 numpy-2.3.3 pandas-2.3.3 plotly-6.3.1 pyarrow-21.0.0 streamlit-1.50.0 tornado-6.5.2",
  folders: ["data", "notebooks", "dashboard"],
  extra: jupyterScreens(
    DS,
    "01-cleaning",
    ["import pandas as pd", "import sqlite3", "print(pd.__version__, sqlite3.sqlite_version)"],
    "2.3.3 3.50.4"
  ),
})

const PY_MAIN = [
  "import argparse",
  "",
  "",
  "def greet(name: str) -> str:",
  '    return f"Hello, {name}!"',
  "",
  "",
  "def main():",
  '    parser = argparse.ArgumentParser(description="My tool")',
  '    parser.add_argument("name", help="Who to greet")',
  "    args = parser.parse_args()",
  "    print(greet(args.name))",
  "",
  "",
  'if __name__ == "__main__":',
  "    main()",
]

const pyTree = (active?: string): TreeNode[] => {
  const t: TreeNode[] = [
    d(".venv", ignored),
    d("app", { open: true }),
    f("__init__.py", { depth: 1 }),
    f("main.py", { depth: 1 }),
    d("tests", { open: active === "test_main.py" }),
    ...(active === "test_main.py" ? [f("test_main.py", { depth: 1 })] : []),
    f(".gitignore"),
    f("requirements.txt"),
  ]
  return active ? mark(t, active, { active: true }) : t
}

const pyScreens = pythonScreens(PY, {
  packages: 'requests "fastapi[standard]" pydantic pytest',
  installed:
    "certifi-2025.10.5 fastapi-0.118.0 httpx-0.28.1 pydantic-2.11.10 pytest-8.4.2 requests-2.32.5 starlette-0.48.0 urllib3-2.5.0 uvicorn-0.37.0",
  folders: ["app", "tests"],
  extra: {
    "py-main": (os) => editor(os, PY, "app/main.py", PY_MAIN, pyTree("main.py"), { height: 460 }),
    "py-run": (os) =>
      term(
        os,
        path(PY),
        [
          venv("python -m app.main Asha"),
          { out: "Hello, Asha!", tone: "ok", mark: 1 },
          venv("python -m app.main --help"),
          { out: "usage: main.py [-h] name" },
          { out: "" },
          { out: "My tool" },
          { out: "" },
          { out: "positional arguments:" },
          { out: "  name        Who to greet" },
        ],
        { tree: pyTree(), panel: 0.7 }
      ),
    "py-test": (os) => (
      <VSCode
        os={os}
        folder={PY.repo}
        tree={pyTree("test_main.py")}
        editor={{
          tabs: ["main.py", "test_main.py"],
          active: "test_main.py",
          file: "tests/test_main.py",
          lines: ["from app.main import greet", "", "", "def test_greet():", '    assert greet("Asha") == "Hello, Asha!"'],
        }}
        terminal={{
          cwd: path(PY),
          lines: [
            venv("python -m pytest"),
            { out: "============== test session starts ==============", tone: "bold" },
            { out: "collected 1 item" },
            { out: "tests/test_main.py .                       [100%]" },
            { out: "=============== 1 passed in 0.02s ===============", tone: "ok", mark: 1 },
          ],
        }}
        panel={0.5}
        height={450}
      />
    ),
  },
})

/* ------------------------------------------------------------------ */
/* Java                                                                */
/* ------------------------------------------------------------------ */

const JAVA = PROJ.java

const javaTree = (open: "none" | "resources" | "package", active?: string, extra: TreeNode[] = []): TreeNode[] => {
  const t: TreeNode[] = [d(".mvn")]
  if (open === "none") t.push(d("src"))
  else {
    t.push(d("src", { open: true }), d("main", { depth: 1, open: true }))
    if (open === "package")
      t.push(
        d("java", { depth: 2, open: true }),
        d("com/example/my_java_api", { depth: 3, open: true }),
        ...extra,
        f("MyJavaApiApplication.java", { depth: 4 }),
        d("resources", { depth: 2 })
      )
    else
      t.push(
        d("java", { depth: 2 }),
        d("resources", { depth: 2, open: true }),
        d("static", { depth: 3 }),
        d("templates", { depth: 3 }),
        f("application.properties", { depth: 3 })
      )
  }
  t.push(d("target", ignored), f(".env", ignored), f(".gitignore"), f("HELP.md"), f("mvnw"), f("mvnw.cmd"), f("pom.xml"))
  return active ? mark(t, active, { active: true }) : t
}

const PROPS = [
  "spring.application.name=my-java-api",
  "spring.config.import=optional:file:.env[.properties]",
  "spring.datasource.url=${DATABASE_URL}",
  "spring.datasource.username=${DATABASE_USER}",
  "spring.datasource.password=${DATABASE_PASSWORD}",
  "spring.jpa.hibernate.ddl-auto=update",
]

export {
  PROPS as JAVA_PROPS,
  javaTree,
  beTree,
  feTree,
  pyTree,
  HealthBrowser,
  NextBrowser,
  editor as projectEditor,
  path as projectPath,
  venv as venvLine,
}

const HEALTH = [
  "package com.example.my_java_api;",
  "",
  "import java.util.Map;",
  "",
  "import org.springframework.web.bind.annotation.GetMapping;",
  "import org.springframework.web.bind.annotation.RestController;",
  "",
  "@RestController",
  "public class HealthController {",
  "",
  '    @GetMapping("/health")',
  "    public Map<String, Boolean> health() {",
  '        return Map.of("ok", true);',
  "    }",
  "}",
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[11.5px] font-semibold text-[#6db33f]">{title}</p>
      {children}
    </div>
  )
}

function Initializr({ os }: { os: OS }) {
  return (
    <Browser os={os} url="start.spring.io" tab="Spring Initializr" tabIcon={<SiSpring className="size-3.5 text-[#6db33f]" />}>
      <div className="flex min-h-[420px] bg-white text-[12px] text-[#222]">
        <div className="flex-1 border-r border-[#eee] p-5">
          <p className="mb-4 flex items-center gap-2 text-[16px] font-semibold">
            <SiSpring className="size-5 text-[#6db33f]" /> spring initializr
          </p>
          <div className="grid grid-cols-2 gap-x-4">
            <Section title="Project">
              <div className="space-y-1">
                <Radio label="Gradle - Groovy" />
                <Radio label="Gradle - Kotlin" />
                <Mark n={1} className="inline-block pr-1">
                  <Radio checked label="Maven" />
                </Mark>
              </div>
            </Section>
            <Section title="Language">
              <div className="space-y-1">
                <Radio checked label="Java" />
                <Radio label="Kotlin" />
              </div>
            </Section>
          </div>
          <Section title="Project Metadata">
            <div className="grid grid-cols-[80px_1fr] items-center gap-x-2 gap-y-1.5">
              <span className="text-[#777]">Group</span>
              <span className="border-b border-[#ddd] pb-0.5">com.example</span>
              <span className="text-[#777]">Artifact</span>
              <Mark n={2} badge="r" className="mr-7">
                <span className="block border-b-2 border-[#6db33f] pb-0.5 font-semibold">my-java-api</span>
              </Mark>
              <span className="text-[#777]">Package name</span>
              <span className="border-b border-[#ddd] pb-0.5">com.example.my_java_api</span>
              <span className="text-[#777]">Packaging</span>
              <span>◉ Jar ○ War</span>
              <span className="text-[#777]">Java</span>
              <span className="flex gap-3">
                <span>○ 25</span>
                <Mark n={3} badge="r" className="inline-block pr-1">
                  <span>◉ 21</span>
                </Mark>
                <span className="ml-5">○ 17</span>
              </span>
            </div>
          </Section>
        </div>
        <div className="w-[300px] p-5">
          <p className="flex items-center justify-between">
            <span className="text-[14px] font-semibold">Dependencies</span>
            <span className="rounded border border-[#222] px-2 py-1 text-[10.5px] font-semibold">ADD DEPENDENCIES…</span>
          </p>
          <Mark n={4} className="mt-3">
            <div className="space-y-2 p-1">
              {[
                ["Spring Web", "WEB"],
                ["Spring Data JPA", "SQL"],
                ["PostgreSQL Driver", "SQL"],
                ["Validation", "I/O"],
              ].map(([name, tag]) => (
                <div key={name} className="rounded border border-[#e5e5e5] bg-[#f8f8f8] px-3 py-2">
                  <p className="font-semibold">
                    {name} <span className="ml-1 rounded bg-[#e8e8e8] px-1 text-[9px] text-[#666]">{tag}</span>
                  </p>
                </div>
              ))}
            </div>
          </Mark>
        </div>
      </div>
      <div className="flex gap-3 border-t border-[#eee] bg-white px-5 py-3">
        <Mark n={5}>
          <span className="block rounded bg-[#222] px-5 py-2 text-[11.5px] font-semibold text-white">GENERATE ⌘ + ⏎</span>
        </Mark>
        <span className="rounded border border-[#222] px-5 py-2 text-[11.5px] font-semibold">EXPLORE</span>
      </div>
    </Browser>
  )
}

const javaScreens: Record<string, Screen> = {
  ...shared(JAVA, {
    status: [
      { cmd: "git init" },
      { out: "Initialized empty Git repository in …/devvy/my-java-api/.git/" },
      { cmd: "git add ." },
      { cmd: "git status" },
      { out: "On branch main" },
      { out: "No commits yet" },
      { out: "Changes to be committed:" },
      { out: "        new file:   .gitattributes", tone: "ok", mark: 1 },
      { out: "        new file:   .gitignore", tone: "ok" },
      { out: "        new file:   HELP.md", tone: "ok" },
      { out: "        new file:   mvnw", tone: "ok" },
      { out: "        new file:   pom.xml", tone: "ok" },
      { out: "        new file:   src/main/java/com/example/my_java_api/HealthController.java", tone: "ok" },
      { out: "        new file:   src/main/resources/application.properties", tone: "ok" },
      { cmd: 'git commit -m "Initial Spring Boot project"' },
    ],
    github: {
      entries: [".mvn/", "src/", ".gitattributes", ".gitignore", "HELP.md", "mvnw", "mvnw.cmd", "pom.xml"],
      message: "Initial Spring Boot project",
    },
  }),
  "java-initializr": (os) => <Initializr os={os} />,
  "java-unzip": (os) => {
    if (os === "mac")
      return (
        <div className="flex items-center gap-3">
          <Finder title="Downloads" active="Downloads" className="w-[340px]">
            <div className="flex gap-4">
              <div className="flex w-[80px] flex-col items-center gap-1 opacity-70">
                <FileArchive className="size-11 text-[#8a8a8a]" strokeWidth={1} />
                <span className="text-center text-[10.5px] leading-tight">my-java-api.zip</span>
              </div>
              <MacFolder name="my-java-api" mark={1} />
            </div>
          </Finder>
          <ArrowRight className="size-7 shrink-0 text-[#555]" />
          <Finder title="asha" active="asha" className="w-[340px]">
            <div className="flex gap-4">
              <MacFolder name="Desktop" />
              <MacFolder name="devvy" mark={2} />
            </div>
          </Finder>
        </div>
      )
    if (os === "windows")
      return (
        <WinWindow title="Extract Compressed (Zipped) Folders" className="mx-auto w-[560px]">
          <div className="space-y-3 p-6 text-[12.5px]">
            <p className="text-[16px] text-[#1f3e7a]">Select a Destination and Extract Files</p>
            <p>Files will be extracted to this folder:</p>
            <div className="flex gap-2">
              <Mark n={1} className="flex-1">
                <TextField value="C:\Users\Asha\devvy" className="w-full" />
              </Mark>
              <WinButton>Browse…</WinButton>
            </div>
            <Checkbox checked label="Show extracted files when complete" />
            <div className="flex justify-end gap-2 pt-8">
              <Mark n={2}>
                <WinButton primary>Extract</WinButton>
              </Mark>
              <WinButton>Cancel</WinButton>
            </div>
          </div>
        </WinWindow>
      )
    return term(
      os,
      "devvy",
      [
        { cmd: "unzip ~/Downloads/my-java-api.zip -d ~/devvy" },
        { out: "Archive:  /home/asha/Downloads/my-java-api.zip" },
        { out: "   creating: /home/asha/devvy/my-java-api/" },
        { out: "  inflating: /home/asha/devvy/my-java-api/pom.xml" },
        { out: "  inflating: /home/asha/devvy/my-java-api/mvnw" },
        { cmd: "" },
      ],
      { tree: [d("my-java-api")] }
    )
  },
  "java-ready": (os) => (
    <VSCode os={os} folder={JAVA.repo} tree={javaTree("none").filter((n) => n.name !== ".env")} statusItem={{ text: "☕ Java: Ready", mark: 1 }} branch="" />
  ),
  "java-createdb": (os) =>
    term(
      os,
      path(JAVA),
      os === "mac"
        ? [{ cmd: "/Applications/Postgres.app/Contents/Versions/latest/bin/createdb devvy_java" }, { cmd: "", mark: 1 }]
        : os === "windows"
          ? [{ cmd: '& "C:\\Program Files\\PostgreSQL\\18\\bin\\createdb.exe" -U postgres devvy_java' }, { out: "Password:" }, { cmd: "", mark: 1 }]
          : [{ cmd: "sudo -u postgres createdb devvy_java" }, { out: "[sudo] password for asha:" }, { cmd: "", mark: 1 }],
      { branch: "", tree: javaTree("none").filter((n) => n.name !== ".env") }
    ),
  "java-env": (os) =>
    editor(
      os,
      JAVA,
      ".env",
      [
        "DATABASE_URL=jdbc:postgresql://localhost:5432/devvy_java",
        `DATABASE_USER=${os === "mac" ? "asha" : "postgres"}`,
        `DATABASE_PASSWORD=${os === "mac" ? "" : "devvy123"}`,
      ],
      mark(javaTree("none"), ".env", { active: true, ignored: false, status: "U" }),
      { branch: "" }
    ),
  "java-properties": (os) => editor(os, JAVA, "src/main/resources/application.properties", PROPS, javaTree("resources", "application.properties"), { branch: "" }),
  "java-gitignore": (os) =>
    editor(
      os,
      JAVA,
      ".gitignore",
      [
        "HELP.md",
        "target/",
        "!.mvn/wrapper/maven-wrapper.jar",
        "",
        "### IntelliJ IDEA ###",
        ".idea",
        "*.iml",
        "",
        "### VS Code ###",
        ".vscode/",
        ".env",
      ],
      javaTree("none", ".gitignore"),
      {
        branch: "",
        editor: {
          tabs: [".gitignore"],
          active: ".gitignore",
          file: ".gitignore",
          lines: [
            "HELP.md",
            "target/",
            "!.mvn/wrapper/maven-wrapper.jar",
            "",
            "### IntelliJ IDEA ###",
            ".idea",
            "*.iml",
            "",
            "### VS Code ###",
            ".vscode/",
            ".env",
          ],
          mark: { from: 11, to: 11, n: 1 },
        },
      }
    ),
  "java-controller": (os) =>
    editor(
      os,
      JAVA,
      "src/main/java/com/example/my_java_api/HealthController.java",
      HEALTH,
      javaTree("package", "HealthController.java", [f("HealthController.java", { depth: 4, status: "U" })]),
      { height: 480, branch: "" }
    ),
  "java-run": (os) =>
    term(
      os,
      path(JAVA),
      [
        { cmd: os === "windows" ? ".\\mvnw spring-boot:run" : "./mvnw spring-boot:run" },
        { out: "[INFO] --- spring-boot:3.5.6:run (default-cli) @ my-java-api ---" },
        { out: "  .   ____          _            __ _ _" },
        { out: " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\" },
        { out: " :: Spring Boot ::                (v3.5.6)" },
        { out: "Tomcat started on port 8080 (http) with context path '/'" },
        { out: "Started MyJavaApiApplication in 3.214 seconds (process running for 3.61)", tone: "ok", mark: 1 },
      ],
      { branch: "", tree: javaTree("none"), panel: 0.7 }
    ),
  "java-health": (os) => <HealthBrowser os={os} url="localhost:8080/health" />,
}

/* ------------------------------------------------------------------ */

export const projectScreens: Record<string, Screen> = {
  ...backendScreens,
  ...frontendScreens,
  ...appScreens,
  ...mlScreens,
  ...dsScreens,
  ...pyScreens,
  ...javaScreens,
}
