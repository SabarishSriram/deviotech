import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Folder,
  Globe,
  HardDrive,
  Home,
  Image as ImageIcon,
  Lock,
  Minus,
  Monitor,
  RotateCw,
  Search,
  Square,
  X,
} from "lucide-react"
import { SiApple } from "react-icons/si"

import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * Building blocks for recreated screenshots. Colours are fixed to what each
 * OS/app really looks like (not the site theme), so a screen reads the same
 * in light and dark mode — just like a real screenshot would.
 */

export const MAC_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"
export const WIN_FONT = "'Segoe UI Variable', 'Segoe UI', system-ui, Arial, sans-serif"
export const MONO_FONT = "Menlo, Consolas, 'Cascadia Mono', 'Courier New', monospace"

export const osFont = (os: OS) => (os === "windows" ? WIN_FONT : MAC_FONT)

/* ------------------------------------------------------------------ */
/* The red "click here" marker                                         */
/* ------------------------------------------------------------------ */

/** Red outline + numbered badge around the thing to click. Numbers match the step's text. */
export function Mark({
  n,
  children,
  className,
  round,
  badge = "tr",
}: {
  n?: number
  children: React.ReactNode
  className?: string
  round?: boolean
  badge?: "tr" | "tl" | "br" | "bl" | "r" | "l"
}) {
  const badgePos = {
    tr: "-top-3 -right-3",
    tl: "-top-3 -left-3",
    br: "-bottom-3 -right-3",
    bl: "-bottom-3 -left-3",
    r: "top-1/2 -right-8 -translate-y-1/2",
    l: "top-1/2 -left-8 -translate-y-1/2",
  }[badge]
  // A span (styled as a block) so a marker is valid even inside a <p>.
  return (
    <span
      className={cn(
        "relative block outline-[2.5px] outline-offset-[3px] outline-[#ff2a33] outline-solid",
        round ? "rounded-full" : "rounded-[5px]",
        className
      )}
    >
      {children}
      {n !== undefined && (
        <span
          className={cn(
            "absolute z-20 flex size-[22px] items-center justify-center rounded-full bg-[#ff2a33] text-[12px] font-bold text-white shadow-md ring-2 ring-white",
            badgePos
          )}
          style={{ fontFamily: MAC_FONT }}
        >
          {n}
        </span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Window chrome                                                       */
/* ------------------------------------------------------------------ */

export function TrafficLights({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-2", className)}>
      <span className="size-3 rounded-full border border-black/10 bg-[#ff5f57]" />
      <span className="size-3 rounded-full border border-black/10 bg-[#febc2e]" />
      <span className="size-3 rounded-full border border-black/10 bg-[#28c840]" />
    </span>
  )
}

export function WinControls({ dark, className }: { dark?: boolean; className?: string }) {
  const color = dark ? "text-[#cccccc]" : "text-[#1f1f1f]"
  return (
    <span className={cn("flex h-full", className)}>
      {[Minus, Square, X].map((Icon, i) => (
        <span key={i} className={cn("flex w-11 items-center justify-center", color)}>
          <Icon className={i === 1 ? "size-[11px]" : "size-[14px]"} strokeWidth={1.25} />
        </span>
      ))}
    </span>
  )
}

const shadow = "shadow-[0_22px_50px_-14px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.08)]"

export function MacWindow({
  title,
  children,
  className,
  titleBar,
}: {
  title?: string
  children: React.ReactNode
  className?: string
  titleBar?: React.ReactNode
}) {
  return (
    <div className={cn("overflow-hidden rounded-[11px] bg-white text-[#1d1d1f]", shadow, className)} style={{ fontFamily: MAC_FONT }}>
      <div className="relative flex h-8 items-center border-b border-black/10 bg-[#ececec] px-3">
        <TrafficLights />
        {titleBar ?? (title && <span className="absolute inset-x-0 text-center text-[12.5px] font-semibold text-[#3d3d3d]">{title}</span>)}
      </div>
      {children}
    </div>
  )
}

export function WinWindow({
  title,
  icon,
  children,
  className,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("overflow-hidden rounded-lg border border-[#c4c4c4] bg-white text-[#1f1f1f]", shadow, className)}
      style={{ fontFamily: WIN_FONT }}
    >
      <div className="flex h-8 items-center bg-white pl-3 text-[12px]">
        {icon}
        <span className={cn(icon && "ml-2")}>{title}</span>
        <WinControls className="ml-auto" />
      </div>
      {children}
    </div>
  )
}

/** A Chrome-style browser window. */
export function Browser({
  os = "mac",
  url,
  tab,
  tabIcon,
  children,
  className,
}: {
  os?: OS
  url: string
  tab: string
  tabIcon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-[11px] bg-white text-[#202124]", shadow, className)} style={{ fontFamily: osFont(os) }}>
      <div className="flex h-10 items-end bg-[#dfe3e8] pl-3">
        {os === "mac" && <TrafficLights className="mr-4 mb-3.5" />}
        <div className="flex h-8 w-56 items-center gap-2 rounded-t-[10px] bg-white px-3 text-[11.5px]">
          {tabIcon ?? <Globe className="size-3.5 text-[#5f6368]" />}
          <span className="truncate">{tab}</span>
          <X className="ml-auto size-3 text-[#5f6368]" />
        </div>
        {os !== "mac" && <WinControls className="ml-auto h-10" />}
      </div>
      <div className="flex h-10 items-center gap-3 border-b border-[#e3e3e3] bg-white px-3 text-[#5f6368]">
        <ArrowLeft className="size-4" />
        <ArrowRight className="size-4 opacity-40" />
        <RotateCw className="size-3.5" />
        <div className="flex h-7 flex-1 items-center gap-2 rounded-full bg-[#f1f3f4] px-3.5 text-[12.5px] text-[#202124]">
          {url.startsWith("localhost") ? <Globe className="size-3 text-[#5f6368]" /> : <Lock className="size-3 text-[#5f6368]" />}
          {url}
        </div>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

export function MacButton({ children, primary, className }: { children: React.ReactNode; primary?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] min-w-[72px] items-center justify-center rounded-[6px] px-3 text-[12.5px] shadow-[0_0.5px_1px_rgba(0,0,0,0.25)]",
        primary ? "bg-[#0a84ff] font-medium text-white" : "border border-black/10 bg-white text-[#1d1d1f]",
        className
      )}
    >
      {children}
    </span>
  )
}

export function WinButton({
  children,
  primary,
  disabled,
  className,
}: {
  children: React.ReactNode
  primary?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-[86px] items-center justify-center rounded-[4px] border px-3 text-[12px]",
        primary ? "border-[#0067c0] bg-[#0067c0] text-white" : "border-[#d0d0d0] bg-[#fbfbfb] text-[#1f1f1f]",
        disabled && "opacity-50",
        className
      )}
    >
      {children}
    </span>
  )
}

export function Checkbox({ checked, label, className }: { checked?: boolean; label: React.ReactNode; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-[12px]", className)}>
      <span
        className={cn(
          "flex size-[14px] shrink-0 items-center justify-center rounded-[3px] border",
          checked ? "border-[#0067c0] bg-[#0067c0]" : "border-[#767676] bg-white"
        )}
      >
        {checked && <Check className="size-[11px] text-white" strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </span>
  )
}

export function Radio({ checked, label, className }: { checked?: boolean; label: React.ReactNode; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-[12px]", className)}>
      <span
        className={cn("flex size-[14px] shrink-0 items-center justify-center rounded-full border", checked ? "border-[#0067c0]" : "border-[#767676]")}
      >
        {checked && <span className="size-[7px] rounded-full bg-[#0067c0]" />}
      </span>
      <span>{label}</span>
    </span>
  )
}

export function TextField({
  value,
  placeholder,
  password,
  className,
}: {
  value?: string
  placeholder?: string
  password?: boolean
  className?: string
}) {
  return (
    <span className={cn("flex h-7 items-center rounded-[4px] border border-[#8a8a8a] bg-white px-2 text-[12px]", className)}>
      {value ? password ? "•".repeat(value.length) : value : <span className="text-[#8a8a8a]">{placeholder}</span>}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Menus                                                               */
/* ------------------------------------------------------------------ */

export type MenuItem =
  | {
      label: string
      shortcut?: string
      mark?: number
      sub?: boolean
      dim?: boolean
    }
  | "sep"

export function Menu({
  items,
  os,
  dark,
  className,
  style,
}: {
  items: MenuItem[]
  os: OS
  dark?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={cn(
        "w-60 py-1 text-[12px]",
        os === "mac" ? "rounded-[8px] border border-black/10 bg-[#f6f6f6] px-1 text-[#1d1d1f] shadow-2xl" : "rounded-[6px] border px-1 shadow-xl",
        os !== "mac" && (dark ? "border-[#454545] bg-[#1f1f1f] text-[#cccccc]" : "border-[#d6d6d6] bg-[#f9f9f9]"),
        className
      )}
      style={{ fontFamily: osFont(os), ...style }}
    >
      {items.map((item, i) =>
        item === "sep" ? (
          <div key={i} className={cn("mx-2 my-1 h-px", dark ? "bg-[#454545]" : "bg-black/10")} />
        ) : (
          <MenuRow key={i} item={item} os={os} dark={dark} />
        )
      )}
    </div>
  )
}

function MenuRow({ item, os, dark }: { item: Exclude<MenuItem, "sep">; os: OS; dark?: boolean }) {
  const row = (
    <div
      className={cn(
        "flex h-6 items-center justify-between rounded-[4px] px-2.5",
        item.mark !== undefined && (os === "mac" ? "bg-[#0a84ff] text-white" : dark ? "bg-[#04395e] text-white" : "bg-[#e5f1fb]"),
        item.dim && "opacity-40"
      )}
    >
      <span>{item.label}</span>
      <span className={cn("flex items-center gap-1 text-[11px]", item.mark === undefined && "opacity-60")}>
        {item.shortcut}
        {item.sub && <ChevronRight className="size-3" />}
      </span>
    </div>
  )
  return item.mark !== undefined ? (
    <Mark n={item.mark} badge="r">
      {row}
    </Mark>
  ) : (
    row
  )
}

/** The macOS menu bar across the top of the screen, with one menu open. */
export function MacMenuBar({
  app,
  menus,
  open,
  items,
  mark,
  submenu,
}: {
  app: string
  menus: string[]
  open: string
  items: MenuItem[]
  mark?: number
  submenu?: { at: number; items: MenuItem[] }
}) {
  return (
    <div className="relative" style={{ fontFamily: MAC_FONT }}>
      <div className="flex h-6 items-center gap-4 rounded-t-md bg-[#f2f2f2]/95 px-3 text-[12.5px] text-[#1d1d1f] shadow-sm">
        <SiApple className="size-3.5" />
        <span className="font-semibold">{app}</span>
        {menus.map((m) => {
          const label = <span className={cn("block rounded px-1.5", m === open && "bg-[#0a84ff]/20")}>{m}</span>
          return m === open && mark !== undefined ? (
            <Mark key={m} n={mark} badge="tl">
              {label}
            </Mark>
          ) : (
            <span key={m}>{label}</span>
          )
        })}
      </div>
      <div className="absolute top-7 z-30 flex items-start" style={{ left: 44 + (menus.indexOf(open) + 1) * 50 }}>
        <Menu os="mac" items={items} />
        {submenu && <Menu os="mac" items={submenu.items} className="-ml-1" style={{ marginTop: 4 + submenu.at * 24 }} />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Dialogs & installers                                                */
/* ------------------------------------------------------------------ */

/** A macOS alert dialog. */
export function MacDialog({
  icon,
  title,
  text,
  buttons,
  className,
}: {
  icon: React.ReactNode
  title: string
  text?: string
  buttons: { label: string; primary?: boolean; mark?: number }[]
  className?: string
}) {
  return (
    <div
      className={cn("w-[290px] rounded-[12px] border border-black/10 bg-[#ececec] p-4 text-center text-[#1d1d1f]", shadow, className)}
      style={{ fontFamily: MAC_FONT }}
    >
      <div className="mx-auto flex size-14 items-center justify-center">{icon}</div>
      <p className="mt-2 text-[13px] leading-snug font-bold">{title}</p>
      {text && <p className="mt-1.5 text-[11px] leading-snug text-[#3d3d3d]">{text}</p>}
      <div className={cn("mt-4 gap-2", buttons.length > 2 ? "flex flex-col" : buttons.length === 2 ? "grid grid-cols-2" : "grid")}>
        {buttons.map((b) => {
          const btn = (
            <MacButton key={b.label} primary={b.primary} className="w-full">
              {b.label}
            </MacButton>
          )
          return b.mark !== undefined ? (
            <Mark key={b.label} n={b.mark}>
              {btn}
            </Mark>
          ) : (
            btn
          )
        })}
      </div>
    </div>
  )
}

/** A Windows setup wizard (VS Code, Git, Node.js, PostgreSQL installers all follow this layout). */
export function Wizard({
  title,
  icon,
  heading,
  sub,
  children,
  next = "Next >",
  nextMark,
  back = true,
  className,
}: {
  title: string
  icon?: React.ReactNode
  heading: string
  sub?: string
  children: React.ReactNode
  next?: string
  nextMark?: number
  back?: boolean
  className?: string
}) {
  const nextBtn = <WinButton primary>{next}</WinButton>
  return (
    <WinWindow title={title} icon={icon} className={cn("w-[560px]", className)}>
      <div className="flex items-start justify-between border-b border-[#e5e5e5] bg-white px-5 py-3">
        <div>
          <p className="text-[12.5px] font-semibold">{heading}</p>
          {sub && <p className="mt-0.5 pl-3 text-[12px] text-[#444]">{sub}</p>}
        </div>
        {icon && <span className="[&_svg]:size-8">{icon}</span>}
      </div>
      <div className="min-h-[190px] bg-[#f3f3f3] px-6 py-4 text-[12px]">{children}</div>
      <div className="flex justify-end gap-2 border-t border-[#e5e5e5] bg-[#f3f3f3] px-4 py-3">
        {back && <WinButton>&lt; Back</WinButton>}
        {nextMark !== undefined ? <Mark n={nextMark}>{nextBtn}</Mark> : nextBtn}
        <WinButton>Cancel</WinButton>
      </div>
    </WinWindow>
  )
}

/** The macOS package installer (Node.js, GitHub CLI .pkg files). */
export function MacInstaller({
  app,
  step,
  heading,
  children,
  primary = "Continue",
  mark,
}: {
  app: string
  step: number
  heading: string
  children: React.ReactNode
  primary?: string
  mark?: number
}) {
  const steps = ["Introduction", "License", "Destination Select", "Installation Type", "Installation", "Summary"]
  const btn = <MacButton primary>{primary}</MacButton>
  return (
    <MacWindow title={`Install ${app}`} className="w-[600px]">
      <div className="flex">
        <div className="w-44 shrink-0 space-y-1.5 bg-[#f4f4f4] px-4 py-5 text-[12px]">
          {steps.map((s, i) => (
            <p key={s} className={cn("flex items-center gap-2", i === step ? "font-semibold text-[#1d1d1f]" : "text-[#8a8a8a]")}>
              <span className={cn("size-2 rounded-full", i === step ? "bg-[#0a84ff]" : i < step ? "bg-[#8a8a8a]" : "border border-[#b0b0b0]")} />
              {s}
            </p>
          ))}
        </div>
        <div className="flex-1 border-l border-black/5 px-5 py-4">
          <p className="text-[13px] font-semibold">{heading}</p>
          <div className="mt-3 h-[150px] rounded-md border border-black/10 bg-white p-3 text-[11.5px] leading-relaxed text-[#3d3d3d]">{children}</div>
          <div className="mt-4 flex justify-end gap-2">
            <MacButton>Go Back</MacButton>
            {mark !== undefined ? <Mark n={mark}>{btn}</Mark> : btn}
          </div>
        </div>
      </div>
    </MacWindow>
  )
}

/* ------------------------------------------------------------------ */
/* Finder / File Explorer                                              */
/* ------------------------------------------------------------------ */

export function MacFolder({ name, mark, selected, editing }: { name: string; mark?: number; selected?: boolean; editing?: boolean }) {
  const body = (
    <div className="flex w-[78px] flex-col items-center gap-1">
      <Folder className="size-12 fill-[#7cc0f6] text-[#5aaeef]" strokeWidth={1} />
      <span
        className={cn(
          "max-w-full truncate rounded px-1 text-[11px]",
          selected && "bg-[#0a84ff] text-white",
          editing && "border border-[#0a84ff] bg-white text-[#1d1d1f] ring-2 ring-[#0a84ff]/30"
        )}
      >
        {name}
      </span>
    </div>
  )
  return mark !== undefined ? <Mark n={mark}>{body}</Mark> : body
}

export function WinFolder({ name, mark, selected, editing }: { name: string; mark?: number; selected?: boolean; editing?: boolean }) {
  const body = (
    <div className={cn("flex w-[84px] flex-col items-center gap-1 rounded py-1", selected && "bg-[#cce8ff]")}>
      <Folder className="size-11 fill-[#f8d775] text-[#e2b33b]" strokeWidth={1} />
      <span className={cn("max-w-full truncate px-1 text-[11px]", editing && "border border-[#0067c0] bg-white")}>{name}</span>
    </div>
  )
  return mark !== undefined ? <Mark n={mark}>{body}</Mark> : body
}

/** A macOS Finder window. */
export function Finder({
  title,
  active,
  children,
  className,
  markPlace,
}: {
  title: string
  active: string
  children: React.ReactNode
  className?: string
  markPlace?: { label: string; n: number }
}) {
  const places = [
    { label: "Recents", icon: Clock },
    { label: "Applications", icon: Monitor },
    { label: "Desktop", icon: Monitor },
    { label: "Documents", icon: Folder },
    { label: "Downloads", icon: Download },
    { label: "asha", icon: Home },
  ]
  return (
    <div className={cn("overflow-hidden rounded-[11px] bg-white text-[#1d1d1f]", shadow, className)} style={{ fontFamily: MAC_FONT }}>
      <div className="flex">
        <div className="w-40 shrink-0 bg-[#ececec]/90 px-2 pt-3 pb-4">
          <TrafficLights className="mb-4 ml-1" />
          <p className="mb-1 px-2 text-[10.5px] font-semibold text-[#8a8a8a]">Favourites</p>
          {places.map(({ label, icon: Icon }) => {
            const row = (
              <p className={cn("flex items-center gap-2 rounded-md px-2 py-[3px] text-[12px]", label === active && "bg-black/10")}>
                <Icon className="size-3.5 text-[#0a84ff]" />
                {label}
              </p>
            )
            return markPlace?.label === label ? (
              <Mark key={label} n={markPlace.n} badge="r" className="mr-6">
                {row}
              </Mark>
            ) : (
              <div key={label}>{row}</div>
            )
          })}
        </div>
        <div className="flex-1">
          <div className="flex h-12 items-center gap-3 border-b border-black/5 px-4">
            <ChevronRight className="size-4 rotate-180 text-[#8a8a8a]" />
            <ChevronRight className="size-4 text-[#c4c4c4]" />
            <span className="text-[13px] font-semibold">{title}</span>
            <Search className="ml-auto size-4 text-[#8a8a8a]" />
          </div>
          <div className="relative min-h-[220px] p-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** A Windows 11 File Explorer window. */
export function Explorer({
  path,
  active,
  children,
  className,
  markAddress,
  bare,
}: {
  path: string[]
  active: string
  children: React.ReactNode
  className?: string
  markAddress?: number
  /** Inside another window (e.g. an Open Folder dialog): no tab strip or window buttons. */
  bare?: boolean
}) {
  const nav = [
    { label: "Home", icon: Home },
    { label: "Gallery", icon: ImageIcon },
    { label: "Desktop", icon: Monitor },
    { label: "Downloads", icon: Download },
    { label: "Documents", icon: Folder },
    { label: "This PC", icon: Monitor },
    { label: "Local Disk (C:)", icon: HardDrive },
  ]
  return (
    <div
      className={cn("overflow-hidden rounded-lg border border-[#c4c4c4] bg-white text-[#1f1f1f]", shadow, className)}
      style={{ fontFamily: WIN_FONT }}
    >
      {!bare && (
        <div className="flex h-9 items-end bg-[#eef1f7] pl-2">
          <div className="flex h-8 w-48 items-center gap-2 rounded-t-md bg-white px-3 text-[12px]">
            <Folder className="size-3.5 fill-[#f8d775] text-[#e2b33b]" />
            {path[path.length - 1]}
            <X className="ml-auto size-3" />
          </div>
          <WinControls className="ml-auto h-9" />
        </div>
      )}
      <div className="flex h-10 items-center gap-2 border-b border-[#e5e5e5] bg-white px-3 text-[12px] text-[#5f5f5f]">
        <ArrowLeft className="size-4" />
        <ArrowRight className="size-4 opacity-40" />
        {(() => {
          const bar = (
            <div className="flex h-7 flex-1 items-center gap-1 rounded border border-[#e0e0e0] px-2 text-[#1f1f1f]">
              <Monitor className="size-3.5 text-[#5f5f5f]" />
              {path.map((p) => (
                <span key={p} className="flex items-center gap-1">
                  <ChevronRight className="size-3 text-[#8a8a8a]" />
                  {p}
                </span>
              ))}
            </div>
          )
          return markAddress !== undefined ? (
            <Mark n={markAddress} className="ml-2 flex flex-1">
              {bar}
            </Mark>
          ) : (
            <div className="ml-2 flex flex-1">{bar}</div>
          )
        })()}
        <div className="flex h-7 w-40 items-center gap-2 rounded border border-[#e0e0e0] px-2">
          <Search className="size-3.5" />
          <span>Search</span>
        </div>
      </div>
      <div className="flex">
        <div className="w-44 shrink-0 space-y-0.5 border-r border-[#e5e5e5] px-2 py-3 text-[12px]">
          {nav.map(({ label, icon: Icon }) => (
            <p key={label} className={cn("flex items-center gap-2 rounded px-2 py-[3px]", label === active && "bg-[#e5f1fb]")}>
              <Icon className="size-3.5 text-[#5f5f5f]" />
              {label}
            </p>
          ))}
        </div>
        <div className="relative min-h-[220px] flex-1 p-5">{children}</div>
      </div>
    </div>
  )
}

/** A standalone desktop terminal (used before VS Code exists, e.g. on Linux). */
export function DesktopTerminal({ os, children }: { os: OS; children: React.ReactNode }) {
  const styles = {
    mac: "bg-white text-[#1d1d1f]",
    windows: "bg-[#0c0c0c] text-[#cccccc]",
    linux: "bg-[#300a24] text-[#eeeeec]",
  }[os]
  const title = {
    mac: "asha — zsh",
    windows: "Windows PowerShell",
    linux: "asha@laptop: ~",
  }[os]
  const body = (
    <div className={cn("min-h-[200px] p-3 text-[12px] leading-relaxed", styles)} style={{ fontFamily: MONO_FONT }}>
      {children}
    </div>
  )
  if (os === "windows")
    return (
      <WinWindow title={title} className="w-[640px]">
        {body}
      </WinWindow>
    )
  return (
    <MacWindow title={title} className="w-[640px]">
      {body}
    </MacWindow>
  )
}

export function Caret() {
  return <span className="ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] bg-current opacity-70" />
}

export { ChevronDown }

/* ------------------------------------------------------------------ */
/* Diagrams                                                            */
/* ------------------------------------------------------------------ */

/** A plain white card for explanatory diagrams (not a recreation of any app). */
export function Board({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl bg-white p-6 text-[#1f2328]", shadow, className)} style={{ fontFamily: MAC_FONT }}>
      {children}
    </div>
  )
}
