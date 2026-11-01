import type { ProjectDocs } from "@/data/docs/types"
import type { TrackSlug } from "@/data/tracks"

/*
 * Mermaid diagram sources generated from the structured project docs, so
 * every project gets a system design, data model and flow diagram that stay
 * in sync with its content.
 */

/** Quoted Mermaid label; double quotes inside become the #quot; entity. */
const q = (text: string) => `"${text.replace(/"/g, "#quot;")}"`

const ACCENT = "classDef accent stroke:#ff2a33,stroke-width:2px"

function entityList(project: ProjectDocs, max = 4) {
  const names = project.data.map((d) => d.name.replace(/\s*\(.*\)$/, ""))
  return names.length > max ? `${names.slice(0, max).join(" · ")} …` : names.join(" · ")
}

/** How the pieces of the system connect — one template per track, filled with the project's data. */
export function systemDiagram(track: TrackSlug, project: ProjectDocs): string {
  const data = entityList(project)

  switch (track) {
    case "full-stack":
      return `flowchart LR
  user([User · browser]) -->|HTTPS| client[${q("React client<br/>Vite · Vercel")}]
  client -->|${q("REST + JWT")}| api[${q("Express API<br/>Render")}]
  api -->|Prisma| db[(${q(`PostgreSQL<br/>${data}`)})]
  api -.->|${q("bcrypt · JWT")}| auth[Auth]
  class api accent
  ${ACCENT}`

    case "backend":
      return `flowchart LR
  client([${q("API client<br/>Swagger · curl")}]) -->|HTTPS| routes[${q("Routes<br/>zod validation")}]
  routes --> limit{{Rate limiter}}
  limit --> services[${q("Services<br/>business rules")}]
  services <-->|${q("cache reads")}| redis[(Redis)]
  services -->|Prisma| db[(${q(`PostgreSQL / MongoDB<br/>${data}`)})]
  routes -.-> docs[${q("Swagger docs<br/>/docs")}]
  class services accent
  ${ACCENT}`

    case "frontend":
      return `flowchart LR
  user([User · browser]) --> pages[${q("Next.js App Router<br/>Vercel")}]
  pages -->|${q("server fetch")}| source[(${q(`Data source<br/>${data}`)})]
  pages --> ui[${q("Client components<br/>shadcn/ui")}]
  ui -->|React Query| source
  ui <--> store[${q("Zustand store")}]
  class pages accent
  ${ACCENT}`

    case "app-development": {
      const usesApi = /REST API/.test(project.overview)
      return `flowchart LR
  user([User · phone]) --> screens[${q("React Native screens<br/>Expo")}]
  screens <--> nav[React Navigation]
  screens <--> state[App state]
  state <--> storage[(${q(`AsyncStorage<br/>${data}`)})]
  screens --> notify[${q("Expo Notifications")}]${usesApi ? `\n  state -->|REST| api[${q("Restaurant API")}]` : ""}
  class screens accent
  ${ACCENT}`
    }

    case "ai-ml":
      if (project.slug === "document-qa") {
        return `flowchart LR
  pdf[(PDF files)] --> chunk[${q("Extract & chunk text")}] --> embed[Embeddings] --> index[(${q("Vector index<br/>FAISS / Chroma")})]
  user([User]) -->|question| api[FastAPI]
  api -->|${q("top-k search")}| index
  api -->|${q("question + chunks")}| llm[LLM API]
  llm -->|${q("answer + citations")}| api
  api --> ui[Streamlit chat] --> user
  class api accent
  ${ACCENT}`
      }
      return `flowchart LR
  data[(${q(`Dataset<br/>${data}`)})] --> nb[${q("Jupyter<br/>clean · explore")}]
  nb --> train[${q("Train & evaluate<br/>scikit-learn")}]
  train --> model[[model.joblib]]
  model --> api[FastAPI]
  api --> app[Streamlit app]
  app --> user([User])
  class train accent
  ${ACCENT}`

    case "data-science":
      return `flowchart LR
  raw[(${q(`Raw data<br/>${data}`)})] --> clean[${q("Clean with pandas")}]
  clean --> sqlite[(SQLite)]
  sqlite --> analysis[${q("SQL + pandas<br/>analysis")}]
  analysis --> dash[${q("Dashboard<br/>Streamlit / Power BI")}]
  analysis --> report[${q("Insights report")}]
  class analysis accent
  ${ACCENT}`

    case "python": {
      const extra =
        project.slug === "web-scraper"
          ? `\n  core -->|requests| web([Target websites])\n  core --> alert[${q("Email / Telegram alert")}]`
          : project.slug === "automation-toolkit"
            ? `\n  core <--> files[(${q("Your folders")})]`
            : ""
      return `flowchart LR
  user([User]) --> cli[${q("CLI · argparse")}]
  user --> api[${q("FastAPI")}]
  cli --> core[${q("Core module")}]
  api --> core
  core --> db[(${q(`SQLite<br/>${data}`)})]${extra}
  tests[pytest] -.-> core
  class core accent
  ${ACCENT}`
    }

    case "java":
      return `flowchart LR
  client([API client]) -->|HTTP| ctrl[Controllers]
  ctrl --> svc[${q("Services<br/>@Transactional")}]
  svc --> repo[${q("Repositories<br/>Spring Data JPA")}]
  repo --> db[(${q(`PostgreSQL<br/>${data}`)})]
  class svc accent
  ${ACCENT}`

    case "ui-ux":
      return `flowchart LR
  research[${q("Research<br/>interviews")}] --> synth[${q("Personas &<br/>journey map")}]
  synth --> flows[User flows] --> wire[Wireframes]
  wire --> ds[Design system] --> hifi[Hi-fi screens]
  hifi --> proto[Prototype] --> test{Usability test}
  test -->|iterate| hifi
  test --> study[Case study]
  class proto accent
  ${ACCENT}`
  }
}

/* ------------------------------------------------------------------ */
/* Data model (ER diagram)                                             */
/* ------------------------------------------------------------------ */

const entityId = (name: string) =>
  name
    .replace(/\(.*?\)/g, "")
    .replace(/\.csv$/i, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase() || "ENTITY"

function attributeType(name: string) {
  if (name === "id") return "id"
  if (/(At|On|_at|_on|date|Date)$/.test(name) || /^date$/i.test(name)) return "date"
  if (/(amount|price|Price|total|Total|count|Count|Copies|copies|limit|Limit|stock|quantity|Seats|balance|fine|Minutes|sqft|bath|balcony|runs|ball|over|inning|margin|sales|profit|discount|rating|Average|weekday|Level|InPaise|Loans|PerWeek)/.test(name))
    return "number"
  return "string"
}

/** ER diagram for projects with entities; null for the design track. */
export function dataDiagram(track: TrackSlug, project: ProjectDocs): string | null {
  if (track === "ui-ux") return null

  const lines = ["erDiagram"]
  const relations: string[] = []
  const ids = new Set(project.data.map((d) => entityId(d.name)))

  for (const entity of project.data) {
    const id = entityId(entity.name)
    lines.push(`  ${id}[${q(entity.name)}] {`)
    for (const field of entity.fields) {
      if (/^unique\b/i.test(field)) continue
      const relation = field.match(/^(\w+)\s*→\s*(\w+)/)
      if (relation) {
        const [, name, target] = relation
        lines.push(`    ref ${name} FK`)
        if (ids.has(entityId(target))) relations.push(`  ${entityId(target)} ||--o{ ${id} : has`)
        continue
      }
      const name = field.match(/^[A-Za-z_][\w-]*/)?.[0]
      if (!name) continue
      const note = field.slice(name.length).replace(/^\[\]/, " (list)").replace(/[()"]/g, "").trim()
      lines.push(`    ${attributeType(name)} ${name}${name === "id" ? " PK" : ""}${note ? ` ${q(note)}` : ""}`)
    }
    lines.push("  }")
  }

  return [...lines, ...relations].join("\n")
}

/* ------------------------------------------------------------------ */
/* User flows                                                          */
/* ------------------------------------------------------------------ */

/** A user flow as a top-down flowchart: start, steps, and the outcome highlighted. */
export function flowDiagram(steps: string[]): string {
  const nodes = steps.map((step, i) => {
    const id = `s${i}`
    if (i === 0) return `  ${id}([${q(step)}])`
    if (i === steps.length - 1) return `  ${id}[${q(step)}]:::accent`
    return `  ${id}[${q(step)}]`
  })
  const edges = steps.slice(1).map((_, i) => `  s${i} --> s${i + 1}`)
  return ["flowchart TD", ...nodes, ...edges, `  ${ACCENT}`].join("\n")
}
