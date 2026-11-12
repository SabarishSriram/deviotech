import { finalReviewTask, mergedLine, planTask, readmeTask } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * Data Science: three analyses, week by week, built on the my-analysis repo
 * from Setup (Python .venv, pandas, Plotly, JupyterLab, Streamlit, config.py
 * reading .env). Raw CSVs → cleaned SQLite tables → SQL + pandas →
 * a Streamlit dashboard and a one-page report.
 */

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

const venv = { text: "Every time: open a terminal in the project and check the prompt starts with (.venv). If it doesn't, switch it on as in Setup." }

function profileTask(load: string): BuildTask {
  return {
    id: "profile",
    title: "Load and profile the data",
    why: "Profiling is a health check: how big is it, what's missing, what's weird. Ten minutes here saves days of wrong answers later.",
    branch: "feat/profile",
    prompt: `In notebooks/01-profile.ipynb: ${load} Then help me profile it one step at a time: shape, column types, missing values per column, duplicates, the range of every number column, and the distinct values of every text column with few values. After each cell, tell me what to look at in the output. Don't fix anything yet — list the problems in a markdown cell at the end.`,
    steps: [venv, { text: "Download the dataset by following Reference → Sample data in the sidebar, and save it in data/raw/. Make sure data/raw/ is in .gitignore." }, { text: "Start JupyterLab and create notebooks/01-profile.ipynb:", code: "jupyter lab" }],
    understand: ["Which column worries you most, and why?", "What's a duplicate in this dataset — the exact same row, or something else?", "Which problem would change your answers if you ignored it?"],
    check: [{ text: "Restart the kernel and run all cells: it works top to bottom and ends with a list of data problems." }],
    debug: ["UnicodeDecodeError: add encoding=\"latin-1\" to pd.read_csv.", "ModuleNotFoundError in Jupyter: JupyterLab was started outside the .venv. Close it, switch on the .venv, start it again."],
    commit: "Profile the dataset",
  }
}

function cleanTask(rules: string): BuildTask {
  return {
    id: "clean",
    title: "Clean it, reproducibly",
    why: "Cleaning by hand in a notebook can't be repeated. A cleaning script can: run it again on fresh data and get the same clean tables.",
    branch: "feat/clean",
    prompt: `Write app/clean.py with one small function per cleaning rule and a main() that reads data/raw/, applies them in order, prints how many rows each rule changed or removed, and writes the cleaned tables into a SQLite database at data/clean.db. The rules: ${rules} Explain each rule before writing it.`,
    steps: [venv, { text: "Make sure data/clean.db is ignored by Git (add data/*.db to .gitignore), then run it:", code: "python -m app.clean" }],
    understand: ["Which rule removed the most rows, and was that the right call?", "Why one function per rule?", "Why save to SQLite instead of another CSV?"],
    check: [{ text: "Running it twice gives the same row counts. Write the counts in docs/cleaning.md, one line per rule." }],
    commit: "Add reproducible cleaning",
  }
}

function sqlTask(questions: string): BuildTask {
  return {
    id: "sql",
    title: "Answer each question with SQL",
    why: "SQL is how analysts talk to data at work. One query per question, saved in files, so anyone can re-run your numbers.",
    branch: "feat/sql",
    prompt: `Help me write one SQL query per question, against the tables in data/clean.db: ${questions} Put each in sql/ as its own .sql file with a comment saying which question it answers. Teach me the SQL as we go — GROUP BY, JOIN and window functions where needed — and then show me how to run them from pandas with pd.read_sql.`,
    steps: [venv],
    understand: ["Pick your hardest query and explain it line by line.", "What would happen to the numbers if you'd forgotten a WHERE clause?", "How did you check the query's answer is right?"],
    check: [{ text: "notebooks/02-sql.ipynb runs every .sql file and shows its result. Check one answer by hand in pandas — it matches." }],
    commit: "Add SQL queries",
  }
}

function statsTask(test: string): BuildTask {
  return {
    id: "stats",
    title: "Test one idea properly",
    why: "A chart can show a pattern; a statistical test tells you whether it's bigger than chance. Interpreting it honestly is the real skill.",
    branch: "feat/stats",
    prompt: `In notebooks/04-stats.ipynb, help me test this: ${test} Explain the null hypothesis, which test fits and why, then run it with scipy, and help me write the result in plain English — including what it does NOT prove.`,
    steps: [venv, { text: "Install SciPy and update requirements.txt:", code: "pip install scipy" }],
    understand: ["What's your null hypothesis, in one sentence?", "What does your p-value mean — and what doesn't it mean?", "Correlation or cause? Which does your result show?"],
    check: [{ text: "The notebook ends with a plain-English result your mentor could read aloud, including its limits." }],
    commit: "Add statistical test",
  }
}

function dashboardTask(pages: string, screens: string[]): BuildTask {
  return {
    id: "dashboard",
    title: "The dashboard, live",
    why: "The dashboard is how people who'll never open your notebook use your work. Streamlit Community Cloud puts it online for free.",
    branch: "feat/dashboard",
    screens,
    prompt: `Write dashboard/app.py in Streamlit with pages for: ${pages} Read from data/clean.db through cached functions (st.cache_data), put the filters in the sidebar so they apply to every chart, and use Plotly charts with clear titles and labelled axes. Each page ends with one line saying what the reader should take away.`,
    steps: [
      venv,
      { text: "Run it locally:", code: "streamlit run dashboard/app.py" },
      { text: "The live app needs the clean data: commit data/clean.db if it's under 50 MB (tell Git with git add -f data/clean.db), or ask your mentor. Then follow Building → Deployment to deploy on Streamlit Community Cloud." },
      { text: "Using Power BI instead (Windows only)? Build the same pages there, and publish or export them as Building → Deployment describes." },
    ],
    understand: ["What does st.cache_data do, and why does it matter here?", "How do the sidebar filters reach every chart?", "Pick one chart: what should a manager do after seeing it?"],
    check: [{ text: "Open the live URL in a private window: change the filters — every chart updates and agrees with your notebook's numbers." }],
    debug: ["The live app can't find data/clean.db: paths are relative to where Streamlit starts. Build them from Path(__file__).parent."],
    commit: "Add dashboard",
  }
}

const reportTask: BuildTask = {
  id: "report",
  title: "One-page insights report",
  why: "Busy people read one page. Your report turns the analysis into findings and actions, each backed by a chart.",
  branch: "docs/report",
  prompt: "Help me turn my findings into a one-page report in docs/report.md: a two-line summary, then each finding as one headline sentence + the chart that proves it + what to do about it, then the limits of the data. Ask me to write each headline myself first, then suggest how to make it clearer — don't write them for me.",
  steps: [{ text: "Export the charts you need as PNGs (Plotly: the camera icon on the chart) into docs/charts/." }],
  understand: ["Which finding are you most sure of, and which least?", "What's one thing the data can't tell you?"],
  check: [{ text: "A friend who knows nothing about the project reads it in two minutes and can tell you the main finding." }],
  commit: "Add insights report",
}

function shipWeek(name: string, dashboard: BuildTask, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it: a live dashboard, a one-page report, and the final review.",
    tasks: [
      dashboard,
      reportTask,
      readmeTask({ name, sections: "links to the live dashboard and the report, the questions you answered, how the data was cleaned (link docs/cleaning.md), how to run it locally", demo: "walk through the dashboard, telling the story of your main finding", check: "The dashboard, report and demo video links all open." }),
      finalReviewTask(doneWhen, "your dashboard and report"),
    ],
    done: ["The dashboard is live", "The one-page report is in docs/report.md", "The demo video is linked", "Your mentor has the links for the final review"],
  }
}

/* ------------------------------------------------------------------ */
/* IPL performance analysis                                            */
/* ------------------------------------------------------------------ */

const iplDone = ["Each question has a query, a chart and a plain-English answer.", "Cleaning steps are documented and reproducible.", "The statistical result is interpreted correctly (including what it doesn't prove).", "Dashboard and report are shared."]

const ipl: ProjectBuild = [
  {
    intro: "You've read Start here. Write your four questions and plan in your own words, then profile both datasets.",
    tasks: [
      planTask({
        parts: ["Questions — your four questions, and for each: why it matters, and which columns answer it.", "Definitions — exactly what you mean by terms like “death overs”, “consistent” and “win”."],
        questions: ["Which of your questions could the data answer wrongly if you didn't clean it?", "Why define “death overs” before you start?"],
      }),
      profileTask("load matches.csv and deliveries.csv from data/raw/ with pandas, and check how they link (deliveries.match_id → matches.id)."),
    ],
    done: ["docs/plan.md with your four questions and definitions", "notebooks/01-profile.ipynb with a list of data problems", mergedLine],
  },
  {
    intro: "Clean the data with a script, load it into SQLite, and answer each question with SQL.",
    tasks: [
      cleanTask("standardise renamed teams (e.g. Delhi Daredevils → Delhi Capitals), drop abandoned matches with no result, fix missing cities from the venue, and keep only the columns you need."),
      sqlTask("each of the four questions in my docs/plan.md."),
    ],
    done: ["app/clean.py builds data/clean.db, with counts in docs/cleaning.md", "One saved SQL query per question", mergedLine],
  },
  {
    intro: "Analyse: a chart for every finding, one statistical test, and conclusions in plain English.",
    tasks: [
      {
        id: "charts",
        title: "A chart for every finding",
        why: "Each question gets the chart that answers it most clearly — and a sentence that says the answer.",
        branch: "feat/charts",
        screens: ["overview", "teams", "players"],
        prompt: "In notebooks/03-analysis.ipynb, for each of my four questions: suggest the clearest chart type and why, build it with Plotly using my SQL results, and help me write a one-sentence answer under it. Use consistent team colours across every chart.",
        steps: [venv],
        understand: ["Why did you pick this chart type for this question?", "Which finding surprised you?"],
        check: [{ text: "Every question has a chart and a one-sentence answer, and Restart Kernel and Run All works." }],
        commit: "Add analysis charts",
      },
      statsTask("does choosing to field first after winning the toss change the chance of winning? (chi-square test on toss decision vs result)"),
    ],
    done: ["A chart and an answer per question", "A statistical test, honestly interpreted", mergedLine],
  },
  shipWeek("IPL performance analysis", dashboardTask("Overview (season filter, matches, toss vs win), Teams (win rate by venue, batting first vs chasing) and Players (top batters and bowlers by your metrics)", ["overview", "teams", "players"]), iplDone),
]

/* ------------------------------------------------------------------ */
/* Sales insights dashboard                                            */
/* ------------------------------------------------------------------ */

const salesDone = ["KPI totals reconcile with the raw data.", "Every recommendation is backed by a chart.", "Dashboard filters work together.", "Report and dashboard shared."]

const sales: ProjectBuild = [
  {
    intro: "You've read Start here. Define every KPI precisely in your plan, then profile the data.",
    tasks: [
      planTask({
        parts: ["KPIs — an exact definition for revenue, profit, orders, average order value and month-over-month change (for example: before or after discount? are returns included?).", "Questions — the three things a sales manager most needs to know, and which KPI answers each."],
        questions: ["Why does “revenue” need a precise definition?", "Which KPI would mislead a manager if it were defined loosely?"],
      }),
      profileTask("load the Superstore orders CSV from data/raw/ with pandas, parsing Order Date as a date."),
    ],
    done: ["docs/plan.md with exact KPI definitions", "notebooks/01-profile.ipynb with a list of data problems", mergedLine],
  },
  {
    intro: "Clean the data with a script, then calculate every KPI with SQL — and prove the totals are right.",
    tasks: [
      cleanTask("parse dates, remove exact duplicate rows, standardise region and category names, and flag (don't delete) negative-profit rows."),
      { ...sqlTask("every KPI in my docs/plan.md, overall and by month, region and category; plus the top and bottom 10 products by profit."), check: [{ text: "notebooks/02-sql.ipynb runs every query, then checks total revenue and profit from SQL against pandas sums on the raw file — they match exactly." }] },
    ],
    done: ["app/clean.py builds data/clean.db, with counts in docs/cleaning.md", "SQL for every KPI, reconciled with the raw data", mergedLine],
  },
  {
    intro: "Analyse: what's driving revenue and profit, when, and why — with one statistical check.",
    tasks: [
      {
        id: "charts",
        title: "Breakdowns and seasonality",
        why: "Managers ask “where?” and “when?”. Breakdowns answer where; the monthly trend answers when.",
        branch: "feat/charts",
        screens: ["overview", "regions", "products"],
        prompt: "In notebooks/03-analysis.ipynb, build Plotly charts for: the monthly revenue and profit trend (with the best and worst months marked), profit by region and category, and the top and bottom 10 products by margin. Under each, help me write the one finding it shows.",
        steps: [venv],
        understand: ["Which region or category is the biggest problem, and how do you know?", "Is there a season? How sure are you?"],
        check: [{ text: "Every chart has a one-line finding, and Restart Kernel and Run All works." }],
        commit: "Add breakdown and trend charts",
      },
      statsTask("do bigger discounts go with lower profit? (correlation between discount and profit margin, plus a comparison of margins with and without discount)"),
    ],
    done: ["Breakdowns and the monthly trend, each with a finding", "A statistical check on discounts, honestly interpreted", mergedLine],
  },
  shipWeek("Sales insights dashboard", dashboardTask("Overview (KPI cards and the monthly trend), Regions & categories (breakdowns that filter together) and Products (top and bottom 10 by margin)", ["overview", "regions", "products"]), salesDone),
]

/* ------------------------------------------------------------------ */
/* Real-estate price analysis                                          */
/* ------------------------------------------------------------------ */

const estateDone = ["Outlier rules are documented.", "The regression's error is reported and explained.", "The estimator returns a range, not a single exact number.", "Dashboard and report shared."]

const realEstate: ProjectBuild = [
  {
    intro: "You've read Start here. Write your questions and plan in your own words, then profile the listings.",
    tasks: [
      planTask({
        parts: ["Questions — what you want to know about prices, and which columns answer each.", "Outliers — your rules for listings that are impossible or extreme (for example, under 300 sq ft per bedroom), written before you look at the results."],
        questions: ["Why compare price per sq ft instead of price?", "Why write outlier rules before you look at the results?"],
      }),
      profileTask("load the house price CSV from data/raw/ with pandas."),
    ],
    done: ["docs/plan.md with your questions and outlier rules", "notebooks/01-profile.ipynb with a list of data problems", mergedLine],
  },
  {
    intro: "Clean the listings with a script, then summarise prices by locality with SQL.",
    tasks: [
      cleanTask("turn size like “3 BHK” into a number of bedrooms, convert total_sqft ranges like “1100 - 1300” to their average and drop other units, apply the outlier rules from docs/plan.md, group rare localities (fewer than 10 listings) as “other”, and add price_per_sqft."),
      sqlTask("price per sq ft by locality (median, not mean), how price per sq ft changes with bedrooms, and the 10 most and least expensive localities with enough listings."),
    ],
    done: ["app/clean.py builds data/clean.db, with counts in docs/cleaning.md", "SQL summaries by locality", mergedLine],
  },
  {
    intro: "Analyse what drives price, fit one regression and explain it — then turn it into an estimator.",
    tasks: [
      {
        id: "regression",
        title: "What drives price, and a regression",
        why: "Correlation shows what moves together; a regression puts a number on each driver. Explaining it comes first — predicting second.",
        branch: "feat/regression",
        screens: ["drivers"],
        prompt: "In notebooks/03-analysis.ipynb: show how price relates to area, bedrooms, bathrooms and locality with Plotly charts and a correlation table. Then fit a linear regression of log(price) on area, bedrooms, bathrooms and locality (one-hot), on a train/test split. Report the error on the test set in rupees, and help me explain three coefficients in plain English. Save the model with joblib to models/price.joblib.",
        steps: [venv, { text: "scikit-learn and joblib aren't in this project yet. Install them and update requirements.txt:", code: "pip install scikit-learn joblib" }],
        understand: ["Why log(price) instead of price?", "Explain one coefficient in plain English.", "What's your typical error in rupees, and is that good enough to help a buyer?"],
        check: [{ text: "The notebook reports the test error in rupees and explains three coefficients in words." }],
        commit: "Add price drivers and regression",
      },
      statsTask("is the price per sq ft really different between your two most-compared localities? (a test comparing the two groups, chosen for skewed data)"),
    ],
    done: ["Charts of what drives price", "A regression with its error and explanations", "A statistical comparison, honestly interpreted", mergedLine],
  },
  shipWeek("Real-estate price analysis", dashboardTask("Localities (price per sq ft ranking and spread), Drivers (what moves price) and Estimator (locality, area and BHK in → an estimated price range out, using models/price.joblib and your test error to give the range)", ["localities", "drivers", "estimator"]), estateDone),
]

export const dataScienceBuilds: Record<string, ProjectBuild> = {
  "ipl-analysis": ipl,
  "sales-dashboard": sales,
  "real-estate-analysis": realEstate,
}

/* ------------------------------------------------------------------ */
/* Screens — the dashboard's pages                                     */
/* ------------------------------------------------------------------ */

const dash = (title: string, url: string, nav: string[], active: number, blocks: ProjectScreen["mock"]["blocks"]): ProjectScreen["mock"] => ({ frame: "browser", title, url, nav, active, blocks })

const iplNav = ["Overview", "Teams", "Players"]
const salesNav = ["Overview", "Regions & categories", "Products"]
const estateNav = ["Localities", "Drivers", "Estimator"]

export const dataScienceScreens: Record<string, ProjectScreen[]> = {
  "ipl-analysis": [
    {
      id: "overview",
      name: "Overview",
      purpose: "The season at a glance — and the answer to “does the toss matter?”.",
      shows: ["Season and team filters", "Matches played", "Toss decision vs win rate"],
      week: 3,
      mock: dash("IPL insights", "ipl-insights.streamlit.app", iplNav, 0, [{ kind: "kpis", items: [{ label: "Matches", value: "74" }, { label: "Chasing wins", value: "54%" }, { label: "Toss winner won", value: "51%" }] }, { kind: "bars", title: "Win rate by toss decision", values: [52, 47], labels: ["Field first", "Bat first"] }]),
    },
    {
      id: "teams",
      name: "Teams",
      purpose: "How each team does by venue, batting first or chasing.",
      shows: ["Win rate by venue", "Batting first vs chasing"],
      week: 3,
      mock: dash("IPL insights", "ipl-insights.streamlit.app/teams", iplNav, 1, [{ kind: "table", columns: ["Venue", "Played", "Won", "Win rate"], rows: [["Wankhede", "38", "24", "63%"], ["Eden Gardens", "22", "11", "50%"], ["Chepauk", "14", "5", "36%"]] }]),
    },
    {
      id: "players",
      name: "Players",
      purpose: "The most valuable batters and bowlers, by the metrics you defined.",
      shows: ["Top batters by your consistency metric", "Best death-over bowlers"],
      week: 3,
      mock: dash("IPL insights", "ipl-insights.streamlit.app/players", iplNav, 2, [{ kind: "list", title: "Best death-over economy (min. 30 overs)", items: [{ title: "J Bumrah", right: "7.4" }, { title: "B Kumar", right: "8.1" }, { title: "R Khan", right: "8.3" }] }]),
    },
  ],
  "sales-dashboard": [
    {
      id: "overview",
      name: "Overview",
      purpose: "The KPIs a manager checks first, and the monthly trend.",
      shows: ["Revenue, profit, orders and average order value", "Month-over-month change", "The monthly trend"],
      week: 3,
      mock: dash("Sales insights", "sales-insights.streamlit.app", salesNav, 0, [{ kind: "kpis", items: [{ label: "Revenue", value: "₹2.3 Cr" }, { label: "Profit", value: "₹28.6 L" }, { label: "Orders", value: "5,009" }, { label: "AOV", value: "₹4,590" }] }, { kind: "bars", title: "Monthly revenue", values: [14, 9, 18, 15, 16, 19, 17, 21, 30, 22, 31, 34], labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] }]),
    },
    {
      id: "regions",
      name: "Regions & categories",
      purpose: "Where the money is made — and lost.",
      shows: ["Profit by region and category", "Filters that work together"],
      week: 3,
      mock: dash("Sales insights", "sales-insights.streamlit.app/regions", salesNav, 1, [{ kind: "search", placeholder: "Filter", chips: ["West", "Furniture", "2026"] }, { kind: "table", columns: ["Region", "Revenue", "Profit", "Margin"], rows: [["West", "₹72 L", "₹10.8 L", "15%"], ["East", "₹68 L", "₹9.1 L", "13%"], ["Central", "₹50 L", "₹4.0 L", "8%"]] }]),
    },
    {
      id: "products",
      name: "Products",
      purpose: "The products to push, and the ones losing money.",
      shows: ["Top 10 by margin", "Bottom 10 — the problem products"],
      week: 3,
      mock: dash("Sales insights", "sales-insights.streamlit.app/products", salesNav, 2, [{ kind: "list", title: "Bottom products by profit", items: [{ title: "Cubify CubeCube table", meta: "Furniture · Central", right: "−₹3.4 L" }, { title: "Lexmark MX611 printer", meta: "Technology · East", right: "−₹2.1 L" }] }]),
    },
  ],
  "real-estate-analysis": [
    {
      id: "localities",
      name: "Localities",
      purpose: "Price per sq ft by area — the fair way to compare.",
      shows: ["Median price per sq ft by locality", "The spread within each"],
      week: 3,
      mock: dash("Bengaluru homes", "blr-homes.streamlit.app", estateNav, 0, [{ kind: "bars", title: "Median ₹ per sq ft", values: [14200, 11800, 9600, 7400, 6100], labels: ["Indiranagar", "Koramangala", "HSR", "Whitefield", "E-city"] }]),
    },
    {
      id: "drivers",
      name: "Drivers",
      purpose: "What actually moves the price — area, bedrooms, bathrooms or location.",
      shows: ["Charts of price against each driver", "The regression's effect sizes, in words"],
      week: 3,
      mock: dash("Bengaluru homes", "blr-homes.streamlit.app/drivers", estateNav, 1, [{ kind: "table", columns: ["Driver", "Effect on price"], rows: [["+100 sq ft", "+6%"], ["+1 bathroom", "+4%"], ["Indiranagar vs E-city", "+118%"]] }]),
    },
    {
      id: "estimator",
      name: "Estimator",
      purpose: "Is this listing fairly priced? Enter it and get a range.",
      shows: ["Locality, area and BHK", "An estimated range, not one exact number"],
      week: 4,
      mock: dash("Bengaluru homes", "blr-homes.streamlit.app/estimator", estateNav, 2, [{ kind: "form", title: "Your listing", fields: ["Locality", "Area (sq ft)", "BHK"], button: "Estimate" }, { kind: "stat", label: "Estimated price", value: "₹78 L – ₹94 L", caption: "Based on 412 similar listings" }]),
    },
  ],
}
