import {
  Accessibility,
  BarChart3,
  Bell,
  Boxes,
  ChartLine,
  ChartScatter,
  Cloud,
  Code,
  Component,
  Database,
  Eraser,
  FileSearch,
  FolderOpen,
  Gauge,
  Globe,
  HardDrive,
  ClipboardList,
  Layers,
  LayoutTemplate,
  MousePointerClick,
  Navigation,
  Presentation,
  Sigma,
  Sparkles,
  Target,
  TriangleAlert,
  UserRound,
  Users,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import type { CSSProperties } from "react"
import type { IconType } from "react-icons"
import { FaJava } from "react-icons/fa"
import {
  SiAndroid,
  SiApachemaven,
  SiCss,
  SiDocker,
  SiExpo,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiGit,
  SiHibernate,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiJunit5,
  SiJupyter,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPlotly,
  SiPostgresql,
  SiPrisma,
  SiPydantic,
  SiPytest,
  SiPython,
  SiPytorch,
  SiReact,
  SiReactquery,
  SiRender,
  SiRedis,
  SiScikitlearn,
  SiShadcnui,
  SiSpringboot,
  SiSqlite,
  SiStreamlit,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si"

import { cn } from "@/lib/utils"

type Brand = {
  icon: IconType
  /** Brand colour on light backgrounds; omit for marks that are black in their brand kit. */
  light?: string
  /** Brand colour on dark backgrounds when the light one would disappear. */
  dark?: string
}

const react: Brand = { icon: SiReact, light: "#087ea4", dark: "#61dafb" }
const python: Brand = { icon: SiPython, light: "#3776ab", dark: "#ffd43b" }

/**
 * Maps a skill label to its brand mark, in the brand's own colour.
 * Monochrome marks (Express, Next.js, Expo, Prisma, shadcn/ui, Vercel, Render, JWT)
 * follow the text colour instead.
 */
const brand: Record<string, Brand> = {
  // Web
  React: react,
  "Next.js": { icon: SiNextdotjs },
  HTML: { icon: SiHtml5, light: "#e34f26" },
  CSS: { icon: SiCss, light: "#663399", dark: "#a56de2" },
  JavaScript: { icon: SiJavascript, light: "#b59a00", dark: "#f7df1e" },
  TypeScript: { icon: SiTypescript, light: "#3178c6", dark: "#5b9be6" },
  "Tailwind CSS": { icon: SiTailwindcss, light: "#06b6d4" },
  "shadcn/ui": { icon: SiShadcnui },
  "React Query / Zustand": { icon: SiReactquery, light: "#ff4154" },
  Vercel: { icon: SiVercel },
  Render: { icon: SiRender },
  // Backend & data stores
  "Node.js": { icon: SiNodedotjs, light: "#3f8a2f", dark: "#5fa04e" },
  Express: { icon: SiExpress },
  MongoDB: { icon: SiMongodb, light: "#47a248" },
  PostgreSQL: { icon: SiPostgresql, light: "#4169e1", dark: "#6b8cff" },
  "MySQL / PostgreSQL": { icon: SiMysql, light: "#4479a1", dark: "#5d9fd1" },
  Prisma: { icon: SiPrisma },
  Redis: { icon: SiRedis, light: "#ff4438" },
  SQLite: { icon: SiSqlite, light: "#003b57", dark: "#4b9cd3" },
  "JWT Auth": { icon: SiJsonwebtokens },
  Docker: { icon: SiDocker, light: "#2496ed" },
  Swagger: { icon: SiSwagger, light: "#4f9a1c", dark: "#85ea2d" },
  Git: { icon: SiGit, light: "#f05032" },
  // Mobile
  "React Native": react,
  Expo: { icon: SiExpo },
  Android: { icon: SiAndroid, light: "#2a9d5c", dark: "#3ddc84" },
  // Python, AI & data
  Python: python,
  FastAPI: { icon: SiFastapi, light: "#009688" },
  Pydantic: { icon: SiPydantic, light: "#e92063" },
  Pytest: { icon: SiPytest, light: "#0a9edc" },
  NumPy: { icon: SiNumpy, light: "#013243", dark: "#4dabcf" },
  Pandas: { icon: SiPandas, light: "#150458", dark: "#e70488" },
  "scikit-learn": { icon: SiScikitlearn, light: "#f7931e" },
  PyTorch: { icon: SiPytorch, light: "#ee4c2c" },
  Jupyter: { icon: SiJupyter, light: "#f37626" },
  Plotly: { icon: SiPlotly, light: "#3f4f75", dark: "#7a76ff" },
  Streamlit: { icon: SiStreamlit, light: "#ff4b4b" },
  // Java
  "Core Java": { icon: FaJava, light: "#c75d00", dark: "#f89820" },
  "Spring Boot": { icon: SiSpringboot, light: "#6db33f" },
  "JPA / Hibernate": { icon: SiHibernate, light: "#59666c", dark: "#a8b3b8" },
  Maven: { icon: SiApachemaven, light: "#c71a36", dark: "#e5455f" },
  JUnit: { icon: SiJunit5, light: "#25a162" },
  // Design
  Figma: { icon: SiFigma, light: "#f24e1e" },
}

/** Concepts with no brand get a matching generic icon, so every skill has one. */
const concept: Record<string, LucideIcon> = {
  "REST APIs": Webhook,
  "REST API Design": Webhook,
  "Rate Limiting": Gauge,
  "Cloud Deployment": Cloud,
  Accessibility,
  Navigation,
  "Local Storage": HardDrive,
  "Push Notifications": Bell,
  OOP: Boxes,
  "File Handling": FolderOpen,
  Requests: Globe,
  Automation: Workflow,
  Collections: Layers,
  Exceptions: TriangleAlert,
  JDBC: Database,
  SQL: Database,
  "Model Evaluation": Target,
  "LLM APIs": Sparkles,
  RAG: FileSearch,
  Matplotlib: ChartLine,
  "Power BI": BarChart3,
  "Data Cleaning": Eraser,
  EDA: ChartScatter,
  Statistics: Sigma,
  "Data Storytelling": Presentation,
  "User Research": Users,
  Personas: UserRound,
  "User Flows": Workflow,
  Wireframing: LayoutTemplate,
  "Design Systems": Component,
  Prototyping: MousePointerClick,
  "Usability Testing": ClipboardList,
  "Dev Handoff": Code,
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const entry = brand[name]
  if (entry) {
    const { icon: Icon, light, dark } = entry
    if (!light) return <Icon className={className} aria-hidden="true" />
    // Reuses the `.track-color` light/dark switch from globals.css.
    return (
      <Icon
        aria-hidden="true"
        className={cn("track-color text-(--tc)", className)}
        style={{ "--tc-light": light, "--tc-dark": dark ?? light } as CSSProperties}
      />
    )
  }
  const Concept = concept[name]
  if (Concept) return <Concept className={cn("text-muted-foreground", className)} aria-hidden="true" />
  return null
}
