import { ArrowRight, BarChart3, Check, ChevronDown, Copy, Download, Search, X } from "lucide-react"
import { SiAndroid, SiApple, SiDocker, SiEclipseadoptium, SiExpo, SiMongodb, SiPython } from "react-icons/si"

import { Browser, Checkbox, MacInstaller, MacWindow, Mark, MONO_FONT, WinWindow, Wizard } from "@/components/docs/screens/kit"
import { term } from "@/components/docs/screens/fullstack"
import { VSCode } from "@/components/docs/screens/vscode"
import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * Screens for the track-specific tool parts (data/docs/setup/tools.ts):
 * Python, Docker, MongoDB Atlas, Java, Expo, Power BI, and the extension
 * search for Python and Java tracks.
 */

type Screen = (os: OS) => React.ReactNode

const pyIcon = <SiPython className="size-4 text-[#3776ab]" />
const tc = (os: OS, lines: Parameters<typeof term>[2], extra = {}) => term(os, "devvy", lines, { tree: [], ...extra })

/* ------------------------------------------------------------------ */
/* VS Code extensions                                                  */
/* ------------------------------------------------------------------ */

function extensions(
  os: OS,
  query: string,
  first: { name: string; publisher: string; desc: string; color: string; letter: string },
  others: (typeof first)[]
) {
  return (
    <VSCode
      os={os}
      folder="devvy"
      tree={[]}
      sidebar="extensions"
      marks={{ extensionsIcon: 1, extensionsSearch: 2 }}
      extensions={{ query, items: [{ ...first, mark: 3 }, ...others] }}
    />
  )
}

const extPython: Screen = (os) =>
  extensions(
    os,
    "Python",
    { name: "Python", publisher: "Microsoft", desc: "Python language support with extension access points…", color: "#3776ab", letter: "Py" },
    [
      { name: "Python Debugger", publisher: "Microsoft", desc: "Python Debugger extension using debugpy.", color: "#3776ab", letter: "Py" },
      { name: "Pylance", publisher: "Microsoft", desc: "A performant, feature-rich language server…", color: "#3776ab", letter: "Py" },
    ]
  )

const extJava: Screen = (os) =>
  extensions(
    os,
    "Extension Pack for Java",
    { name: "Extension Pack for Java", publisher: "Microsoft", desc: "Popular extensions for Java development…", color: "#e76f00", letter: "J" },
    [
      { name: "Language Support for Java", publisher: "Red Hat", desc: "Java Linting, Intellisense, formatting…", color: "#c00", letter: "J" },
      { name: "Debugger for Java", publisher: "Microsoft", desc: "A lightweight Java debugger for VS Code", color: "#e76f00", letter: "J" },
    ]
  )

/* ------------------------------------------------------------------ */
/* Python                                                              */
/* ------------------------------------------------------------------ */

function PythonOrg({ os, url, children }: { os: OS; url: string; children: React.ReactNode }) {
  return (
    <Browser os={os} url={url} tab="Download Python | Python.org" tabIcon={pyIcon}>
      <div className="bg-[#2b5b84] px-8 py-3 text-white">
        <p className="flex items-center gap-2 text-[18px] font-semibold">
          <SiPython className="size-6 text-[#ffd343]" /> python<span className="text-[11px] align-super">™</span>
        </p>
      </div>
      <div className="bg-white px-8 py-6 text-[#333]">{children}</div>
    </Browser>
  )
}

const pyMacDownload: Screen = (os) =>
  os === "mac" ? (
    <PythonOrg os={os} url="python.org/downloads">
      <p className="text-[22px] text-[#3c3c3c]">Download the latest version for macOS</p>
      <Mark n={1} className="mt-4 inline-block">
        <span className="flex h-11 items-center gap-2 rounded bg-[#ffd343] px-5 text-[15px] font-semibold text-[#333]">
          <Download className="size-4" /> Download Python 3.14.0
        </span>
      </Mark>
      <p className="mt-4 text-[12.5px] text-[#666]">Looking for Python with a different OS? Python for Windows, Linux/Unix, macOS, Android, Other</p>
    </PythonOrg>
  ) : null

const pyMacInstaller: Screen = (os) =>
  os === "mac" ? (
    <MacInstaller app="Python" step={0} heading="Welcome to the Python Installer" mark={1}>
      This package will install Python 3.14 for macOS 10.13 or later. Python is an interpreted, interactive, object-oriented programming language.
    </MacInstaller>
  ) : null

const pyWinDownload: Screen = (os) =>
  os === "windows" ? (
    <PythonOrg os={os} url="python.org/downloads/windows">
      <p className="text-[22px] text-[#3c3c3c]">Python Releases for Windows</p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-[13px] text-[#3776ab]">
        <li>Latest Python 3 Release - Python 3.14.0</li>
      </ul>
      <p className="mt-4 text-[15px] font-semibold">Stable Releases</p>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-[13px]">
        <li>
          <span className="text-[#3776ab]">Python 3.14.0 - Oct. 7, 2025</span>
          <ul className="mt-1 list-[circle] space-y-1 pl-5 text-[12.5px] text-[#3776ab]">
            <li>
              <Mark n={1} className="inline-block">
                <span className="px-1">Download Windows installer (64-bit)</span>
              </Mark>
            </li>
            <li>Download Windows installer (ARM64)</li>
            <li>Download Windows embeddable package (64-bit)</li>
          </ul>
        </li>
      </ul>
    </PythonOrg>
  ) : null

const pyWinInstaller: Screen = (os) =>
  os === "windows" ? (
    <WinWindow title="Python 3.14.0 (64-bit) Setup" icon={pyIcon} className="w-[620px]">
      <div className="flex">
        <div className="flex w-40 items-end justify-center bg-[linear-gradient(#ffffff,#e8eef6)] pb-6">
          <SiPython className="size-20 text-[#3776ab]" />
        </div>
        <div className="flex-1 p-6 text-[12.5px] text-[#1f1f1f]">
          <p className="text-[19px] text-[#1f3e7a]">Install Python 3.14.0 (64-bit)</p>
          <p className="mt-2 text-[#444]">
            Select Install Now to install Python with default settings, or choose Customize to enable or disable features.
          </p>
          <Mark n={2} className="mt-5">
            <div className="flex items-start gap-3 rounded border border-transparent px-2 py-2 hover:border-[#ccc]">
              <ArrowRight className="mt-1 size-5 text-[#1f3e7a]" />
              <div>
                <p className="text-[15px] text-[#1f3e7a]">Install Now</p>
                <p className="text-[11px] text-[#666]">C:\Users\Asha\AppData\Local\Programs\Python\Python314</p>
                <p className="text-[11px] text-[#666]">Includes IDLE, pip and documentation</p>
              </div>
            </div>
          </Mark>
          <div className="mt-3 flex items-start gap-3 px-2 py-2">
            <ArrowRight className="mt-1 size-5 text-[#1f3e7a]" />
            <p className="text-[15px] text-[#1f3e7a]">Customize installation</p>
          </div>
          <div className="mt-5 space-y-2 border-t border-[#ddd] pt-4">
            <Checkbox checked label="Use admin privileges when installing py.exe" />
            <Mark n={1} className="inline-block pr-2">
              <Checkbox checked label={<b>Add python.exe to PATH</b>} />
            </Mark>
          </div>
        </div>
      </div>
    </WinWindow>
  ) : null

const pyWinPolicy: Screen = (os) =>
  os === "windows"
    ? tc(
        os,
        [
          { cmd: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned" },
          { out: "" },
          { out: "Execution Policy Change", tone: "bold" },
          { out: "The execution policy helps protect you from scripts that you do not trust. Do you want to change the execution policy?" },
          { out: '[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"): Y', mark: 1 },
          { cmd: "" },
        ],
        { panel: 0.68 }
      )
    : null

const pyLinux: Screen = (os) =>
  os === "linux"
    ? tc(os, [
        { cmd: "sudo apt install -y python3 python3-pip python3-venv" },
        { out: "[sudo] password for asha:" },
        { out: "The following NEW packages will be installed:" },
        { out: "  python3-pip python3-venv python3.12-venv" },
        { out: "Setting up python3-venv (3.12.3-0ubuntu2) ..." },
        { cmd: "" },
      ])
    : null

const pyVersion: Screen = (os) =>
  tc(os, [
    { cmd: os === "windows" ? "python --version" : "python3 --version" },
    { out: os === "linux" ? "Python 3.12.3" : "Python 3.14.0", tone: "ok", mark: 1 },
    { cmd: "" },
  ])

/* ------------------------------------------------------------------ */
/* Docker                                                              */
/* ------------------------------------------------------------------ */

const dockerIcon = <SiDocker className="size-4 text-[#1d63ed]" />

const dockerDownload: Screen = (os) =>
  os === "linux" ? null : (
    <Browser os={os} url="docker.com/products/docker-desktop" tab="Docker Desktop" tabIcon={dockerIcon}>
      <div className="flex min-h-[260px] gap-8 bg-[#f4f4f6] px-10 py-8 text-[#0b214a]">
        <div className="flex-1">
          <p className="text-[12px] font-semibold tracking-wide text-[#1d63ed] uppercase">Docker Desktop</p>
          <p className="mt-2 text-[28px] leading-tight font-bold">The #1 containerization software for developers</p>
        </div>
        <div className="relative w-64">
          <span className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#1d63ed] text-[13px] font-semibold text-white">
            Download Docker Desktop <ChevronDown className="size-4" />
          </span>
          <div className="mt-1 rounded-md border border-[#d6d9e0] bg-white p-1 text-[12.5px] shadow-lg">
            {[
              { label: "Download for Mac – Apple Silicon", me: os === "mac" },
              { label: "Download for Mac – Intel Chip", me: false },
              { label: "Download for Windows – AMD64", me: os === "windows" },
              { label: "Download for Windows – ARM64", me: false },
            ].map(({ label, me }) =>
              me ? (
                <Mark key={label} n={1} badge="r">
                  <p className="rounded bg-[#e5edfd] px-3 py-2 font-semibold">{label}</p>
                </Mark>
              ) : (
                <p key={label} className="px-3 py-2">
                  {label}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </Browser>
  )

const dockerMacDrag: Screen = (os) =>
  os === "mac" ? (
    <MacWindow title="Docker" className="mx-auto w-[460px]">
      <div className="flex items-center justify-center gap-12 bg-[#f7f7f7] py-12">
        <Mark n={1}>
          <div className="flex flex-col items-center gap-1 p-1">
            <SiDocker className="size-16 text-[#1d63ed]" />
            <span className="text-[12px]">Docker</span>
          </div>
        </Mark>
        <ArrowRight className="size-8 text-[#8a8a8a]" />
        <Mark n={2}>
          <div className="flex flex-col items-center gap-1 p-1">
            <span className="flex size-16 items-center justify-center rounded-xl bg-[#5aaeef] text-[24px] text-white">A</span>
            <span className="text-[12px]">Applications</span>
          </div>
        </Mark>
      </div>
    </MacWindow>
  ) : null

const dockerWinConfig: Screen = (os) =>
  os === "windows" ? (
    <WinWindow title="Installing Docker Desktop" icon={dockerIcon} className="mx-auto w-[580px]">
      <div className="space-y-4 p-6 text-[12.5px]">
        <p className="text-[18px] font-semibold">Configuration</p>
        <Mark n={1} className="inline-block pr-2">
          <Checkbox checked label="Use WSL 2 instead of Hyper-V (recommended)" />
        </Mark>
        <Checkbox checked label="Add shortcut to desktop" />
        <div className="flex justify-end pt-6">
          <Mark n={2}>
            <span className="block rounded bg-[#1d63ed] px-6 py-1.5 text-white">OK</span>
          </Mark>
        </div>
      </div>
    </WinWindow>
  ) : null

const dockerRunning: Screen = (os) =>
  os === "linux" ? null : (
    <MacWindow title={os === "mac" ? "Docker Desktop" : undefined} className="mx-auto w-[640px]">
      <div className="flex min-h-[280px] bg-[#f4f4f6] text-[#0b214a]" style={{ fontFamily: os === "windows" ? "Segoe UI" : undefined }}>
        <div className="w-44 shrink-0 space-y-1 border-r border-[#e1e3e8] bg-white p-3 text-[12.5px]">
          <p className="mb-3 flex items-center gap-2 text-[14px] font-bold">
            <SiDocker className="size-5 text-[#1d63ed]" /> docker desktop
          </p>
          {["Containers", "Images", "Volumes", "Builds", "Docker Scout", "Extensions"].map((s, i) => (
            <p key={s} className={cn("rounded px-2 py-1", i === 0 && "bg-[#e5edfd] font-semibold")}>
              {s}
            </p>
          ))}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-5">
            <p className="text-[16px] font-semibold">Containers</p>
            <div className="mt-6 flex flex-col items-center gap-2 text-center text-[12px] text-[#677285]">
              <SiDocker className="size-10 text-[#c2c8d3]" />
              <p className="font-semibold text-[#0b214a]">Your running containers show up here</p>
              <p>A container is an isolated environment for your code.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-[#e1e3e8] bg-white px-3 py-1.5 text-[11px]">
            <Mark n={1} badge="tr">
              <span className="flex items-center gap-1.5 rounded bg-[#e6f6ec] px-2 py-0.5 font-semibold text-[#1a7f37]">
                <span className="size-2 rounded-full bg-[#1a7f37]" /> Engine running
              </span>
            </Mark>
            <span className="text-[#677285]">RAM 1.2 GB · CPU 0.4%</span>
          </div>
        </div>
      </div>
    </MacWindow>
  )

const dockerLinux: Screen = (os) =>
  os === "linux"
    ? tc(
        os,
        [
          { cmd: "curl -fsSL https://get.docker.com -o get-docker.sh" },
          { cmd: "sudo sh get-docker.sh" },
          { out: "# Executing docker install script, commit: 4c94a56" },
          { out: "+ sh -c apt-get install -y docker-ce docker-ce-cli containerd.io ..." },
          { out: "Client: Docker Engine - Community  Version: 28.5.1", tone: "ok" },
          { cmd: "sudo usermod -aG docker $USER" },
          { cmd: "" },
        ],
        { panel: 0.68 }
      )
    : null

const dockerHello: Screen = (os) =>
  tc(
    os,
    [
      { cmd: "docker run --rm hello-world" },
      { out: "Unable to find image 'hello-world:latest' locally" },
      { out: "latest: Pulling from library/hello-world" },
      { out: "Status: Downloaded newer image for hello-world:latest" },
      { out: "" },
      { out: "Hello from Docker!", tone: "ok", mark: 1 },
      { out: "This message shows that your installation appears to be working correctly." },
    ],
    { panel: 0.68 }
  )

/* ------------------------------------------------------------------ */
/* MongoDB Atlas                                                       */
/* ------------------------------------------------------------------ */

function Atlas({ os, children }: { os: OS; children: React.ReactNode }) {
  return (
    <Browser
      os={os}
      url="cloud.mongodb.com"
      tab="Deploy your cluster | Cloud: MongoDB Cloud"
      tabIcon={<SiMongodb className="size-3.5 text-[#00684a]" />}
    >
      <div className="flex min-h-[320px] bg-[#f9fbfa] text-[#001e2b]">
        <div className="w-36 shrink-0 space-y-1 border-r border-[#e8edeb] bg-white p-3 text-[12px]">
          <p className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-[#00684a]">
            <SiMongodb className="size-4" /> Atlas
          </p>
          {["Overview", "Clusters", "Database Access", "Network Access"].map((s) => (
            <p key={s} className="rounded px-2 py-1">
              {s}
            </p>
          ))}
        </div>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </Browser>
  )
}

const mongoCluster: Screen = (os) => (
  <Atlas os={os}>
    <p className="text-[18px] font-semibold">Deploy your cluster</p>
    <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
      {[
        { name: "M10", price: "$0.08/hour", me: false },
        { name: "Flex", price: "From $0.011/hour", me: false },
        { name: "Free", price: "Free forever", me: true },
      ].map((p) =>
        p.me ? (
          <Mark key={p.name} n={1}>
            <div className="rounded-lg border-2 border-[#00684a] bg-white p-3">
              <p className="text-[15px] font-bold">{p.name}</p>
              <p className="text-[#5c6c75]">{p.price}</p>
              <p className="mt-2 text-[11px] text-[#5c6c75]">512 MB storage · Shared RAM</p>
            </div>
          </Mark>
        ) : (
          <div key={p.name} className="rounded-lg border border-[#e8edeb] bg-white p-3 opacity-70">
            <p className="text-[15px] font-bold">{p.name}</p>
            <p className="text-[#5c6c75]">{p.price}</p>
          </div>
        )
      )}
    </div>
    <div className="mt-6 flex justify-end">
      <Mark n={2}>
        <span className="block rounded-md bg-[#00684a] px-4 py-2 text-[12.5px] font-semibold text-white">Create Deployment</span>
      </Mark>
    </div>
  </Atlas>
)

const mongoUser: Screen = (os) => (
  <Atlas os={os}>
    <p className="text-[18px] font-semibold">Connect to Cluster0</p>
    <p className="mt-1 text-[12.5px] text-[#5c6c75]">Create a database user</p>
    <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
      <div>
        <p className="mb-1 font-semibold">Username</p>
        <p className="rounded border border-[#c1c7c6] bg-white px-2 py-1.5">asha</p>
      </div>
      <div>
        <p className="mb-1 font-semibold">Password</p>
        <Mark n={1}>
          <p className="flex items-center justify-between rounded border border-[#c1c7c6] bg-white px-2 py-1.5" style={{ fontFamily: MONO_FONT }}>
            Qx7rT2mLp9vB4wZk <Copy className="size-3.5 text-[#00684a]" />
          </p>
        </Mark>
      </div>
    </div>
    <div className="mt-6">
      <Mark n={2} className="inline-block">
        <span className="block rounded-md bg-[#00684a] px-4 py-2 text-[12.5px] font-semibold text-white">Create Database User</span>
      </Mark>
    </div>
  </Atlas>
)

const mongoConnect: Screen = (os) => (
  <Atlas os={os}>
    <p className="text-[18px] font-semibold">Connect to Cluster0</p>
    <p className="mt-1 text-[12.5px] text-[#5c6c75]">Add your connection string into your application code</p>
    <Mark n={1} className="mt-4">
      <div
        className="flex items-center justify-between rounded border border-[#c1c7c6] bg-[#f9fbfa] px-3 py-2 text-[11.5px]"
        style={{ fontFamily: MONO_FONT }}
      >
        mongodb+srv://asha:&lt;db_password&gt;@cluster0.abcde.mongodb.net/
        <Copy className="size-4 text-[#00684a]" />
      </div>
    </Mark>
    <p className="mt-3 text-[12px] text-[#5c6c75]">Replace &lt;db_password&gt; with the password for the asha database user.</p>
  </Atlas>
)

/* ------------------------------------------------------------------ */
/* Java                                                                */
/* ------------------------------------------------------------------ */

const adoptiumIcon = <SiEclipseadoptium className="size-4 text-[#ff1464]" />

const jdkDownload: Screen = (os) =>
  os === "linux" ? null : (
    <Browser os={os} url="adoptium.net/temurin/releases/?version=21" tab="Latest Releases | Adoptium" tabIcon={adoptiumIcon}>
      <div className="bg-white px-8 py-6 text-[#14003c]">
        <p className="text-[24px] font-bold">Temurin™ JDK 21 - LTS</p>
        <div className="mt-4 flex gap-3 text-[12px]">
          {[os === "mac" ? "macOS" : "Windows", os === "mac" ? "aarch64" : "x64", "JDK", "21 - LTS"].map((f) => (
            <span key={f} className="flex items-center gap-1 rounded border border-[#d0d0d8] px-3 py-1.5">
              {f} <ChevronDown className="size-3" />
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-lg border border-[#e3e3ea] p-4">
          <div>
            <p className="text-[14px] font-semibold">jdk-21.0.8+9</p>
            <p className="text-[12px] text-[#666]">{os === "mac" ? "macOS · aarch64" : "Windows · x64"} · JDK</p>
          </div>
          <div className="flex gap-2">
            <Mark n={1}>
              <span className="flex items-center gap-1.5 rounded-md bg-[#ff1464] px-4 py-2 text-[12.5px] font-semibold text-white">
                <Download className="size-3.5" /> {os === "mac" ? ".pkg" : ".msi"}
              </span>
            </Mark>
            <span className="flex items-center gap-1.5 rounded-md border border-[#d0d0d8] px-4 py-2 text-[12.5px]">
              {os === "mac" ? ".tar.gz" : ".zip"}
            </span>
          </div>
        </div>
      </div>
    </Browser>
  )

const jdkMacInstaller: Screen = (os) =>
  os === "mac" ? (
    <MacInstaller app="Eclipse Temurin" step={0} heading="Welcome to the Eclipse Temurin Installer" mark={1}>
      You will be guided through the steps necessary to install Eclipse Temurin 21 on your Mac.
    </MacInstaller>
  ) : null

const jdkWinSetup: Screen = (os) =>
  os === "windows" ? (
    <Wizard
      title="Eclipse Temurin JDK with Hotspot 21 (x64) Setup"
      icon={adoptiumIcon}
      heading="Custom Setup"
      sub="Select the way you want features to be installed."
      nextMark={2}
    >
      <div className="rounded border border-[#c8c8c8] bg-white p-2 text-[12px]">
        {[
          { label: "Add to PATH", on: true },
          { label: "Associate .jar", on: true },
          { label: "Set JAVA_HOME variable", on: false, me: true },
          { label: "JavaSoft (Oracle) registry keys", on: false },
        ].map((f) => {
          const row = (
            <p className="flex items-center gap-2 py-1 pl-2">
              {f.on || f.me ? (
                <span className="flex size-4 items-center justify-center rounded-sm border border-[#888] bg-[#f3f3f3]">
                  <Check className="size-3 text-[#2e7d32]" />
                </span>
              ) : (
                <span className="flex size-4 items-center justify-center rounded-sm border border-[#888] bg-[#f3f3f3]">
                  <X className="size-3 text-[#c62828]" />
                </span>
              )}
              {f.label}
              {f.me && <span className="ml-2 text-[11px] text-[#2e7d32]">Will be installed on local hard drive</span>}
            </p>
          )
          return f.me ? (
            <Mark key={f.label} n={1} badge="r" className="mr-8">
              {row}
            </Mark>
          ) : (
            <div key={f.label}>{row}</div>
          )
        })}
      </div>
    </Wizard>
  ) : null

const jdkLinux: Screen = (os) =>
  os === "linux"
    ? tc(os, [
        { cmd: "sudo apt install -y openjdk-21-jdk" },
        { out: "The following NEW packages will be installed:" },
        { out: "  openjdk-21-jdk openjdk-21-jdk-headless openjdk-21-jre ..." },
        { out: "Setting up openjdk-21-jdk:amd64 (21.0.8+9~us1-0ubuntu1) ..." },
        { cmd: "" },
      ])
    : null

const jdkVersion: Screen = (os) =>
  tc(os, [
    { cmd: "java -version" },
    { out: 'openjdk version "21.0.8" 2025-07-15 LTS', tone: "ok", mark: 1 },
    { out: "OpenJDK Runtime Environment Temurin-21.0.8+9 (build 21.0.8+9-LTS)" },
    { out: "OpenJDK 64-Bit Server VM Temurin-21.0.8+9 (build 21.0.8+9-LTS, mixed mode, sharing)" },
    { cmd: "" },
  ])

/* ------------------------------------------------------------------ */
/* Expo                                                                */
/* ------------------------------------------------------------------ */

/** A phone outline. Used for the store, Expo Go and the running app. */
export function Phone({ kind, children, className }: { kind: "android" | "iphone"; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-[220px] rounded-[34px] bg-[#111] p-2.5 shadow-[0_22px_50px_-14px_rgba(0,0,0,0.45)]", className)}>
      <div
        className="relative h-[430px] overflow-hidden rounded-[26px] bg-white text-[#111]"
        style={{ fontFamily: "-apple-system, Roboto, sans-serif" }}
      >
        <div className="flex h-7 items-center justify-between px-5 text-[10px] font-semibold">
          <span>9:41</span>
          {kind === "iphone" ? <span className="h-4 w-16 rounded-full bg-[#111]" /> : <span className="size-2.5 rounded-full bg-[#111]" />}
          <span>●●● 100%</span>
        </div>
        {children}
      </div>
    </div>
  )
}

const expoStore: Screen = () => (
  <div className="flex justify-center gap-14 py-2">
    {(["android", "iphone"] as const).map((kind) => (
      <div key={kind} className="flex flex-col items-center gap-2">
        <p className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#333] shadow-sm">
          {kind === "android" ? <SiAndroid className="size-4 text-[#3ddc84]" /> : <SiApple className="size-4" />}
          {kind === "android" ? "Android — Play Store" : "iPhone — App Store"}
        </p>
        <Phone kind={kind}>
          <div className="p-4">
            <p className="flex items-center gap-2 rounded-full bg-[#f1f3f4] px-3 py-1.5 text-[11px] text-[#5f6368]">
              <Search className="size-3" /> Expo Go
            </p>
            <div className="mt-5 flex gap-3">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-[#000]">
                <SiExpo className="size-8 text-white" />
              </span>
              <div>
                <p className="text-[14px] font-semibold">Expo Go</p>
                <p className="text-[11px] text-[#5f6368]">650 Industries, Inc.</p>
                <p className="text-[10px] text-[#5f6368]">4.6 ★ · 10M+ downloads</p>
              </div>
            </div>
            <Mark n={kind === "android" ? 1 : 2} badge="br" className="mt-5">
              <span
                className={cn(
                  "block py-2 text-center text-[12px] font-semibold text-white",
                  kind === "android" ? "rounded-full bg-[#01875f]" : "rounded-full bg-[#0071e3]"
                )}
              >
                {kind === "android" ? "Install" : "Get"}
              </span>
            </Mark>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 rounded-lg bg-[#eef0f3]" />
              ))}
            </div>
          </div>
        </Phone>
      </div>
    ))}
  </div>
)

const expoSignup: Screen = (os) => (
  <Browser os={os} url="expo.dev/signup" tab="Sign up — Expo" tabIcon={<SiExpo className="size-3.5" />}>
    <div className="flex justify-center bg-white px-10 py-8 text-[#000]">
      <div className="w-[340px]">
        <SiExpo className="mx-auto size-9" />
        <p className="mt-3 text-center text-[20px] font-bold">Create your account</p>
        <Mark n={1} className="mt-5">
          <div className="space-y-3 p-1 text-[12px]">
            {[
              ["Email", "asha@example.com"],
              ["Username", "asha-rao"],
              ["Password", "••••••••••••"],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="mb-1 font-semibold">{l}</p>
                <p className="rounded-md border border-[#d9d9d9] px-3 py-2">{v}</p>
              </div>
            ))}
          </div>
        </Mark>
        <Mark n={2} className="mt-4">
          <span className="block rounded-md bg-[#000] py-2 text-center text-[13px] font-semibold text-white">Sign up</span>
        </Mark>
      </div>
    </div>
  </Browser>
)

/* ------------------------------------------------------------------ */
/* Power BI                                                            */
/* ------------------------------------------------------------------ */

const powerbiStore: Screen = (os) =>
  os === "windows" ? (
    <WinWindow title="Microsoft Store" className="mx-auto w-[640px]">
      <div className="flex gap-5 bg-[#f3f3f3] p-6">
        <span className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-[#f2c811]">
          <BarChart3 className="size-14 text-[#1f1f1f]" />
        </span>
        <div className="flex-1">
          <p className="text-[22px] font-semibold">Power BI Desktop</p>
          <p className="text-[12.5px] text-[#5f5f5f]">Microsoft Corporation</p>
          <p className="mt-2 text-[12px] text-[#5f5f5f]">Create rich interactive reports with visual analytics at your fingertips.</p>
          <Mark n={1} className="mt-4 inline-block">
            <span className="block rounded bg-[#005fb8] px-10 py-1.5 text-[13px] text-white">Get</span>
          </Mark>
          <p className="mt-2 text-[11px] text-[#5f5f5f]">Free</p>
        </div>
      </div>
    </WinWindow>
  ) : null

/* ------------------------------------------------------------------ */

export const toolScreens: Record<string, Screen> = {
  "vscode-extensions-python": extPython,
  "vscode-extensions-java": extJava,
  "py-mac-download": pyMacDownload,
  "py-mac-installer": pyMacInstaller,
  "py-win-download": pyWinDownload,
  "py-win-installer": pyWinInstaller,
  "py-win-policy": pyWinPolicy,
  "py-linux": pyLinux,
  "py-version": pyVersion,
  "docker-download": dockerDownload,
  "docker-mac-drag": dockerMacDrag,
  "docker-win-config": dockerWinConfig,
  "docker-running": dockerRunning,
  "docker-linux": dockerLinux,
  "docker-hello": dockerHello,
  "mongo-cluster": mongoCluster,
  "mongo-user": mongoUser,
  "mongo-connect": mongoConnect,
  "jdk-download": jdkDownload,
  "jdk-mac-installer": jdkMacInstaller,
  "jdk-win-setup": jdkWinSetup,
  "jdk-linux": jdkLinux,
  "jdk-version": jdkVersion,
  "expo-store": expoStore,
  "expo-signup": expoSignup,
  "powerbi-store": powerbiStore,
}
