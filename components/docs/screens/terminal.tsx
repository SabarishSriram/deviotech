import { Crop } from "lucide-react"

import { Board, Mark } from "@/components/docs/screens/kit"
import { term } from "@/components/docs/screens/fullstack"
import type { TermLine } from "@/components/docs/screens/vscode"
import type { OS } from "@/data/docs/types"

/* Screens for the "Terminal survival kit" setup part (data/docs/setup/common.ts). */

type Screen = (os: OS) => React.ReactNode

/** Keyboard keys, drawn like keycaps. */
export function Keys({ keys, n, label }: { keys: string[]; n?: number; label?: string }) {
  const caps = (
    <span className="flex items-center gap-1.5 px-1">
      {keys.map((k, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[13px] text-[#8c959f]">+</span>}
          <span className="min-w-9 rounded-md border border-[#c9ced6] border-b-[3px] bg-white px-2.5 py-1 text-center text-[14px] font-semibold text-[#1f2328] shadow-sm">
            {k}
          </span>
        </span>
      ))}
    </span>
  )
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-[#f6f8fa] p-3 shadow-xl">
      {n !== undefined ? <Mark n={n}>{caps}</Mark> : caps}
      {label && <p className="text-[11px] text-[#59636e]">{label}</p>}
    </div>
  )
}

function pwdLines(os: OS, sub: string): TermLine[] {
  const path = sub ? `devvy/${sub}` : "devvy"
  if (os === "windows") return [{ out: "" }, { out: "Path" }, { out: "----" }, { out: `C:\\Users\\Asha\\${path.replace("/", "\\")}`, mark: 1 }, { out: "" }]
  return [{ out: os === "mac" ? `/Users/asha/${path}` : `/home/asha/${path}`, mark: 1 }]
}

const cdIn: Screen = (os) =>
  term(os, "devvy", [{ cmd: "mkdir practice" }, { cmd: "cd practice" }, { cmd: "pwd", cwd: "devvy/practice" }, ...pwdLines(os, "practice"), { cmd: "", cwd: "devvy/practice", mark: 2 }], {
    tree: [{ name: "practice", dir: true }],
  })

const cdUp: Screen = (os) =>
  term(os, "devvy", [{ cmd: "cd ..", cwd: "devvy/practice" }, { cmd: "pwd" }, ...pwdLines(os, ""), { cmd: "" }], { tree: [{ name: "practice", dir: true }] })

const tab: Screen = (os) =>
  term(os, "devvy", [{ cmd: os === "windows" ? "cd .\\practice\\" : "cd practice/" }], {
    tree: [{ name: "practice", dir: true }],
    toast: <Keys keys={["Tab"]} n={1} label="cd pra  →  cd practice" />,
  })

const up: Screen = (os) =>
  term(os, "devvy", [{ cmd: "cd .." }, { cmd: "pwd" }, ...pwdLines(os, "").map((l) => ({ ...l, mark: undefined })), { cmd: "pwd", mark: 2 }], {
    tree: [{ name: "practice", dir: true }],
    toast: <Keys keys={["↑"]} n={1} />,
  })

const ctrlC: Screen = (os) => {
  const lines: TermLine[] =
    os === "windows"
      ? [
          { cmd: "ping -t google.com" },
          { out: "Pinging google.com [142.250.183.14] with 32 bytes of data:" },
          { out: "Reply from 142.250.183.14: bytes=32 time=21ms TTL=117" },
          { out: "Reply from 142.250.183.14: bytes=32 time=20ms TTL=117" },
          { out: "Reply from 142.250.183.14: bytes=32 time=22ms TTL=117" },
          { out: "Control-C", tone: "bold", mark: 1 },
          { out: "^C" },
          { cmd: "", mark: 2 },
        ]
      : [
          { cmd: "ping google.com" },
          { out: "PING google.com (142.250.183.14): 56 data bytes" },
          { out: "64 bytes from 142.250.183.14: icmp_seq=0 ttl=117 time=21.4 ms" },
          { out: "64 bytes from 142.250.183.14: icmp_seq=1 ttl=117 time=20.8 ms" },
          { out: "64 bytes from 142.250.183.14: icmp_seq=2 ttl=117 time=22.1 ms" },
          { out: "^C", tone: "bold", mark: 1 },
          { out: "--- google.com ping statistics ---" },
          { out: "3 packets transmitted, 3 packets received, 0.0% packet loss" },
          { cmd: "", mark: 2 },
        ]
  return term(os, "devvy", lines, { tree: [{ name: "practice", dir: true }], panel: 0.7, toast: <Keys keys={["Ctrl", "C"]} /> })
}

const copy: Screen = (os) =>
  term(os, "devvy", [{ cmd: "pwd" }, ...pwdLines(os, "").map((l): TermLine => ("out" in l && l.out.includes("devvy") ? { out: l.out, tone: "accent" } : l)), { cmd: "" }], {
    tree: [{ name: "practice", dir: true }],
    toast: <Keys keys={os === "mac" ? ["⌘ Cmd", "C"] : os === "windows" ? ["Ctrl", "C"] : ["Ctrl", "Shift", "C"]} n={1} label="with the text selected" />,
  })

const screenshot: Screen = (os) => (
  <Board className="flex flex-col items-center gap-5 py-8">
    <Keys
      keys={os === "mac" ? ["⌘ Cmd", "⇧ Shift", "4"] : os === "windows" ? ["⊞ Win", "⇧ Shift", "S"] : ["PrtSc"]}
      n={1}
      label={os === "mac" ? "Saved on your Desktop" : os === "windows" ? "Copied — paste it with Ctrl + V" : "Saved in Pictures › Screenshots"}
    />
    <div className="relative h-32 w-[420px] rounded-lg border border-[#d0d7de] bg-[#f6f8fa]">
      <div className="absolute top-5 left-12 flex h-20 w-56 items-center justify-center rounded border-2 border-dashed border-[#0969da] bg-[#0969da]/5 text-[12px] text-[#0969da]">
        <Crop className="mr-1.5 size-4" /> drag over what you want
      </div>
    </div>
  </Board>
)

export const terminalScreens: Record<string, Screen> = {
  "term-cd": cdIn,
  "term-cd-up": cdUp,
  "term-tab": tab,
  "term-up": up,
  "term-ctrl-c": ctrlC,
  "term-copy": copy,
  "term-screenshot": screenshot,
}
