import {
  Blocks,
  ChevronDown,
  ChevronRight,
  Files,
  GitBranch,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react"
import { VscVscode } from "react-icons/vsc"

import { Mark, Menu, MONO_FONT, MacMenuBar, osFont, TrafficLights, WinControls, type MenuItem } from "@/components/docs/screens/kit"
import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * A recreation of VS Code in its default "Dark Modern" theme. Every terminal
 * step in the setup happens inside VS Code's built-in terminal, so this one
 * component draws most of the setup screens.
 */

const C = {
  bar: "#181818",
  editor: "#1f1f1f",
  border: "#2b2b2b",
  text: "#cccccc",
  dim: "#9d9d9d",
  accent: "#0078d4",
}

/* ------------------------------------------------------------------ */
/* Terminal prompt + lines                                             */
/* ------------------------------------------------------------------ */

/** The shell prompt each OS shows for a folder like "devvy/my-fullstack-app". */
export function prompt(os: OS, cwd: string) {
  const parts = cwd.split("/").filter(Boolean)
  if (os === "windows") return `PS C:\\Users\\Asha${parts.length ? "\\" + parts.join("\\") : ""}>`
  if (os === "linux") return `asha@laptop:~${parts.length ? "/" + parts.join("/") : ""}$`
  return `asha@MacBook-Air ${parts.length ? parts[parts.length - 1] : "~"} %`
}

export type TermLine =
  | { cmd: string; cwd?: string; mark?: number; /** e.g. "(.venv)" before the prompt once a Python environment is active */ prefix?: string }
  | { out: string; tone?: "ok" | "warn" | "err" | "dim" | "accent" | "bold"; mark?: number }

function Line({ line, os, cwd }: { line: TermLine; os: OS; cwd: string }) {
  let body: React.ReactNode
  if ("cmd" in line) {
    body = (
      <p className="whitespace-pre-wrap">
        {line.prefix && <span className="text-[#cccccc]">{line.prefix} </span>}
        <span className={os === "windows" ? "text-[#cccccc]" : "font-semibold text-[#6bc46d]"}>{prompt(os, line.cwd ?? cwd)}</span>{" "}
        <span className="text-white">{line.cmd}</span>
      </p>
    )
  } else {
    const tone = {
      ok: "text-[#6bc46d]",
      warn: "text-[#e5c07b]",
      err: "text-[#f48771]",
      dim: "text-[#8b8b8b]",
      accent: "text-[#4fc1ff]",
      bold: "font-semibold text-white",
    }[line.tone ?? "dim"]
    body = <p className={cn("whitespace-pre-wrap", line.tone ? tone : "text-[#cccccc]")}>{line.out || " "}</p>
  }
  return line.mark !== undefined ? (
    <Mark n={line.mark} badge="r" className="mr-9 inline-block">
      {body}
    </Mark>
  ) : (
    body
  )
}

/* ------------------------------------------------------------------ */
/* Very small syntax highlighter for code in the editor                */
/* ------------------------------------------------------------------ */

/** VS Code Dark Modern token colours for the handful of token kinds we show. */
function tokenColor(tok: string) {
  if (tok.startsWith('"') || tok.startsWith("'")) return "#ce9178" // string
  if (/^\d+$/.test(tok)) return "#b5cea8" // number
  if (tok.startsWith("@")) return "#dcdcaa" // Java annotation / Python decorator
  if (/^(import|from|export|return|await|if|else|default|for|while|in|try|except|raise|assert|with|as|package)$/.test(tok)) return "#c586c0" // control keyword
  if (/^[A-Z_]{3,}$/.test(tok)) return "#9cdcfe" // .env variable name
  return "#569cd6" // other keyword / true / false
}

function highlight(line: string) {
  if (/^\s*(\/\/|#(?!include))/.test(line)) return <span className="text-[#6a9955]">{line}</span>
  const pieces: React.ReactNode[] = []
  const regex = /("[^"]*"|'[^']*'|\b\d+\b|\b(?:import|from|export|const|let|return|async|await|function|new|default|type|interface|if|else|true|false|def|class|public|private|static|void|package|for|while|in|try|except|raise|assert|with|as|None|True|False)\b|@\w+|[A-Z_]{3,}(?==))/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(line))) {
    if (m.index > last) pieces.push(line.slice(last, m.index))
    const tok = m[0]
    const color = tokenColor(tok)
    pieces.push(
      <span key={m.index} style={{ color }}>
        {tok}
      </span>
    )
    last = m.index + tok.length
  }
  if (last < line.length) pieces.push(line.slice(last))
  return pieces
}

/* ------------------------------------------------------------------ */
/* Explorer tree                                                       */
/* ------------------------------------------------------------------ */

export type TreeNode = {
  name: string
  dir?: boolean
  open?: boolean
  depth?: number
  active?: boolean
  mark?: number
  editing?: boolean
  /** Greyed out, like VS Code shows files listed in .gitignore. */
  ignored?: boolean
  /** Git decoration: U = new (untracked), M = modified. */
  status?: "U" | "M"
}

const STATUS_COLOR = { U: "#73c991", M: "#e2c08d" }

function FileIcon({ name }: { name: string }) {
  const ext = name.startsWith(".env") ? "env" : name.split(".").pop()
  const color =
    { ts: "#3178c6", tsx: "#3178c6", json: "#cbcb41", env: "#e5c07b", prisma: "#5a67d8", md: "#519aba", gitignore: "#41535b", html: "#e44d26", css: "#42a5f5", svg: "#ffb13b" }[
      ext ?? ""
    ] ?? "#8b8b8b"
  const label = { ts: "TS", tsx: "⚛", json: "{}", env: "≡", prisma: "◭", md: "M↓", gitignore: "◆", html: "<>", css: "#", svg: "◐" }[ext ?? ""] ?? "▢"
  return (
    <span className="w-4 text-center text-[9px] font-bold" style={{ color }}>
      {label}
    </span>
  )
}

function Tree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <div className="text-[12px]">
      {nodes.map((n, i) => {
        const row = (
          <div
            className={cn("flex h-[22px] items-center gap-1 pr-2", n.active && "bg-[#37373d] text-white", n.ignored && "text-[#7a7a7a]")}
            style={{ paddingLeft: 8 + (n.depth ?? 0) * 12 }}
          >
            {n.dir ? (
              n.open ? <ChevronDown className="size-3.5 shrink-0" /> : <ChevronRight className="size-3.5 shrink-0" />
            ) : (
              <FileIcon name={n.name} />
            )}
            {n.editing ? (
              <span className="flex-1 border border-[#0078d4] bg-[#313131] px-1 text-white">{n.name}</span>
            ) : (
              <span className="truncate" style={n.status ? { color: STATUS_COLOR[n.status] } : undefined}>
                {n.name}
              </span>
            )}
            {n.status && (
              <span className="ml-auto pl-2 text-[11px] font-semibold" style={{ color: STATUS_COLOR[n.status] }}>
                {n.status}
              </span>
            )}
          </div>
        )
        return n.mark !== undefined ? (
          <Mark key={i} n={n.mark} className="mx-1" badge="r">
            {row}
          </Mark>
        ) : (
          <div key={i}>{row}</div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The window                                                          */
/* ------------------------------------------------------------------ */

type EditorMark = { from: number; to: number; n: number }

export type VSCodeProps = {
  os: OS
  /** Workspace folder name, e.g. "devvy". Omit for a window with no folder open. */
  folder?: string
  sidebar?: "explorer" | "extensions" | null
  tree?: TreeNode[]
  extensions?: { query: string; items: { name: string; publisher: string; desc: string; color: string; letter: string; mark?: number }[] }
  editor?: { tabs: string[]; active?: string; file?: string; lines?: string[]; mark?: EditorMark | EditorMark[] } | "welcome"
  /** Highlight "Open Folder…" on the Welcome page. */
  welcomeMark?: number
  terminal?: { cwd: string; lines: TermLine[]; plusMark?: number; list?: string[]; listMark?: number }
  /** An open menu: File / Terminal etc. `mark` circles the menu's name. */
  menu?: { name: string; items: MenuItem[]; mark?: number; submenu?: { at: number; items: MenuItem[] } }
  /** A right-click menu floating inside the window. */
  contextMenu?: { items: MenuItem[]; top: number; left: number }
  /** Circle the Extensions icon / the Extensions search box. */
  marks?: { extensionsIcon?: number; extensionsSearch?: number }
  /** Something floating over the window (dialogs, command palette). */
  overlay?: React.ReactNode
  /** Extra status-bar item on the right, e.g. "Java: Ready". */
  statusItem?: { text: React.ReactNode; mark?: number }
  /** A notification in the bottom-right corner, like VS Code's pop-ups. */
  toast?: React.ReactNode
  /** Git branch in the status bar (defaults to main inside the project; "" before git init). */
  branch?: string
  branchMark?: number
  /** Height of the whole window in px. */
  height?: number
  /** Share of the height the terminal panel takes. */
  panel?: number
}

const MENUS = ["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"]

export function VSCode({
  os,
  folder,
  sidebar = "explorer",
  tree,
  extensions,
  editor = "welcome",
  welcomeMark,
  branch = "main",
  branchMark,
  terminal,
  menu,
  overlay,
  toast,
  statusItem,
  contextMenu,
  marks,
  height = 430,
  panel = 0.5,
}: VSCodeProps) {
  const title = folder ? `${folder} — Visual Studio Code` : "Welcome — Visual Studio Code"
  const panelHeight = terminal ? Math.round((height - 56) * panel) : 0

  const window = (
    <div
      className="relative flex flex-col overflow-hidden rounded-[10px] border border-black/40 shadow-[0_22px_50px_-14px_rgba(0,0,0,0.55)]"
      style={{ height, background: C.editor, color: C.text, fontFamily: osFont(os) }}
    >
      {/* Title bar */}
      <div className="relative flex h-8 shrink-0 items-center border-b text-[12px]" style={{ background: C.bar, borderColor: C.border }}>
        {os === "mac" ? (
          <TrafficLights className="ml-3" />
        ) : (
          <>
            <VscVscode className="mx-2.5 size-4 text-[#3ea6ff]" />
            {/* Like real VS Code in a narrow window: later menus fold into "…" unless one is open. */}
            {[...MENUS.slice(0, 4), ...(menu && !MENUS.slice(0, 4).includes(menu.name) ? [menu.name] : []), "…"].map((m) => {
              const label = <span className={cn("block rounded px-1.5 py-0.5", menu?.name === m && "bg-[#3a3a3a] text-white")}>{m}</span>
              return menu?.name === m && menu.mark !== undefined ? (
                <Mark key={m} n={menu.mark} badge="tl">
                  {label}
                </Mark>
              ) : (
                <span key={m}>{label}</span>
              )
            })}
          </>
        )}
        <div
          className={cn(
            "absolute flex h-[22px] -translate-x-1/2 items-center justify-center gap-2 rounded-md border text-[11.5px]",
            os === "mac" ? "left-1/2 w-64" : "left-[62%] w-44"
          )}
          style={{ borderColor: "#3c3c3c", background: "#242424", color: C.dim }}
        >
          <Search className="size-3" />
          {folder ?? "Search"}
        </div>
        {os !== "mac" && <WinControls dark className="ml-auto" />}
        {menu && os !== "mac" && (
          <div className="absolute top-8 z-30 flex items-start" style={{ left: 30 + MENUS.indexOf(menu.name) * 47 }}>
            <Menu os={os} dark items={menu.items} />
            {menu.submenu && <Menu os={os} dark items={menu.submenu.items} className="-ml-1" style={{ marginTop: 4 + menu.submenu.at * 24 }} />}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Activity bar */}
        <div className="flex w-11 shrink-0 flex-col items-center gap-4 border-r pt-2.5" style={{ background: C.bar, borderColor: C.border }}>
          {[
            { Icon: Files, on: sidebar === "explorer" },
            { Icon: Search },
            { Icon: GitBranch },
            { Icon: Play },
            { Icon: Blocks, on: sidebar === "extensions" },
          ].map(({ Icon, on }, i) => {
            const icon = <Icon className="size-[22px]" strokeWidth={1.4} />
            return (
              <span key={i} className={cn("relative flex w-full justify-center", on ? "text-white" : "text-[#868686]")}>
                {on && <span className="absolute top-0 left-0 h-full w-0.5" style={{ background: C.accent }} />}
                {i === 4 && marks?.extensionsIcon !== undefined ? <Mark n={marks.extensionsIcon}>{icon}</Mark> : icon}
              </span>
            )
          })}
          <Settings className="mt-auto mb-3 size-[20px] text-[#868686]" strokeWidth={1.4} />
        </div>

        {/* Side bar */}
        {sidebar && (
          <div className="w-56 shrink-0 overflow-hidden border-r" style={{ background: C.bar, borderColor: C.border }}>
            {sidebar === "explorer" ? (
              <>
                <p className="flex h-8 items-center px-4 text-[11px] tracking-wide">EXPLORER</p>
                {folder ? (
                  <>
                    <p className="flex h-[22px] items-center gap-1 px-1 text-[11px] font-bold">
                      <ChevronDown className="size-3.5" />
                      {folder.toUpperCase()}
                    </p>
                    <Tree nodes={tree ?? []} />
                  </>
                ) : (
                  <div className="space-y-3 px-4 py-2 text-[12px]">
                    <p>You have not yet opened a folder.</p>
                    <span className="flex h-7 items-center justify-center rounded-sm text-white" style={{ background: C.accent }}>
                      Open Folder
                    </span>
                  </div>
                )}
              </>
            ) : (
              extensions && (
                <>
                  <p className="flex h-8 items-center px-4 text-[11px] tracking-wide">EXTENSIONS: MARKETPLACE</p>
                  {(() => {
                    const box = (
                      <div className="flex h-6 items-center rounded-sm border px-2 text-[12px] text-white" style={{ borderColor: C.accent, background: "#313131" }}>
                        {extensions.query}
                      </div>
                    )
                    return marks?.extensionsSearch !== undefined ? (
                      <Mark n={marks.extensionsSearch} className="mx-3 mb-2">
                        {box}
                      </Mark>
                    ) : (
                      <div className="mx-3 mb-2">{box}</div>
                    )
                  })()}
                  {extensions.items.map((ext) => (
                    <div key={ext.name} className="flex gap-2.5 px-3 py-2">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded text-[15px] font-bold text-white" style={{ background: ext.color }}>
                        {ext.letter}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-white">{ext.name}</p>
                        <p className="truncate text-[11px]" style={{ color: C.dim }}>
                          {ext.desc}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="truncate text-[11px] text-white">{ext.publisher}</span>
                          {ext.mark !== undefined ? (
                            <Mark n={ext.mark} badge="l">
                              <span className="block rounded-sm px-1.5 py-px text-[11px] text-white" style={{ background: C.accent }}>
                                Install
                              </span>
                            </Mark>
                          ) : (
                            <span className="rounded-sm px-1.5 py-px text-[11px] text-white" style={{ background: C.accent }}>
                              Install
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )
            )}
          </div>
        )}

        {/* Editor + panel */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-hidden">
            {editor === "welcome" ? (
              <>
                <div className="flex h-8 items-end border-b" style={{ background: C.bar, borderColor: C.border }}>
                  <span className="flex h-8 items-center gap-2 border-t px-3 text-[12px] text-white" style={{ background: C.editor, borderTopColor: C.accent }}>
                    <VscVscode className="size-3.5 text-[#3ea6ff]" />
                    Welcome
                    <X className="size-3" />
                  </span>
                </div>
                <div className="px-10 pt-6">
                  <p className="text-[26px] font-light text-white">Visual Studio Code</p>
                  <p className="text-[15px]" style={{ color: C.dim }}>
                    Editing evolved
                  </p>
                  <p className="mt-5 text-[13px] text-white">Start</p>
                  <div className="mt-1.5 space-y-1 text-[12.5px]" style={{ color: "#3794ff" }}>
                    <p>New File...</p>
                    <p>Open File...</p>
                    {welcomeMark !== undefined ? (
                      <Mark n={welcomeMark} badge="r" className="inline-block">
                        <p>Open Folder...</p>
                      </Mark>
                    ) : (
                      <p>Open Folder...</p>
                    )}
                    <p>Clone Git Repository...</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-8 items-end border-b" style={{ background: C.bar, borderColor: C.border }}>
                  {editor.tabs.map((t) => (
                    <span
                      key={t}
                      className={cn("flex h-8 items-center gap-1.5 border-r px-3 text-[12px]", t === editor.active ? "border-t text-white" : "")}
                      style={{ borderRightColor: C.border, background: t === editor.active ? C.editor : C.bar, borderTopColor: t === editor.active ? C.accent : undefined }}
                    >
                      <FileIcon name={t} />
                      {t}
                      {t === editor.active && <X className="size-3" />}
                    </span>
                  ))}
                </div>
                {editor.file && (
                  <p className="px-4 py-1 text-[11px]" style={{ color: C.dim }}>
                    {editor.file.split("/").join("  ›  ")}
                  </p>
                )}
                <div className="px-2 text-[12px] leading-[18px]" style={{ fontFamily: MONO_FONT }}>
                  {(() => {
                    const rows = (editor.lines ?? []).map((l, i) => (
                      <div key={i} className="flex">
                        <span className="w-8 shrink-0 pr-3 text-right text-[#6e7681]">{i + 1}</span>
                        <span className="whitespace-pre">{highlight(l)}</span>
                      </div>
                    ))
                    const marks = (Array.isArray(editor.mark) ? editor.mark : editor.mark ? [editor.mark] : []).toSorted((a, b) => a.from - b.from)
                    if (!marks.length) return rows
                    const out: React.ReactNode[] = []
                    let at = 0
                    for (const m of marks) {
                      out.push(...rows.slice(at, m.from - 1))
                      out.push(
                        <Mark key={`m${m.n}`} n={m.n} badge="r" className="mr-10">
                          {rows.slice(m.from - 1, m.to)}
                        </Mark>
                      )
                      at = m.to
                    }
                    out.push(...rows.slice(at))
                    return out
                  })()}
                </div>
              </>
            )}
          </div>

          {terminal && (
            <div className="shrink-0 border-t" style={{ height: panelHeight, background: C.bar, borderColor: C.border }}>
              <div className="flex h-8 items-center gap-4 px-4 text-[11px]">
                {["PROBLEMS", "OUTPUT", "DEBUG CONSOLE"].map((t) => (
                  <span key={t} className="whitespace-nowrap" style={{ color: C.dim }}>
                    {t}
                  </span>
                ))}
                <span className="border-b pb-1 text-white" style={{ borderColor: C.accent }}>
                  TERMINAL
                </span>
                <span style={{ color: C.dim }}>PORTS</span>
                <span className="ml-auto flex items-center gap-3" style={{ color: C.dim }}>
                  <span className="text-[11px]">{os === "windows" ? "powershell" : os === "mac" ? "zsh" : "bash"}</span>
                  {terminal.plusMark !== undefined ? (
                    <Mark n={terminal.plusMark}>
                      <Plus className="size-4 text-white" />
                    </Mark>
                  ) : (
                    <Plus className="size-4" />
                  )}
                  <ChevronDown className="size-3.5" />
                  <Trash2 className="size-3.5" />
                  <MoreHorizontal className="size-3.5" />
                  <X className="size-3.5" />
                </span>
              </div>
              <div className="flex h-[calc(100%-2rem)]">
                <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden px-4 pb-2 text-[11.5px] leading-[17px]" style={{ fontFamily: MONO_FONT }}>
                  {terminal.lines.map((l, i) => (
                    <Line key={i} line={l} os={os} cwd={terminal.cwd} />
                  ))}
                </div>
                {terminal.list && (
                  <div className="w-40 shrink-0 border-l py-1 text-[11.5px]" style={{ borderColor: C.border }}>
                    {(() => {
                      const list = terminal.list.map((name, i) => (
                        <p
                          key={i}
                          className={cn("flex items-center gap-1.5 px-3 py-0.5", i === terminal.list!.length - 1 && "bg-[#37373d] text-white")}
                        >
                          <span className="text-[10px]">&gt;_</span>
                          {name}
                        </p>
                      ))
                      return terminal.listMark !== undefined ? (
                        <Mark n={terminal.listMark} className="mx-1" badge="tl">
                          {list}
                        </Mark>
                      ) : (
                        list
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-[22px] shrink-0 items-center gap-3 border-t px-2 text-[11px]" style={{ background: C.bar, borderColor: C.border, color: C.dim }}>
        <span className="rounded-sm px-1.5 text-white" style={{ background: C.accent }}>
          ⇄
        </span>
        {/* Only the project is a Git repository; the plain devvy folder isn't. */}
        {folder &&
          folder !== "devvy" &&
          branch &&
          (() => {
            const label = (
              <span className="flex items-center gap-1 px-0.5">
                <GitBranch className="size-3" />
                {branch}
              </span>
            )
            return branchMark !== undefined ? (
              <Mark n={branchMark} badge="tr" className="outline-offset-[-1px]">
                {label}
              </Mark>
            ) : (
              label
            )
          })()}
        <span>⊗ 0 ⚠ 0</span>
        {statusItem &&
          (statusItem.mark !== undefined ? (
            <Mark n={statusItem.mark} badge="tr" className="ml-auto outline-offset-[-1px]">
              <span className="block px-1 text-white">{statusItem.text}</span>
            </Mark>
          ) : (
            <span className="ml-auto text-white">{statusItem.text}</span>
          ))}
        <span className={statusItem ? "pl-2" : "ml-auto"}>{title}</span>
      </div>

      {contextMenu && (
        <div className="absolute z-30" style={{ top: contextMenu.top, left: contextMenu.left }}>
          <Menu os={os} dark items={contextMenu.items} />
        </div>
      )}
      {toast && <div className="absolute right-3 bottom-8 z-30">{toast}</div>}
      {overlay && <div className="absolute inset-0 z-40 flex items-start justify-center bg-black/30 pt-12">{overlay}</div>}
    </div>
  )

  if (os === "mac" && menu) {
    return (
      <div>
        <MacMenuBar app="Code" menus={MENUS} open={menu.name} items={menu.items} mark={menu.mark} submenu={menu.submenu} />
        <div className="mt-3">{window}</div>
      </div>
    )
  }
  return window
}

/* ------------------------------------------------------------------ */
/* Overlays that appear on top of VS Code                              */
/* ------------------------------------------------------------------ */

/** "Do you trust the authors of the files in this folder?" */
export function TrustDialog({ folder, mark }: { folder: string; mark?: number }) {
  const yes = (
    <span className="flex h-7 items-center justify-center rounded-sm px-3 text-[12px] text-white" style={{ background: C.accent }}>
      Yes, I trust the authors
    </span>
  )
  return (
    <div className="w-[440px] rounded-md border p-5 text-[12px]" style={{ background: "#252526", borderColor: "#454545", color: C.text }}>
      <div className="flex gap-3">
        <ShieldCheck className="size-8 shrink-0 text-[#3794ff]" />
        <div>
          <p className="text-[14px] font-semibold text-white">Do you trust the authors of the files in this folder?</p>
          <p className="mt-2 leading-relaxed" style={{ color: C.dim }}>
            Code provides features that may automatically execute files in this folder. If you don&apos;t trust the authors of these files, we
            recommend continuing in restricted mode.
          </p>
          <p className="mt-2 flex items-center gap-2">
            <span className="size-3 border border-[#6b6b6b]" />
            Trust the authors of all files in the parent folder &apos;{folder}&apos;
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {mark !== undefined ? <Mark n={mark}>{yes}</Mark> : yes}
        <span className="flex h-7 items-center justify-center rounded-sm bg-[#3a3d41] px-3 text-[12px] text-white">No, I don&apos;t trust the authors</span>
      </div>
    </div>
  )
}
