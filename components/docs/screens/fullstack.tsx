import { ArrowRight, Check, Download, FileArchive, Terminal as TerminalIcon } from "lucide-react"
import { FaWindows } from "react-icons/fa"
import { SiApple, SiGit, SiGithub, SiLinux, SiNodedotjs, SiPostgresql, SiReact, SiVite } from "react-icons/si"
import { VscVscode } from "react-icons/vsc"

import {
  Browser,
  Checkbox,
  DesktopTerminal,
  Explorer,
  Finder,
  MacButton,
  MacDialog,
  MacFolder,
  MacInstaller,
  MacWindow,
  Mark,
  Menu,
  MONO_FONT,
  Radio,
  TextField,
  WinButton,
  WinFolder,
  WinWindow,
  Wizard,
  type MenuItem,
} from "@/components/docs/screens/kit"
import { VSCode, TrustDialog, type TermLine, type TreeNode, type VSCodeProps } from "@/components/docs/screens/vscode"
import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * Every screen in the Full-Stack setup walkthrough (data/docs/fullstack-setup.ts),
 * keyed by id. Each one takes the OS and returns that OS's version, or null
 * when the step doesn't apply. Marker numbers match the step text.
 */

type Screen = (os: OS) => React.ReactNode

export const USER = "asha-rao"

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

export const vsIcon = <VscVscode className="size-4 text-[#0078d4]" />

/** VS Code with a terminal, the shape of most setup screens. */
export function term(os: OS, cwd: string, lines: TermLine[], extra: Partial<VSCodeProps> = {}) {
  // The window always shows the folder you opened, even when the terminal has cd'd deeper.
  const folder = cwd.split("/")[1] ?? "devvy"
  return <VSCode os={os} folder={folder} terminal={{ cwd, lines }} panel={0.62} {...extra} />
}

/** What `pwd` prints in each shell. */
function pwdOut(os: OS, cwd: string): TermLine[] {
  if (os === "windows")
    return [{ out: "" }, { out: "Path" }, { out: "----" }, { out: `C:\\Users\\Asha\\${cwd.split("/").join("\\")}`, mark: 1 }, { out: "" }]
  return [{ out: os === "mac" ? `/Users/asha/${cwd}` : `/home/asha/${cwd}`, mark: 1 }]
}

export const PROJECT = "devvy/my-fullstack-app"
export const SERVER = `${PROJECT}/server`
export const CLIENT = `${PROJECT}/client`

/** The project tree at different points in the setup. */
export function projectTree(stage: "empty" | "client" | "server" | "src" | "prisma" | "gitignore", active?: string): TreeNode[] {
  const nodes: TreeNode[] = []
  if (stage === "empty") return nodes
  nodes.push({ name: "client", dir: true })
  if (stage === "client") return nodes
  nodes.push({ name: "server", dir: true, open: true })
  const files: TreeNode[] = [
    {
      name: "node_modules",
      dir: true,
      depth: 1,
      ignored: stage === "gitignore",
    },
  ]
  if (stage === "prisma" || stage === "gitignore")
    files.push({ name: "prisma", dir: true, open: true, depth: 1 }, { name: "schema.prisma", depth: 2 })
  if (stage !== "server") files.push({ name: "src", dir: true, open: true, depth: 1 }, { name: "app.ts", depth: 2 }, { name: "index.ts", depth: 2 })
  if (stage === "prisma" || stage === "gitignore") files.push({ name: ".env", depth: 1, ignored: stage === "gitignore" })
  if (stage === "gitignore") files.push({ name: ".gitignore", depth: 1 })
  files.push({ name: "package-lock.json", depth: 1 }, { name: "package.json", depth: 1 })
  if (stage !== "server") files.push({ name: "tsconfig.json", depth: 1 })
  return [...nodes, ...files].map((n) => (n.name === active ? { ...n, active: true } : n))
}

const homeMacFolders = ["Desktop", "Documents", "Downloads", "Movies", "Music", "Pictures", "Public"]
const homeWinFolders = ["Desktop", "Documents", "Downloads", "Music", "Pictures", "Videos"]

/* ------------------------------------------------------------------ */
/* Part 1 — workspace folder                                           */
/* ------------------------------------------------------------------ */

const folderHome: Screen = (os) => {
  if (os === "mac")
    return (
      <Finder title="asha" active="asha" markPlace={{ label: "asha", n: 1 }} className="w-[640px]">
        <div className="grid grid-cols-5 gap-y-4">
          {homeMacFolders.map((f) => (
            <MacFolder key={f} name={f} />
          ))}
        </div>
      </Finder>
    )
  if (os === "windows")
    return (
      <Explorer path={["Local Disk (C:)", "Users", "Asha"]} active="This PC" markAddress={1} className="w-[680px]">
        <div className="grid grid-cols-5 gap-y-3">
          {homeWinFolders.map((f) => (
            <WinFolder key={f} name={f} />
          ))}
        </div>
      </Explorer>
    )
  return null
}

const folderNew: Screen = (os) => {
  if (os === "mac")
    return (
      <Finder title="asha" active="asha" className="w-[640px]">
        <div className="relative min-h-[330px]">
          <div className="grid grid-cols-5 gap-y-4">
            {homeMacFolders.map((f) => (
              <MacFolder key={f} name={f} />
            ))}
          </div>
          <div className="absolute top-[96px] left-[172px] flex items-start gap-1">
            <Mark n={1} badge="tl">
              <div className="size-10 rounded border border-dashed border-[#0a84ff]/60 bg-[#0a84ff]/5" />
            </Mark>
            <Menu
              os="mac"
              className="ml-2 w-48"
              items={[
                { label: "New Folder", mark: 2 },
                { label: "Get Info" },
                "sep",
                { label: "Import from iPhone or iPad", sub: true },
                "sep",
                { label: "Use Groups" },
                { label: "Sort By", sub: true },
                { label: "Show View Options" },
              ]}
            />
          </div>
        </div>
      </Finder>
    )
  if (os === "windows")
    return (
      <Explorer path={["Local Disk (C:)", "Users", "Asha"]} active="This PC" className="w-[680px]">
        <div className="relative min-h-[300px]">
          <div className="grid grid-cols-5 gap-y-3">
            {homeWinFolders.map((f) => (
              <WinFolder key={f} name={f} />
            ))}
          </div>
          <div className="absolute top-[100px] left-[40px] flex items-start">
            <Menu
              os="windows"
              items={[
                { label: "View", sub: true },
                { label: "Sort by", sub: true },
                { label: "Group by", sub: true },
                "sep",
                { label: "New", sub: true, mark: 1 },
                "sep",
                { label: "Properties", shortcut: "Alt+Enter" },
              ]}
            />
            <Menu
              os="windows"
              className="mt-[76px] ml-1 w-44"
              items={[{ label: "Folder", mark: 2 }, { label: "Shortcut" }, "sep", { label: "Text Document" }]}
            />
          </div>
        </div>
      </Explorer>
    )
  return null
}

const folderNamed: Screen = (os) => {
  if (os === "mac")
    return (
      <Finder title="asha" active="asha" className="w-[640px]">
        <div className="grid grid-cols-5 gap-y-4">
          {homeMacFolders.map((f) => (
            <MacFolder key={f} name={f} />
          ))}
          <MacFolder name="devvy" editing mark={1} />
        </div>
      </Finder>
    )
  if (os === "windows")
    return (
      <Explorer path={["Local Disk (C:)", "Users", "Asha"]} active="This PC" className="w-[680px]">
        <div className="grid grid-cols-5 gap-y-3">
          {homeWinFolders.map((f) => (
            <WinFolder key={f} name={f} />
          ))}
          <WinFolder name="devvy" selected editing mark={1} />
        </div>
      </Explorer>
    )
  return null
}

const folderLinux: Screen = (os) =>
  os === "linux" ? (
    <DesktopTerminal os="linux">
      <p>
        <span className="font-semibold text-[#8ae234]">asha@laptop</span>:<span className="font-semibold text-[#729fcf]">~</span>$ mkdir ~/devvy
      </p>
      <p>
        <span className="font-semibold text-[#8ae234]">asha@laptop</span>:<span className="font-semibold text-[#729fcf]">~</span>$ ls
      </p>
      <p>
        Desktop <span className="font-semibold text-[#729fcf]">devvy</span> Documents Downloads Music Pictures
      </p>
      <p>
        <span className="font-semibold text-[#8ae234]">asha@laptop</span>:<span className="font-semibold text-[#729fcf]">~</span>$
      </p>
    </DesktopTerminal>
  ) : null

/* ------------------------------------------------------------------ */
/* Part 2 — VS Code                                                    */
/* ------------------------------------------------------------------ */

const vscodeDownload: Screen = (os) => {
  const button = (label: string, sub: string, mine: boolean) => {
    const b = (
      <span className="flex h-12 w-44 flex-col items-center justify-center rounded bg-[#0065a9] text-white">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold">
          <Download className="size-3.5" />
          {label}
        </span>
        <span className="text-[10px] opacity-90">{sub}</span>
      </span>
    )
    return mine ? <Mark n={1}>{b}</Mark> : b
  }
  return (
    <Browser os={os} url="code.visualstudio.com/download" tab="Download Visual Studio Code" tabIcon={vsIcon}>
      <div className="px-10 pt-8 pb-10 text-center">
        <p className="text-[24px] font-semibold">Download Visual Studio Code</p>
        <p className="mt-1 text-[13px] text-[#555]">Free and built on open source. Integrated Git, debugging and extensions.</p>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-3">
            <FaWindows className="size-12 text-[#0078d4]" />
            {button("Windows", "Windows 10, 11", os === "windows")}
          </div>
          <div className="flex flex-col items-center gap-3">
            <SiLinux className="size-12 text-[#333]" />
            {button(".deb", "Debian, Ubuntu", os === "linux")}
            <span className="flex h-8 w-44 items-center justify-center rounded bg-[#0065a9] text-[12px] font-semibold text-white">.rpm</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <SiApple className="size-12 text-[#333]" />
            {button("Mac", "macOS 11.0+", os === "mac")}
          </div>
        </div>
      </div>
    </Browser>
  )
}

const vscodeMacDrag: Screen = (os) =>
  os === "mac" ? (
    <Finder title="Downloads" active="Downloads" markPlace={{ label: "Applications", n: 2 }} className="w-[640px]">
      <div className="flex gap-10">
        <div className="flex w-[90px] flex-col items-center gap-1 opacity-70">
          <FileArchive className="size-12 text-[#8a8a8a]" strokeWidth={1} />
          <span className="text-center text-[11px] leading-tight">VSCode-darwin-universal.zip</span>
        </div>
        <Mark n={1}>
          <div className="flex w-[90px] flex-col items-center gap-1">
            <span className="flex size-12 items-center justify-center rounded-xl bg-white shadow">
              <VscVscode className="size-9 text-[#0078d4]" />
            </span>
            <span className="text-center text-[11px] leading-tight">Visual Studio Code</span>
          </div>
        </Mark>
      </div>
      <p className="mt-10 flex items-center gap-2 text-[12px] text-[#8a8a8a]">
        <ArrowRight className="size-4" /> Drag it onto Applications in the sidebar
      </p>
    </Finder>
  ) : null

const vscodeMacGatekeeper: Screen = (os) =>
  os === "mac" ? (
    <div className="flex justify-center">
      <MacDialog
        icon={
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow">
            <VscVscode className="size-10 text-[#0078d4]" />
          </span>
        }
        title="“Visual Studio Code” is an app downloaded from the Internet. Are you sure you want to open it?"
        text="Chrome downloaded this file today."
        buttons={[
          { label: "Cancel", primary: true },
          { label: "Open", mark: 1 },
        ]}
      />
    </div>
  ) : null

const vscodeWinLicense: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Setup - Microsoft Visual Studio Code (User)"
      icon={vsIcon}
      heading="License Agreement"
      sub="Please read the following important information before continuing."
      nextMark={2}
      back={false}
    >
      <div className="h-24 overflow-hidden rounded border border-[#c8c8c8] bg-white p-2 text-[11px] leading-snug text-[#444]">
        MICROSOFT SOFTWARE LICENSE TERMS — MICROSOFT VISUAL STUDIO CODE. These license terms are an agreement between you and Microsoft Corporation…
      </div>
      <div className="mt-3 space-y-2">
        <Mark n={1} className="inline-block">
          <Radio checked label="I accept the agreement" className="pr-1" />
        </Mark>
        <Radio label="I do not accept the agreement" />
      </div>
    </Wizard>
  ) : null

const vscodeWinLocation: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Setup - Microsoft Visual Studio Code (User)"
      icon={vsIcon}
      heading="Select Destination Location"
      sub="Where should Visual Studio Code be installed?"
      nextMark={1}
    >
      <p>Setup will install Visual Studio Code into the following folder.</p>
      <p className="mt-3 text-[#444]">To continue, click Next. If you would like to select a different folder, click Browse.</p>
      <div className="mt-3 flex gap-2">
        <TextField value="C:\Users\Asha\AppData\Local\Programs\Microsoft VS Code" className="flex-1" />
        <WinButton>Browse…</WinButton>
      </div>
      <p className="mt-6 text-[#444]">At least 400 MB of free disk space is required.</p>
    </Wizard>
  ) : null

const vscodeWinTasks: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Setup - Microsoft Visual Studio Code (User)"
      icon={vsIcon}
      heading="Select Additional Tasks"
      sub="Which additional tasks should be performed?"
      nextMark={2}
    >
      <p>Select the additional tasks you would like Setup to perform while installing Visual Studio Code, then click Next.</p>
      <p className="mt-3 font-semibold">Additional icons:</p>
      <Checkbox label="Create a desktop icon" className="mt-1.5" />
      <p className="mt-3 font-semibold">Other:</p>
      <Mark n={1} className="mt-1.5 inline-block pr-2">
        <div className="space-y-1.5">
          <Checkbox checked label="Add “Open with Code” action to Windows Explorer file context menu" />
          <Checkbox checked label="Add “Open with Code” action to Windows Explorer directory context menu" />
          <Checkbox checked label="Register Code as an editor for supported file types" />
          <Checkbox checked label="Add to PATH (requires shell restart)" />
        </div>
      </Mark>
    </Wizard>
  ) : null

const vscodeWinFinish: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Setup - Microsoft Visual Studio Code (User)"
      icon={vsIcon}
      heading="Completing the Visual Studio Code Setup Wizard"
      next="Finish"
      nextMark={2}
      back={false}
    >
      <p>Setup has finished installing Visual Studio Code on your computer. The application may be launched by selecting the installed shortcuts.</p>
      <p className="mt-3">Click Finish to exit Setup.</p>
      <Mark n={1} className="mt-5 inline-block pr-1">
        <Checkbox checked label="Launch Visual Studio Code" />
      </Mark>
    </Wizard>
  ) : null

const vscodeLinuxInstall: Screen = (os) =>
  os === "linux" ? (
    <DesktopTerminal os="linux">
      <p>asha@laptop:~$ cd ~/Downloads</p>
      <p>asha@laptop:~/Downloads$ sudo apt install ./code_*.deb</p>
      <p>[sudo] password for asha:</p>
      <p>Reading package lists... Done</p>
      <p>The following NEW packages will be installed:</p>
      <p> code</p>
      <p>Setting up code ...</p>
      <p className="text-[#8ae234]">asha@laptop:~/Downloads$</p>
    </DesktopTerminal>
  ) : null

const vscodeWelcome: Screen = (os) => <VSCode os={os} sidebar="explorer" welcomeMark={1} />

/** The OS folder picker, opened from VS Code. */
export function pickFolder(os: OS, inside: "home" | "devvy", target: string, folders: string[]) {
  if (os === "windows") {
    return (
      <WinWindow title="Open Folder" icon={vsIcon} className="w-[640px]">
        <Explorer
          path={inside === "home" ? ["Local Disk (C:)", "Users", "Asha"] : ["Local Disk (C:)", "Users", "Asha", "devvy"]}
          active="This PC"
          bare
          className="rounded-none border-0 shadow-none"
        >
          <div className="space-y-0.5 text-[12px]">
            {folders.map((f) =>
              f === target ? (
                <Mark key={f} n={1} className="inline-flex">
                  <span className="flex items-center gap-2 bg-[#cce8ff] px-2 py-0.5">📁 {f}</span>
                </Mark>
              ) : (
                <p key={f} className="flex items-center gap-2 px-2 py-0.5">
                  📁 {f}
                </p>
              )
            )}
          </div>
        </Explorer>
        <div className="flex items-center gap-2 border-t border-[#e5e5e5] bg-[#f3f3f3] px-4 py-3 text-[12px]">
          Folder:
          <TextField value={target} className="flex-1" />
          <Mark n={2}>
            <WinButton primary>Select Folder</WinButton>
          </Mark>
          <WinButton>Cancel</WinButton>
        </div>
      </WinWindow>
    )
  }
  const markHome = os === "mac" && inside === "home"
  const n = (k: number) => (markHome ? k : k - 1)
  return (
    <MacWindow title={os === "linux" ? "Open Folder" : undefined} className="w-[620px]">
      <div className="flex">
        <div className="w-40 shrink-0 space-y-0.5 bg-[#f0f0f0] px-2 py-3 text-[12px]">
          {["Recents", "Applications", "Desktop", "Documents", "Downloads", "asha"].map((p) =>
            markHome && p === "asha" ? (
              <Mark key={p} n={1} badge="r" className="mr-6">
                <p className="rounded-md bg-black/10 px-2 py-[3px]">🏠 {p}</p>
              </Mark>
            ) : (
              <p key={p} className={cn("rounded-md px-2 py-[3px]", p === "asha" && inside === "devvy" && "bg-black/5")}>
                {p}
              </p>
            )
          )}
        </div>
        <div className="flex-1">
          <p className="border-b border-black/5 px-4 py-2 text-[12.5px] font-semibold">{inside === "home" ? "asha" : "devvy"}</p>
          <div className="min-h-[180px] space-y-0.5 p-3 text-[12px]">
            {folders.map((f) =>
              f === target ? (
                <Mark key={f} n={n(2)} className="block">
                  <p className="flex items-center gap-2 rounded bg-[#0a84ff] px-2 py-0.5 text-white">📁 {f}</p>
                </Mark>
              ) : (
                <p key={f} className="flex items-center gap-2 px-2 py-0.5">
                  📁 {f}
                </p>
              )
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-black/5 px-4 py-3">
            <MacButton>Cancel</MacButton>
            <Mark n={n(3)}>
              <MacButton primary>Open</MacButton>
            </Mark>
          </div>
        </div>
      </div>
    </MacWindow>
  )
}

const homeForPicker = (os: OS) => (os === "windows" ? [...homeWinFolders, "devvy"] : [...homeMacFolders, "devvy"])

const vscodePickDevvy: Screen = (os) => pickFolder(os, "home", "devvy", homeForPicker(os))
const vscodePickProject: Screen = (os) => {
  // On Mac/Linux the project picker starts inside devvy, so markers are (1) folder, (2) Open.
  if (os === "windows") return pickFolder(os, "devvy", "my-fullstack-app", ["my-fullstack-app"])
  return pickFolder(os === "mac" ? "linux" : os, "devvy", "my-fullstack-app", ["my-fullstack-app"])
}

const vscodeTrust: Screen = (os) => <VSCode os={os} folder="devvy" tree={[]} overlay={<TrustDialog folder="asha" mark={1} />} />

export const extensionList = (
  first: {
    name: string
    publisher: string
    desc: string
    color: string
    letter: string
  },
  mark?: number
) => [
  { ...first, mark },
  {
    name: "Prettier ESLint",
    publisher: "Rebecca Vest",
    desc: "A Visual Studio Extension to format JavaScript…",
    color: "#4b32c3",
    letter: "P",
  },
  {
    name: "ESLint Chinese Rules",
    publisher: "maggie",
    desc: "ESLint rules explained in Chinese",
    color: "#666",
    letter: "E",
  },
]

const vscodeExtensions: Screen = (os) => (
  <VSCode
    os={os}
    folder="devvy"
    tree={[]}
    sidebar="extensions"
    marks={{ extensionsIcon: 1, extensionsSearch: 2 }}
    extensions={{
      query: "ESLint",
      items: extensionList(
        {
          name: "ESLint",
          publisher: "Microsoft",
          desc: "Integrates ESLint JavaScript into VS Code.",
          color: "#4b32c3",
          letter: "E",
        },
        3
      ),
    }}
  />
)

export const terminalMenu = (os: OS): MenuItem[] => [
  {
    label: "New Terminal",
    shortcut: os === "mac" ? "⌃⇧`" : "Ctrl+Shift+`",
    mark: 2,
  },
  { label: "Split Terminal", shortcut: os === "mac" ? "⌘\\" : "Ctrl+Shift+5" },
  "sep",
  { label: "Run Task…" },
  { label: "Run Build Task…", shortcut: os === "mac" ? "⇧⌘B" : "Ctrl+Shift+B" },
  "sep",
  { label: "Configure Tasks…" },
]

const vscodeNewTerminal: Screen = (os) => <VSCode os={os} folder="devvy" tree={[]} menu={{ name: "Terminal", mark: 1, items: terminalMenu(os) }} />

const vscodeFirstCommands: Screen = (os) => term(os, "devvy", [{ cmd: "pwd" }, ...pwdOut(os, "devvy"), { cmd: "ls" }, { cmd: "" }], { tree: [] })

/* ------------------------------------------------------------------ */
/* Part 3 — Git                                                        */
/* ------------------------------------------------------------------ */

const gitMacPrompt: Screen = (os) =>
  os === "mac"
    ? term(
        os,
        "devvy",
        [
          { cmd: "git --version" },
          {
            out: "xcode-select: note: No developer tools were found, requesting install.",
          },
        ],
        {
          tree: [],
          overlay: (
            <MacDialog
              icon={
                <span className="flex size-14 items-center justify-center rounded-xl bg-[#2b2b2b] text-white">
                  <TerminalIcon className="size-8" />
                </span>
              }
              title="The “git” command requires the command line developer tools. Would you like to install the tools now?"
              text="Choose Install to download and install the command line developer tools now."
              buttons={[{ label: "Get Xcode" }, { label: "Not Now" }, { label: "Install", primary: true, mark: 1 }]}
            />
          ),
        }
      )
    : null

const gitMacInstalling: Screen = (os) =>
  os === "mac" ? (
    <div className="flex justify-center">
      <MacDialog
        icon={<Check className="size-12 text-[#28c840]" />}
        title="The software was installed."
        text="The command line developer tools are ready to use."
        buttons={[{ label: "Done", primary: true, mark: 1 }]}
      />
    </div>
  ) : null

const gitWinDownload: Screen = (os) =>
  os === "windows" ? (
    <Browser os="windows" url="git-scm.com/downloads/win" tab="Git - Downloading Package" tabIcon={<SiGit className="size-3.5 text-[#f05032]" />}>
      <div className="bg-[#fcfcfa] px-10 py-8">
        <p className="flex items-center gap-2 text-[22px] font-semibold text-[#f05032]">
          <SiGit className="size-7" /> git
        </p>
        <p className="mt-5 text-[20px] text-[#0388a6]">Download for Windows</p>
        <p className="mt-3 text-[13px] text-[#4e443c]">
          <Mark n={1} className="inline-block">
            <span className="text-[#0388a6] underline">Click here to download</span>
          </Mark>{" "}
          the latest (2.x) x64 version of Git for Windows. This is the most recent maintained build.
        </p>
        <p className="mt-4 text-[13px] text-[#4e443c]">Other Git for Windows downloads: Standalone Installer, Portable (“thumbdrive edition”)…</p>
      </div>
    </Browser>
  ) : null

const gitIcon = <SiGit className="size-4 text-[#f05032]" />

const gitWinStart: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Git 2.x Setup"
      icon={gitIcon}
      heading="Information"
      sub="Please read the following important information before continuing."
      nextMark={1}
      back={false}
    >
      <div className="h-32 overflow-hidden rounded border border-[#c8c8c8] bg-white p-2 text-[11px] leading-snug text-[#444]">
        GNU General Public License — Version 2, June 1991. Copyright (C) 1989, 1991 Free Software Foundation, Inc. Everyone is permitted to copy and
        distribute verbatim copies of this license document, but changing it is not allowed…
      </div>
      <p className="mt-3 text-[#444]">When you are ready to continue with Setup, click Next.</p>
    </Wizard>
  ) : null

const gitWinEditor: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Git 2.x Setup"
      icon={gitIcon}
      heading="Choosing the default editor used by Git"
      sub="Which editor would you like Git to use?"
      nextMark={2}
    >
      <Mark n={1} className="block">
        <div className="flex h-7 items-center justify-between rounded border border-[#8a8a8a] bg-white px-2">
          Use Visual Studio Code as Git&apos;s default editor
          <span className="text-[10px]">▼</span>
        </div>
      </Mark>
      <p className="mt-4 leading-relaxed text-[#444]">
        Use Visual Studio Code as Git&apos;s default editor. Visual Studio Code is an Open Source, lightweight and powerful editor running as a
        desktop application.
      </p>
    </Wizard>
  ) : null

const gitWinBranch: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Git 2.x Setup"
      icon={gitIcon}
      heading="Adjusting the name of the initial branch in new repositories"
      sub="What would you like Git to name the initial branch after “git init”?"
      nextMark={3}
    >
      <Radio label="Let Git decide" />
      <p className="mt-1 ml-6 text-[11px] text-[#555]">Let Git use its default branch name (currently: “master”) for the initial branch.</p>
      <Mark n={1} className="mt-3 inline-block pr-1">
        <Radio checked label="Override the default branch name for new repositories" />
      </Mark>
      <p className="mt-1 ml-6 text-[11px] text-[#555]">
        NEW! Many teams already renamed their default branches; common choices are “main”, “trunk” and “development”.
      </p>
      <Mark n={2} className="mt-2 ml-6 inline-block">
        <TextField value="main" className="w-40" />
      </Mark>
    </Wizard>
  ) : null

const gitWinPath: Screen = (os) =>
  os === "windows" ? (
    <Wizard title="Git 2.x Setup" icon={gitIcon} heading="Adjusting your PATH environment" sub="How would you like to use Git from the command line?">
      <Radio label="Use Git from Git Bash only" />
      <p className="mt-1 mb-3 ml-6 text-[11px] text-[#555]">This is the most cautious choice as your PATH will not be modified at all.</p>
      <Mark n={1} className="inline-block pr-1">
        <Radio checked label={<span className="font-semibold">Git from the command line and also from 3rd-party software</span>} />
      </Mark>
      <p className="mt-1 mb-3 ml-6 text-[11px] text-[#555]">
        (Recommended) This option adds only some minimal Git wrappers to your PATH to avoid cluttering your environment.
      </p>
      <Radio label="Use Git and optional Unix tools from the Command Prompt" />
    </Wizard>
  ) : null

export const fileMenu = (os: OS, exitMark?: number): MenuItem[] => [
  { label: "New Text File", shortcut: os === "mac" ? "⌘N" : "Ctrl+N" },
  { label: "New File…", shortcut: os === "mac" ? "⌃⌥⌘N" : "Ctrl+Alt+Win+N" },
  { label: "New Window", shortcut: os === "mac" ? "⇧⌘N" : "Ctrl+Shift+N" },
  "sep",
  { label: "Open File…", shortcut: os === "mac" ? "⌘O" : "Ctrl+O" },
  { label: "Open Folder…", shortcut: os === "mac" ? "⌘K ⌘O" : "Ctrl+K Ctrl+O" },
  { label: "Open Recent", sub: true },
  "sep",
  { label: "Save", shortcut: os === "mac" ? "⌘S" : "Ctrl+S" },
  { label: "Auto Save" },
  "sep",
  { label: "Close Folder", shortcut: os === "mac" ? "⌘K F" : "Ctrl+K F" },
  ...(os === "mac" ? [] : (["sep", { label: "Exit", mark: exitMark }] as MenuItem[])),
]

const vscodeExit: Screen = (os) =>
  os === "windows" ? <VSCode os={os} folder="devvy" tree={[]} menu={{ name: "File", mark: 1, items: fileMenu(os, 2) }} /> : null

const gitLinux: Screen = (os) =>
  os === "linux"
    ? term(
        os,
        "devvy",
        [
          { cmd: "sudo apt update" },
          { out: "[sudo] password for asha:" },
          { out: "Reading package lists... Done" },
          { cmd: "sudo apt install -y git" },
          { out: "The following NEW packages will be installed:" },
          { out: "  git git-man liberror-perl" },
          { out: "Setting up git (1:2.43.0-1ubuntu7) ..." },
          { cmd: "" },
        ],
        { tree: [] }
      )
    : null

const gitVersion: Screen = (os) =>
  term(
    os,
    "devvy",
    [
      { cmd: "git --version" },
      {
        out: os === "mac" ? "git version 2.39.5 (Apple Git-154)" : os === "windows" ? "git version 2.47.1.windows.1" : "git version 2.43.0",
        mark: 1,
      },
      { cmd: "" },
    ],
    { tree: [] }
  )

const gitConfig: Screen = (os) =>
  term(
    os,
    "devvy",
    [
      { cmd: 'git config --global user.name "Asha Rao"' },
      { cmd: 'git config --global user.email "asha@example.com"' },
      { cmd: "git config --global init.defaultBranch main" },
      { cmd: "git config --global --list" },
      { out: "user.name=Asha Rao" },
      { out: "user.email=asha@example.com" },
      { out: "init.defaultbranch=main", mark: 1 },
      { cmd: "" },
    ],
    { tree: [], panel: 0.7 }
  )

/* ------------------------------------------------------------------ */
/* Part 4 — GitHub                                                     */
/* ------------------------------------------------------------------ */

/** GitHub's dark pages (sign-up, device activation). */
export function GitHubDark({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#0d1117] px-10 py-8 text-[#e6edf3]">{children}</div>
}

function GhField({ label, value, mark, password }: { label: string; value: string; mark?: number; password?: boolean }) {
  const field = (
    <div>
      <p className="mb-1 text-[12px] font-semibold">
        {label}
        <span className="text-[#f85149]">*</span>
      </p>
      <div className="flex h-8 items-center rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-[13px]">
        {password ? "•".repeat(value.length) : value}
      </div>
    </div>
  )
  return mark !== undefined ? <Mark n={mark}>{field}</Mark> : field
}

const githubSignup: Screen = (os) => (
  <Browser os={os} url="github.com/signup" tab="Sign up for GitHub" tabIcon={<SiGithub className="size-3.5" />}>
    <GitHubDark>
      <div className="mx-auto w-[360px]">
        <SiGithub className="mx-auto size-10" />
        <p className="mt-4 text-center text-[20px] font-semibold">Sign up for GitHub</p>
        <div className="mt-6 space-y-4">
          <GhField label="Email" value="asha@example.com" />
          <GhField label="Password" value="correcthorse1" password />
          <GhField label="Username" value={USER} mark={1} />
          <p className="text-[11px] text-[#7d8590]">Username may only contain alphanumeric characters or single hyphens.</p>
          <Mark n={2}>
            <div className="flex h-9 items-center justify-center rounded-md bg-[#238636] text-[13px] font-semibold text-white">Continue ›</div>
          </Mark>
        </div>
      </div>
    </GitHubDark>
  </Browser>
)

const ghDownload: Screen = (os) =>
  os === "linux" ? null : (
    <Browser os={os} url="cli.github.com" tab="GitHub CLI | Take GitHub to the command line" tabIcon={<SiGithub className="size-3.5" />}>
      <GitHubDark>
        <p className="text-[13px] text-[#7d8590]">GitHub CLI</p>
        <p className="mt-3 text-[30px] leading-tight font-semibold">Take GitHub to the command line</p>
        <p className="mt-3 w-[440px] text-[14px] text-[#7d8590]">GitHub CLI brings GitHub to your terminal. Free and open source.</p>
        <div className="mt-6 flex gap-3">
          {(["mac", "windows"] as const).map((o) => {
            const btn = (
              <span className="flex h-10 items-center gap-2 rounded-md bg-white px-4 text-[13px] font-semibold text-[#0d1117]">
                <Download className="size-4" />
                Download for {o === "mac" ? "Mac" : "Windows"}
              </span>
            )
            return o === os ? (
              <Mark key={o} n={1}>
                {btn}
              </Mark>
            ) : (
              <span key={o} className="opacity-60">
                {btn}
              </span>
            )
          })}
        </div>
      </GitHubDark>
    </Browser>
  )

const ghMacInstaller: Screen = (os) =>
  os === "mac" ? (
    <MacInstaller app="GitHub CLI" step={0} heading="Welcome to the GitHub CLI Installer" mark={1}>
      You will be guided through the steps necessary to install this software.
    </MacInstaller>
  ) : null

const ghWinInstaller: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="GitHub CLI Setup"
      icon={<SiGithub className="size-4" />}
      heading="Welcome to the GitHub CLI Setup Wizard"
      nextMark={1}
      back={false}
    >
      <p>The Setup Wizard will install GitHub CLI on your computer. Click Next to continue or Cancel to exit the Setup Wizard.</p>
    </Wizard>
  ) : null

const ghLinux: Screen = (os) =>
  os === "linux"
    ? term(
        os,
        "devvy",
        [
          { cmd: "sudo apt install -y gh" },
          { out: "The following NEW packages will be installed:" },
          { out: "  gh" },
          { out: "Setting up gh ..." },
          { cmd: "" },
        ],
        { tree: [] }
      )
    : null

const ghAuthLogin: Screen = (os) =>
  term(
    os,
    "devvy",
    [
      { cmd: "gh auth login" },
      { out: "? Where do you use GitHub? GitHub.com", tone: "accent" },
      {
        out: "? What is your preferred protocol for Git operations on this host? HTTPS",
        tone: "accent",
      },
      {
        out: "? Authenticate Git with your GitHub credentials? Yes",
        tone: "accent",
      },
      {
        out: "? How would you like to authenticate GitHub CLI? Login with a web browser",
        tone: "accent",
      },
      { out: "" },
      {
        out: "! First copy your one-time code: 3F9A-7C2D",
        tone: "warn",
        mark: 1,
      },
      {
        out: "Press Enter to open https://github.com/login/device in your browser...",
      },
    ],
    { tree: [], panel: 0.72 }
  )

const ghDevice: Screen = (os) => (
  <Browser os={os} url="github.com/login/device" tab="Device Activation" tabIcon={<SiGithub className="size-3.5" />}>
    <GitHubDark>
      <div className="mx-auto w-[400px] text-center">
        <SiGithub className="mx-auto size-10" />
        <p className="mt-4 text-[20px] font-semibold">Device Activation</p>
        <div className="mt-5 rounded-md border border-[#30363d] bg-[#161b22] p-5">
          <p className="text-[13px]">Enter the code displayed on your device</p>
          <Mark n={1} className="mt-4 inline-block">
            <div className="flex items-center gap-1.5" style={{ fontFamily: MONO_FONT }}>
              {"3F9A-7C2D".split("").map((ch, i) =>
                ch === "-" ? (
                  <span key={i} className="px-1">
                    -
                  </span>
                ) : (
                  <span key={i} className="flex h-9 w-7 items-center justify-center rounded-md border border-[#30363d] bg-[#0d1117] text-[15px]">
                    {ch}
                  </span>
                )
              )}
            </div>
          </Mark>
          <Mark n={2} className="mt-5 block">
            <div className="flex h-9 items-center justify-center rounded-md bg-[#238636] text-[13px] font-semibold text-white">Continue</div>
          </Mark>
        </div>
      </div>
    </GitHubDark>
  </Browser>
)

const ghAuthorize: Screen = (os) => (
  <Browser os={os} url="github.com/login/device/select_account" tab="Authorize GitHub CLI" tabIcon={<SiGithub className="size-3.5" />}>
    <GitHubDark>
      <div className="mx-auto w-[420px]">
        <div className="flex items-center justify-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-white text-[#0d1117]">
            <TerminalIcon className="size-6" />
          </span>
          <span className="text-[#7d8590]">• • •</span>
          <span className="flex size-12 items-center justify-center rounded-full bg-[#1f6feb] text-[18px] font-bold">A</span>
        </div>
        <p className="mt-4 text-center text-[20px]">
          Authorize <span className="font-semibold">GitHub CLI</span>
        </p>
        <div className="mt-5 rounded-md border border-[#30363d] bg-[#161b22] p-5 text-[12.5px]">
          <p>
            <span className="font-semibold">GitHub CLI</span> by <span className="text-[#4493f8]">github</span> wants to access your{" "}
            <span className="font-semibold">{USER}</span> account
          </p>
          <div className="mt-3 space-y-1.5 text-[#7d8590]">
            <p>• Repositories — public and private</p>
            <p>• Gists — read and write access</p>
            <p>• Organizations and teams — read-only access</p>
          </div>
          <Mark n={1} className="mt-5 block">
            <div className="flex h-9 items-center justify-center rounded-md bg-[#238636] text-[13px] font-semibold text-white">Authorize github</div>
          </Mark>
        </div>
      </div>
    </GitHubDark>
  </Browser>
)

const ghStatus: Screen = (os) =>
  term(
    os,
    "devvy",
    [
      { cmd: "gh auth status" },
      { out: "github.com", tone: "bold" },
      {
        out: `  ✓ Logged in to github.com account ${USER} (keyring)`,
        tone: "ok",
        mark: 1,
      },
      { out: "  - Active account: true" },
      { out: "  - Git operations protocol: https" },
      { out: "  - Token: gho_************************************" },
      { out: "  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'" },
    ],
    { tree: [], panel: 0.66 }
  )

/* ------------------------------------------------------------------ */
/* Part 5 — Node.js                                                    */
/* ------------------------------------------------------------------ */

const nodeIcon = <SiNodedotjs className="size-4 text-[#5fa04e]" />

const nodeDownload: Screen = (os) =>
  os === "linux" ? null : (
    <Browser os={os} url="nodejs.org/en/download" tab="Node.js — Download Node.js®" tabIcon={nodeIcon}>
      <div className="px-10 py-8">
        <p className="text-[24px] font-semibold">Download Node.js®</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px]">
          Get Node.js®
          <Mark n={1}>
            <span className="flex h-8 items-center gap-2 rounded-md border border-[#d0d7de] bg-white px-3 font-semibold">v24.x (LTS) ▾</span>
          </Mark>
          for
          <span className="flex h-8 items-center rounded-md border border-[#d0d7de] px-3">{os === "mac" ? "macOS" : "Windows"} ▾</span>
          using
          <span className="flex h-8 items-center rounded-md border border-[#d0d7de] px-3">{os === "mac" ? "nvm" : "Chocolatey"} ▾</span>
        </div>
        <div className="mt-4 h-16 rounded-md bg-[#0d121c] p-3 text-[11px] text-[#9ca3af]" style={{ fontFamily: MONO_FONT }}>
          # Download and install Node.js…
        </div>
        <p className="mt-6 text-[13px]">
          Or get a prebuilt Node.js® for {os === "mac" ? "macOS" : "Windows"} running a {os === "mac" ? "ARM64" : "x64"} architecture.
        </p>
        <div className="mt-3 flex gap-3">
          <Mark n={2}>
            <span className="flex h-9 items-center gap-2 rounded-md bg-[#417e38] px-4 text-[13px] font-semibold text-white">
              <Download className="size-4" />
              {os === "mac" ? "macOS Installer (.pkg)" : "Windows Installer (.msi)"}
            </span>
          </Mark>
          <span className="flex h-9 items-center gap-2 rounded-md border border-[#d0d7de] px-4 text-[13px]">Standalone Binary</span>
        </div>
      </div>
    </Browser>
  )

const nodeMacInstaller: Screen = (os) =>
  os === "mac" ? (
    <MacInstaller app="Node.js" step={0} heading="Welcome to the Node.js Installer" mark={1}>
      This package will install Node.js and npm into /usr/local/bin.
    </MacInstaller>
  ) : null

const nodeWinLicense: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Node.js Setup"
      icon={nodeIcon}
      heading="End-User License Agreement"
      sub="Please read the following license agreement carefully"
      nextMark={2}
    >
      <div className="h-28 overflow-hidden rounded border border-[#c8c8c8] bg-white p-2 text-[11px] leading-snug text-[#444]">
        Node.js is licensed for use as follows: Copyright Node.js contributors. All rights reserved. Permission is hereby granted, free of charge…
      </div>
      <Mark n={1} className="mt-3 inline-block pr-1">
        <Checkbox checked label="I accept the terms in the License Agreement" />
      </Mark>
    </Wizard>
  ) : null

const nodeWinTools: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Node.js Setup"
      icon={nodeIcon}
      heading="Tools for Native Modules"
      sub="Optionally install the tools necessary to compile native modules."
      nextMark={2}
    >
      <p className="leading-relaxed text-[#444]">
        Some npm modules need to be compiled from C/C++ when installing. If you want to be able to install such modules, some tools (Python and Visual
        Studio Build Tools) need to be installed.
      </p>
      <Mark n={1} className="mt-4 inline-block pr-1">
        <Checkbox label="Automatically install the necessary tools. Note that this will also install Chocolatey." />
      </Mark>
      <p className="mt-3 text-[11px] font-semibold text-[#c42b1c]">Leave this unticked.</p>
    </Wizard>
  ) : null

const nodeLinux: Screen = (os) =>
  os === "linux"
    ? term(
        os,
        "devvy",
        [
          { cmd: "sudo apt install -y curl" },
          { out: "Setting up curl (8.5.0-2ubuntu10.6) ..." },
          {
            cmd: "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash",
          },
          { out: "=> Downloading nvm from git to '/home/asha/.nvm'" },
          {
            out: "=> Close and reopen your terminal to start using nvm",
            tone: "warn",
          },
          { cmd: "nvm install --lts" },
          { out: "Installing latest LTS version." },
          { out: "Now using node v24.11.1 (npm v11.6.2)", tone: "ok" },
        ],
        { tree: [] }
      )
    : null

const nodeWinPolicy: Screen = (os) =>
  os === "windows"
    ? term(
        os,
        "devvy",
        [
          { cmd: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned" },
          { out: "" },
          { out: "Execution Policy Change", tone: "bold" },
          {
            out: "The execution policy helps protect you from scripts that you do not trust. Do you want to change the execution policy?",
          },
          {
            out: '[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"): Y',
            mark: 1,
          },
          { cmd: "npm -v" },
          { out: "11.6.2", tone: "ok" },
        ],
        { tree: [], panel: 0.72 }
      )
    : null

const nodeVersion: Screen = (os) =>
  term(os, "devvy", [{ cmd: "node -v" }, { out: "v24.11.1", tone: "ok", mark: 1 }, { cmd: "npm -v" }, { out: "11.6.2", tone: "ok" }, { cmd: "" }], {
    tree: [],
  })

/* ------------------------------------------------------------------ */
/* Part 6 — PostgreSQL                                                 */
/* ------------------------------------------------------------------ */

const pgIcon = (size = "size-4") => <SiPostgresql className={cn(size, "text-[#336791]")} />

const pgMacDownload: Screen = (os) =>
  os === "mac" ? (
    <Browser os="mac" url="postgresapp.com/downloads.html" tab="Postgres.app – Downloads" tabIcon={pgIcon("size-3.5")}>
      <div className="px-10 py-8">
        <p className="flex items-center gap-2 text-[22px] font-semibold">{pgIcon("size-7")} Postgres.app</p>
        <p className="mt-6 text-[17px] font-semibold">Latest Release</p>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-[#e3e3e3] p-4">
          <div>
            <p className="text-[14px] font-semibold">Postgres.app with PostgreSQL 18</p>
            <p className="text-[12px] text-[#666]">Universal (Apple Silicon and Intel) · macOS 11 or later</p>
          </div>
          <Mark n={1}>
            <span className="flex h-8 items-center gap-1.5 rounded-md bg-[#336791] px-4 text-[12.5px] font-semibold text-white">
              <Download className="size-3.5" />
              Download
            </span>
          </Mark>
        </div>
        <p className="mt-4 text-[12px] text-[#666]">Additional releases…</p>
      </div>
    </Browser>
  ) : null

const pgMacDrag: Screen = (os) =>
  os === "mac" ? (
    <MacWindow title="Postgres" className="mx-auto w-[460px]">
      <div className="flex items-center justify-center gap-12 bg-[#f7f7f7] py-12">
        <Mark n={1}>
          <div className="flex flex-col items-center gap-1">
            {pgIcon("size-16")}
            <span className="text-[12px]">Postgres</span>
          </div>
        </Mark>
        <ArrowRight className="size-8 text-[#8a8a8a]" />
        <Mark n={2}>
          <div className="flex flex-col items-center gap-1">
            <span className="flex size-16 items-center justify-center rounded-xl bg-[#5aaeef] text-white">
              <span className="text-[24px]">A</span>
            </span>
            <span className="text-[12px]">Applications</span>
          </div>
        </Mark>
      </div>
    </MacWindow>
  ) : null

const pgMacInitialize: Screen = (os) =>
  os === "mac" ? (
    <MacWindow title="Postgres" className="mx-auto w-[560px]">
      <div className="flex min-h-[230px]">
        <div className="w-44 shrink-0 border-r border-black/5 bg-[#f4f4f4] p-3 text-[12px]">
          <p className="rounded-md bg-black/10 px-2 py-1 font-semibold">PostgreSQL 18</p>
          <p className="px-2 text-[11px] text-[#8a8a8a]">Not running</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          {pgIcon("size-16")}
          <p className="text-[13px] font-semibold">Empty data directory</p>
          <p className="text-[11.5px] text-[#666]">Click Initialize to create a new server.</p>
          <Mark n={1}>
            <MacButton primary>Initialize</MacButton>
          </Mark>
        </div>
      </div>
    </MacWindow>
  ) : null

const pgWinDownload: Screen = (os) =>
  os === "windows" ? (
    <Browser os="windows" url="enterprisedb.com/downloads/postgres-postgresql-downloads" tab="Download PostgreSQL" tabIcon={pgIcon("size-3.5")}>
      <div className="px-8 py-6">
        <p className="text-[20px] font-semibold">Download PostgreSQL</p>
        <p className="mt-1 text-[12px] text-[#555]">Open source PostgreSQL packages and installers from EDB</p>
        <table className="mt-5 w-full border-collapse text-left text-[12px]">
          <thead>
            <tr className="bg-[#1d2b45] text-white">
              {["PostgreSQL Version", "Linux x86-64", "Mac OS X", "Windows x86-64", "Windows x86-32"].map((h) => (
                <th key={h} className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["18.1", "17.7", "16.11"].map((v, i) => (
              <tr key={v} className="border-b border-[#e3e3e3]">
                <td className="px-3 py-2.5 font-semibold">{v}</td>
                <td className="px-3 text-[#666]">*</td>
                <td className="px-3">
                  <Download className="size-4 text-[#1a73e8]" />
                </td>
                <td className="px-3">
                  {i === 0 ? (
                    <Mark n={1} className="inline-block">
                      <Download className="size-4 text-[#1a73e8]" />
                    </Mark>
                  ) : (
                    <Download className="size-4 text-[#1a73e8]" />
                  )}
                </td>
                <td className="px-3 text-[#666]">Not supported</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Browser>
  ) : null

const pgWinComponents: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Setup"
      icon={pgIcon()}
      heading="Select Components"
      sub="Select the components you want to install; clear the components you do not want to install."
      nextMark={2}
    >
      <Mark n={1} className="inline-block pr-2">
        <div className="space-y-2">
          {["PostgreSQL Server", "pgAdmin 4", "Stack Builder", "Command Line Tools"].map((c) => (
            <Checkbox key={c} checked label={c} />
          ))}
        </div>
      </Mark>
    </Wizard>
  ) : null

const pgWinPassword: Screen = (os) =>
  os === "windows" ? (
    <Wizard title="Setup" icon={pgIcon()} heading="Password" nextMark={2}>
      <p>Please provide a password for the database superuser (postgres).</p>
      <Mark n={1} className="mt-4 inline-block pr-2">
        <div className="grid grid-cols-[110px_220px] items-center gap-2">
          <span>Password</span>
          <TextField value="devvy123" password />
          <span>Retype password</span>
          <TextField value="devvy123" password />
        </div>
      </Mark>
    </Wizard>
  ) : null

const pgWinFinish: Screen = (os) =>
  os === "windows" ? (
    <Wizard title="Setup" icon={pgIcon()} heading="Completing the PostgreSQL Setup Wizard" next="Finish" nextMark={2} back={false}>
      <p>Setup has finished installing PostgreSQL on your computer.</p>
      <Mark n={1} className="mt-5 inline-block pr-1">
        <Checkbox label="Launch Stack Builder at exit?" />
      </Mark>
      <p className="mt-2 ml-6 text-[11px] text-[#555]">
        Stack Builder may be used to download and install additional tools, drivers and applications.
      </p>
    </Wizard>
  ) : null

const pgLinux: Screen = (os) =>
  os === "linux"
    ? term(
        os,
        "devvy",
        [
          { cmd: "sudo apt install -y postgresql" },
          { out: "Setting up postgresql-16 ..." },
          { out: "Setting up postgresql ..." },
          {
            cmd: "sudo -u postgres psql -c \"ALTER USER postgres PASSWORD 'devvy123';\"",
          },
          { out: "ALTER ROLE", tone: "ok" },
          { cmd: "" },
        ],
        { tree: [] }
      )
    : null

/* ------------------------------------------------------------------ */
/* Part 7 — the project                                                */
/* ------------------------------------------------------------------ */

const repoCreate: Screen = (os) =>
  term(
    os,
    "devvy",
    [
      { cmd: "gh repo create my-fullstack-app --public --clone" },
      {
        out: `✓ Created repository ${USER}/my-fullstack-app on GitHub`,
        tone: "ok",
        mark: 1,
      },
      { out: `  https://github.com/${USER}/my-fullstack-app` },
      { out: "Cloning into 'my-fullstack-app'..." },
      {
        out: "warning: You appear to have cloned an empty repository.",
        tone: "warn",
      },
      { cmd: "" },
    ],
    { tree: [{ name: "my-fullstack-app", dir: true }] }
  )

const projectTerminal: Screen = (os) =>
  term(os, PROJECT, [{ cmd: "pwd" }, ...pwdOut(os, PROJECT), { cmd: "" }], {
    tree: projectTree("empty"),
  })

const viteCreate: Screen = (os) =>
  term(
    os,
    PROJECT,
    [
      { cmd: "npx create-vite@latest client --template react-ts" },
      { out: "Need to install the following packages:" },
      { out: "create-vite@8.x.x" },
      { out: "Ok to proceed? (y) y", mark: 1 },
      { out: "" },
      { out: "◇  Scaffolding project in ./client..." },
      { out: "└  Done. Now run:", tone: "ok" },
      { out: "     cd client" },
      { out: "     npm install" },
      { out: "     npm run dev" },
    ],
    { tree: [{ name: "client", dir: true, mark: 2 }], panel: 0.74 }
  )

const clientTree: TreeNode[] = [
  { name: "client", dir: true, open: true },
  { name: "node_modules", dir: true, depth: 1 },
  { name: "public", dir: true, depth: 1 },
  { name: "src", dir: true, depth: 1 },
  { name: ".gitignore", depth: 1 },
  { name: "index.html", depth: 1 },
  { name: "package.json", depth: 1 },
  { name: "tsconfig.json", depth: 1 },
  { name: "vite.config.ts", depth: 1 },
]

const viteRunning: Screen = (os) =>
  term(
    os,
    CLIENT,
    [
      { cmd: "npm install" },
      { out: "added 190 packages, and audited 191 packages in 21s" },
      { out: "found 0 vulnerabilities" },
      { cmd: "npm run dev" },
      { out: "> client@0.0.0 dev" },
      { out: "> vite" },
      { out: "" },
      { out: "  VITE v7.x  ready in 312 ms", tone: "ok" },
      { out: "" },
      { out: "  ➜  Local:   http://localhost:5173/", tone: "accent", mark: 1 },
      { out: "  ➜  Network: use --host to expose" },
    ],
    { tree: clientTree, panel: 0.74 }
  )

const viteBrowser: Screen = (os) => (
  <Browser os={os} url="localhost:5173" tab="Vite + React + TS" tabIcon={<SiVite className="size-3.5 text-[#646cff]" />}>
    <div className="flex flex-col items-center bg-[#242424] px-10 py-10 text-[rgba(255,255,255,0.87)]">
      <div className="flex gap-10">
        <SiVite className="size-20 text-[#646cff]" />
        <SiReact className="size-20 text-[#61dafb]" />
      </div>
      <p className="mt-6 text-[36px] font-bold">Vite + React</p>
      <div className="mt-6 flex flex-col items-center gap-4">
        <Mark n={1}>
          <span className="block rounded-lg border border-transparent bg-[#1a1a1a] px-5 py-2.5 text-[15px] font-medium">count is 3</span>
        </Mark>
        <p className="text-[14px]">
          Edit <code className="font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-6 text-[14px] text-[#888]">Click on the Vite and React logos to learn more</p>
    </div>
  </Browser>
)

export const shellName = (os: OS) => (os === "windows" ? "powershell" : os === "mac" ? "zsh" : "bash")

const terminalPlus: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={[{ name: "client", dir: true }]}
    terminal={{
      cwd: PROJECT,
      lines: [{ cmd: "" }],
      plusMark: 1,
      list: ["node", shellName(os)],
      listMark: 2,
    }}
    panel={0.55}
  />
)

const serverInstall: Screen = (os) =>
  term(
    os,
    SERVER,
    [
      { cmd: "npm init -y" },
      { out: "Wrote to package.json" },
      { cmd: "npm install express cors dotenv zod bcrypt jsonwebtoken" },
      { out: "added 92 packages, and audited 93 packages in 6s", mark: 1 },
      {
        cmd: "npm install -D typescript tsx @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken",
      },
      { out: "added 22 packages, and audited 115 packages in 4s" },
      { cmd: "npm install @prisma/client@6" },
      { out: "added 2 packages, and audited 117 packages in 3s" },
      { cmd: "npm install -D prisma@6" },
      { out: "added 6 packages, and audited 123 packages in 5s" },
      { out: "found 0 vulnerabilities" },
    ],
    { tree: projectTree("server"), panel: 0.78 }
  )

const packageJson: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={projectTree("server", "package.json")}
    editor={{
      tabs: ["package.json"],
      active: "package.json",
      file: "server/package.json",
      lines: [
        "{",
        '  "name": "server",',
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
      ],
      mark: { from: 5, to: 10, n: 1 },
    }}
    height={440}
  />
)

export const explorerContextMenu = (os: OS): MenuItem[] => [
  { label: "New File…", mark: 2 },
  { label: "New Folder…" },
  {
    label: os === "mac" ? "Reveal in Finder" : os === "windows" ? "Reveal in File Explorer" : "Open Containing Folder",
    shortcut: os === "mac" ? "⌥⌘R" : "Shift+Alt+R",
  },
  { label: "Open in Integrated Terminal" },
  "sep",
  { label: "Cut", shortcut: os === "mac" ? "⌘X" : "Ctrl+X" },
  { label: "Copy", shortcut: os === "mac" ? "⌘C" : "Ctrl+C" },
  "sep",
  { label: "Copy Path", shortcut: os === "mac" ? "⌥⌘C" : "Shift+Alt+C" },
  { label: "Rename…", shortcut: os === "mac" ? "↩" : "F2" },
]

const newFile: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={[
      { name: "client", dir: true },
      { name: "server", dir: true, mark: 1, active: true },
    ]}
    contextMenu={{ top: 118, left: 150, items: explorerContextMenu(os) }}
  />
)

const appTs = [
  'import express from "express"',
  'import cors from "cors"',
  "",
  "export const app = express()",
  "",
  "app.use(cors({ origin: process.env.CLIENT_URL }))",
  "app.use(express.json())",
  "",
  "// A tiny route to check the server is alive",
  'app.get("/health", (req, res) => {',
  "  res.json({ ok: true })",
  "})",
]

const editorApp: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={projectTree("src", "app.ts")}
    editor={{
      tabs: ["tsconfig.json", "app.ts"],
      active: "app.ts",
      file: "server/src/app.ts",
      lines: appTs,
    }}
  />
)

const editorIndex: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={projectTree("src", "index.ts")}
    editor={{
      tabs: ["app.ts", "index.ts"],
      active: "index.ts",
      file: "server/src/index.ts",
      lines: [
        'import "dotenv/config"',
        'import { app } from "./app.js"',
        "",
        "const port = Number(process.env.PORT) || 4000",
        "",
        "app.listen(port, () => {",
        '  console.log("API running on http://localhost:" + port)',
        "})",
      ],
    }}
  />
)

const editorSchema: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={projectTree("prisma", "schema.prisma")}
    editor={{
      tabs: ["index.ts", "schema.prisma"],
      active: "schema.prisma",
      file: "server/prisma/schema.prisma",
      lines: [
        "generator client {",
        '  provider = "prisma-client-js"',
        "}",
        "",
        "datasource db {",
        '  provider = "postgresql"',
        '  url      = env("DATABASE_URL")',
        "}",
      ],
    }}
    terminal={{
      cwd: SERVER,
      lines: [
        { cmd: "npx prisma init" },
        {
          out: "✔ Your Prisma schema was created at prisma/schema.prisma",
          tone: "ok",
        },
        { out: "  You can now open it in your favorite editor." },
      ],
    }}
    panel={0.36}
    height={450}
  />
)

const editorEnv: Screen = (os) => {
  const url = os === "mac" ? "postgresql://asha@localhost:5432/devvy_fullstack" : "postgresql://postgres:devvy123@localhost:5432/devvy_fullstack"
  return (
    <VSCode
      os={os}
      folder="my-fullstack-app"
      tree={projectTree("prisma", ".env")}
      editor={{
        tabs: ["schema.prisma", ".env"],
        active: ".env",
        file: "server/.env",
        lines: [`DATABASE_URL="${url}"`, "PORT=4000", 'CLIENT_URL="http://localhost:5173"'],
      }}
      terminal={
        os === "mac"
          ? {
              cwd: SERVER,
              lines: [{ cmd: "whoami" }, { out: "asha", tone: "bold" }, { cmd: "" }],
            }
          : undefined
      }
      panel={0.32}
      height={os === "mac" ? 440 : 380}
    />
  )
}

const prismaMigrate: Screen = (os) =>
  term(
    os,
    SERVER,
    [
      { cmd: "npx prisma migrate dev --name init" },
      { out: "Environment variables loaded from .env" },
      { out: "Prisma schema loaded from prisma/schema.prisma" },
      {
        out: 'Datasource "db": PostgreSQL database "devvy_fullstack", schema "public" at "localhost:5432"',
      },
      { out: "" },
      {
        out: "PostgreSQL database devvy_fullstack created at localhost:5432",
        tone: "ok",
        mark: 1,
      },
      { out: "" },
      {
        out: "Already in sync, no schema change or pending migration was found.",
      },
    ],
    { tree: projectTree("prisma"), panel: 0.72 }
  )

const apiRunning: Screen = (os) =>
  term(
    os,
    SERVER,
    [
      { cmd: "npm run dev" },
      { out: "> server@1.0.0 dev" },
      { out: "> tsx watch src/index.ts" },
      { out: "" },
      { out: "API running on http://localhost:4000", tone: "ok", mark: 1 },
    ],
    { tree: projectTree("prisma") }
  )

const healthBrowser: Screen = (os) => (
  <Browser os={os} url="localhost:4000/health" tab="localhost:4000/health">
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

const editorGitignore: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={projectTree("gitignore", ".gitignore")}
    editor={{
      tabs: [".env", ".gitignore"],
      active: ".gitignore",
      file: "server/.gitignore",
      lines: ["node_modules", ".env", "dist"],
    }}
  />
)

const gitStatus: Screen = (os) =>
  term(
    os,
    PROJECT,
    [
      { cmd: "git add ." },
      { cmd: "git status" },
      { out: "On branch main" },
      { out: "No commits yet" },
      { out: "Changes to be committed:" },
      { out: "        new file:   client/index.html", tone: "ok" },
      { out: "        new file:   client/package.json", tone: "ok" },
      { out: "        new file:   client/src/App.tsx", tone: "ok" },
      { out: "        new file:   server/.gitignore", tone: "ok", mark: 1 },
      { out: "        new file:   server/package.json", tone: "ok" },
      { out: "        new file:   server/src/app.ts", tone: "ok" },
      { out: "        new file:   server/src/index.ts", tone: "ok" },
      { cmd: 'git commit -m "Initial project setup"' },
      { out: "[main (root-commit) 3f9a7c2] Initial project setup" },
      { out: " 24 files changed, 2104 insertions(+)" },
    ],
    { tree: projectTree("gitignore"), panel: 0.82, height: 470 }
  )

const gitPush: Screen = (os) =>
  term(
    os,
    PROJECT,
    [
      { cmd: "git push -u origin main" },
      { out: "Enumerating objects: 34, done." },
      { out: "Writing objects: 100% (34/34), 21.45 KiB | 3.06 MiB/s, done." },
      { out: `To https://github.com/${USER}/my-fullstack-app.git` },
      { out: " * [new branch]      main -> main" },
      {
        out: "branch 'main' set up to track 'origin/main'.",
        tone: "ok",
        mark: 1,
      },
      { cmd: "" },
    ],
    { tree: projectTree("gitignore"), panel: 0.66 }
  )

const githubRepo: Screen = (os) => (
  <Browser os={os} url={`github.com/${USER}/my-fullstack-app`} tab={`${USER}/my-fullstack-app`} tabIcon={<SiGithub className="size-3.5" />}>
    <div className="bg-white px-8 py-6 text-[#1f2328]">
      <p className="flex items-center gap-2 text-[18px]">
        <SiGithub className="size-5" />
        <span className="text-[#0969da]">{USER}</span> / <span className="font-semibold text-[#0969da]">my-fullstack-app</span>
        <span className="rounded-full border border-[#d0d7de] px-2 text-[11px] text-[#59636e]">Public</span>
      </p>
      <div className="mt-5 overflow-hidden rounded-md border border-[#d0d7de]">
        <Mark n={2} className="block rounded-none">
          <div className="flex items-center gap-2 bg-[#f6f8fa] px-4 py-2.5 text-[12.5px]">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#1f6feb] text-[10px] font-bold text-white">A</span>
            <span className="font-semibold">{USER}</span>
            <span>Initial project setup</span>
            <span className="ml-auto text-[#59636e]">3f9a7c2 · 1 minute ago</span>
          </div>
        </Mark>
        <Mark n={1} className="block rounded-none">
          <div>
            {["client", "server"].map((f) => (
              <p key={f} className="flex items-center gap-2 border-t border-[#d0d7de] px-4 py-2 text-[12.5px]">
                <span className="text-[#54aeff]">📁</span> {f}
                <span className="ml-auto text-[#59636e]">Initial project setup</span>
              </p>
            ))}
          </div>
        </Mark>
      </div>
    </div>
  </Browser>
)

/* ------------------------------------------------------------------ */
/* Part 8 — next time, Part 9 — AI tools                               */
/* ------------------------------------------------------------------ */

const openRecent: Screen = (os) => (
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
          { label: `~/devvy/my-fullstack-app`, mark: 2 },
          { label: "~/devvy" },
          "sep",
          { label: "More…" },
        ],
      },
    }}
  />
)

const twoRunning: Screen = (os) => (
  <VSCode
    os={os}
    folder="my-fullstack-app"
    tree={projectTree("gitignore")}
    terminal={{
      cwd: PROJECT,
      list: ["node", "node"],
      lines: [
        { cmd: "cd server" },
        { cmd: "npm run dev", cwd: SERVER },
        { out: "> server@1.0.0 dev" },
        { out: "> tsx watch src/index.ts" },
        { out: "" },
        { out: "API running on http://localhost:4000", tone: "ok" },
      ],
    }}
    panel={0.6}
  />
)

const copilotExtension: Screen = (os) => (
  <VSCode
    os={os}
    folder="devvy"
    tree={[]}
    sidebar="extensions"
    extensions={{
      query: "GitHub Copilot",
      items: [
        {
          name: "GitHub Copilot",
          publisher: "GitHub",
          desc: "Your AI pair programmer",
          color: "#24292f",
          letter: "◉",
          mark: 1,
        },
        {
          name: "GitHub Copilot Chat",
          publisher: "GitHub",
          desc: "AI chat features powered by Copilot",
          color: "#24292f",
          letter: "◉",
        },
      ],
    }}
  />
)

/* ------------------------------------------------------------------ */

export const fullStackScreens: Record<string, Screen> = {
  "folder-home": folderHome,
  "folder-new": folderNew,
  "folder-named": folderNamed,
  "folder-linux": folderLinux,
  "vscode-download": vscodeDownload,
  "vscode-mac-drag": vscodeMacDrag,
  "vscode-mac-gatekeeper": vscodeMacGatekeeper,
  "vscode-win-license": vscodeWinLicense,
  "vscode-win-location": vscodeWinLocation,
  "vscode-win-tasks": vscodeWinTasks,
  "vscode-win-finish": vscodeWinFinish,
  "vscode-linux-install": vscodeLinuxInstall,
  "vscode-welcome": vscodeWelcome,
  "vscode-pick-devvy": vscodePickDevvy,
  "vscode-trust": vscodeTrust,
  "vscode-extensions": vscodeExtensions,
  "vscode-new-terminal": vscodeNewTerminal,
  "vscode-first-commands": vscodeFirstCommands,
  "git-mac-prompt": gitMacPrompt,
  "git-mac-installing": gitMacInstalling,
  "git-win-download": gitWinDownload,
  "git-win-start": gitWinStart,
  "git-win-editor": gitWinEditor,
  "git-win-branch": gitWinBranch,
  "git-win-path": gitWinPath,
  "vscode-exit": vscodeExit,
  "git-linux": gitLinux,
  "git-version": gitVersion,
  "git-config": gitConfig,
  "github-signup": githubSignup,
  "gh-download": ghDownload,
  "gh-mac-installer": ghMacInstaller,
  "gh-win-installer": ghWinInstaller,
  "gh-linux": ghLinux,
  "gh-auth-login": ghAuthLogin,
  "gh-device": ghDevice,
  "gh-authorize": ghAuthorize,
  "gh-status": ghStatus,
  "node-download": nodeDownload,
  "node-mac-installer": nodeMacInstaller,
  "node-win-license": nodeWinLicense,
  "node-win-tools": nodeWinTools,
  "node-linux": nodeLinux,
  "node-win-policy": nodeWinPolicy,
  "node-version": nodeVersion,
  "pg-mac-download": pgMacDownload,
  "pg-mac-drag": pgMacDrag,
  "pg-mac-initialize": pgMacInitialize,
  "pg-win-download": pgWinDownload,
  "pg-win-components": pgWinComponents,
  "pg-win-password": pgWinPassword,
  "pg-win-finish": pgWinFinish,
  "pg-linux": pgLinux,
  "repo-create": repoCreate,
  "vscode-pick-project": vscodePickProject,
  "project-terminal": projectTerminal,
  "vite-create": viteCreate,
  "vite-running": viteRunning,
  "vite-browser": viteBrowser,
  "terminal-plus": terminalPlus,
  "server-install": serverInstall,
  "package-json": packageJson,
  "new-file": newFile,
  "editor-app": editorApp,
  "editor-index": editorIndex,
  "editor-schema": editorSchema,
  "editor-env": editorEnv,
  "prisma-migrate": prismaMigrate,
  "api-running": apiRunning,
  "health-browser": healthBrowser,
  "editor-gitignore": editorGitignore,
  "git-status": gitStatus,
  "git-push": gitPush,
  "github-repo": githubRepo,
  "open-recent": openRecent,
  "two-running": twoRunning,
  "copilot-extension": copilotExtension,
}
