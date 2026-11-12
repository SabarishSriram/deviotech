import { finalReviewTask, mergedLine, planTask, readmeTask } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * Python: three command-line tools, week by week, built on the
 * my-python-tool repo from Setup (.venv, app/ package run with
 * python -m app.main, tests/ with pytest, app/config.py reading .env).
 */

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

const venv = { text: "Every time: open a terminal in the project and check the prompt starts with (.venv). If it doesn't, switch it on as in Setup." }

function classesTask(classes: string, rules: string): BuildTask {
  return {
    id: "classes",
    title: "Your core classes",
    why: "Classes are the nouns of your project. Get them right — with their rules built in — and everything else (the CLI, the database, the API) just uses them.",
    branch: "feat/models",
    prompt: `In app/models.py, write ${classes} as Python dataclasses with type hints. Build these rules into them, raising ValueError with a clear message when broken: ${rules} Then write tests in tests/test_models.py for each rule. Teach me dataclasses, type hints and raising errors as you go.`,
    steps: [venv],
    understand: ["What does @dataclass write for you?", "Why check the rules inside the class instead of in the CLI?", "Break one rule on purpose in a test — what does the error say?"],
    check: [{ text: "Run the tests:", code: "python -m pytest", expect: "every test passes" }],
    commit: "Add core classes",
  }
}

function cliTask(commands: string, screens: string[]): BuildTask {
  return {
    id: "cli",
    title: "The command-line interface",
    why: "The CLI is how people use your tool. Clear commands, clear help, clear errors — never a traceback.",
    branch: "feat/cli",
    screens,
    prompt: `Rewrite app/main.py with argparse subcommands: ${commands} Every command has --help text. Use Python's logging module (not print) for errors and debug details, with --verbose to show more. Bad input must give one friendly line and exit code 1 — never a traceback. Keep the logic in separate functions the CLI calls, not inside the argparse code.`,
    steps: [venv, { text: "Try it:", code: "python -m app.main --help" }],
    understand: ["What's the difference between logging an error and printing it?", "Where does bad input get caught, and what does the user see?", "Why keep the logic out of the argparse code?"],
    check: [{ text: "Run every command with good input, then with bad input: good input works, bad input prints one clear line — no traceback." }],
    commit: "Add CLI",
  }
}

function sqliteTask(tables: string): BuildTask {
  return {
    id: "sqlite",
    title: "Store it in SQLite",
    why: "Files are fine until two things write at once or you need to search. SQLite is a real database in one file — no server to install.",
    branch: "feat/sqlite",
    prompt: `Write app/db.py using Python's built-in sqlite3: create the tables (${tables}) if they don't exist, at the path in config.DATABASE_PATH, and functions to add, list (with filters) and delete. Always use ? placeholders, never f-strings, for values. Switch the CLI to use it. Then add a test that uses a temporary database file (pytest's tmp_path).`,
    steps: [venv],
    understand: ["Why ? placeholders instead of f-strings? What attack do they stop?", "Where is the database file, and why is it in .gitignore?", "Why does the test use a temporary database?"],
    check: [{ text: "Add some data with the CLI, close the terminal, open a new one, and list it — it's still there." }, { text: "Run the tests:", code: "python -m pytest", expect: "they pass" }],
    commit: "Store data in SQLite",
  }
}

function apiTask(endpoints: string): BuildTask {
  return {
    id: "api",
    title: "A FastAPI service on the same data",
    why: "The same data, reachable from any app. FastAPI calls the same functions as your CLI, so both always agree.",
    branch: "feat/api",
    screens: ["api"],
    prompt: `Write app/api.py with FastAPI: ${endpoints} Validate input with Pydantic models, call the same functions in app/db.py as the CLI, and return clear errors (422 for bad input, 404 for not found). Add tests with FastAPI's TestClient and a temporary database.`,
    steps: [venv, { text: "Run it, then open http://localhost:8000/docs to try it:", code: "fastapi dev app/api.py" }],
    understand: ["What does Pydantic do when a field is missing or the wrong type?", "Why must the API and the CLI call the same functions?", "What's the difference between 404 and 422?"],
    check: [{ text: "Add something with the CLI, then GET it from the API in /docs — it's there. Then add one through the API and list it with the CLI." }],
    commit: "Add FastAPI service",
  }
}

function testsTask(focus: string): BuildTask {
  return {
    id: "tests",
    title: "A test suite you'd trust",
    why: "Tests are how you change code without fear. Now cover the parts that matter most — and measure what you missed.",
    branch: "test/suite",
    prompt: `Help me find the gaps in my tests: ${focus} Show me pytest fixtures and parametrize so the tests stay short. Then run coverage and explain which uncovered lines matter and which don't.`,
    steps: [venv, { text: "Install coverage and update requirements.txt, then run it:", code: "pip install pytest-cov\npython -m pytest --cov=app --cov-report=term-missing" }],
    understand: ["What does a fixture do?", "Which uncovered line worries you most, and why?", "Why isn't 100% coverage the goal?"],
    check: [{ text: "Every test passes, and coverage of app/ is at least 80%." }],
    commit: "Expand test suite",
  }
}

function shipWeek(name: string, test: BuildTask, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it: a test suite you trust, a README with every command, and the final review.",
    tasks: [
      test,
      readmeTask({ name, sections: "install steps, every command with an example and its output, the API endpoints, how to run the tests, environment variables (names only)", demo: "run every command in the terminal and show the API in /docs", check: "Every command in the README works when you copy it." }),
      finalReviewTask(doneWhen, "your tool in a terminal"),
    ],
    done: ["Tests pass with at least 80% coverage", "The README shows every command", "The demo video is linked", "Your mentor has the links for the final review"],
  }
}

/* ------------------------------------------------------------------ */
/* Expense tracker CLI + API                                           */
/* ------------------------------------------------------------------ */

const expenseDone = ["Bad input (e.g. a negative amount) gives a clear message, not a crash.", "CLI and API read the same data.", "Tests pass with pytest.", "README shows every command with an example."]

const expenseCli: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words, then write the core classes with their rules and tests.",
    tasks: [
      planTask({
        parts: ["Commands — every command, with one example of how you'd type it and what it prints.", "Rules — what makes an expense invalid (negative amount, unknown category, future date?)."],
        questions: ["Why do the CLI and the API share one core module?", "What should happen when someone types an amount like “abc”?"],
      }),
      classesTask("Expense (amount, category, note, spent_on) and Category (name, optional monthly_budget)", "the amount is above zero and has at most 2 decimal places; the category name is lowercase letters only; spent_on isn't in the future."),
    ],
    done: ["docs/plan.md in your own words", "Expense and Category classes with tested rules", mergedLine],
  },
  {
    intro: "Make it a real tool: commands, CSV import and export, logging, and no tracebacks.",
    tasks: [
      { ...cliTask("add <amount> <category> [note] [--date], list [--month YYYY-MM] [--category], delete <id>. For now, save expenses in a JSON file in data/.", ["add-list"]) },
      {
        id: "csv",
        title: "Import and export CSV",
        why: "CSV is how data moves between tools — your bank, Excel, Google Sheets.",
        branch: "feat/csv",
        screens: ["import"],
        prompt: "Add import <file.csv> and export <file.csv> commands using Python's csv module (columns amount, category, note, spent_on). Import checks every row with the Expense class and reports which rows were skipped and why, instead of stopping at the first bad one.",
        steps: [venv, { text: "Create the sample CSV from Reference → Sample data to test with." }],
        understand: ["Why skip bad rows instead of stopping?", "What does csv.DictReader give you?"],
        check: [{ text: "Import the sample file with one bad row added: it imports the rest and tells you which row it skipped and why." }],
        commit: "Add CSV import and export",
      },
    ],
    done: ["add, list and delete work, with --help", "CSV import reports bad rows; export works", "No tracebacks for bad input", mergedLine],
  },
  {
    intro: "A real database, a report, and an API on the same data.",
    tasks: [
      sqliteTask("categories, and expenses with id, amount, category, note, spent_on, created_at"),
      {
        id: "report",
        title: "The monthly report",
        why: "The command that makes the tool worth using: where did the money go this month?",
        branch: "feat/report",
        screens: ["report"],
        prompt: "Add report --month YYYY-MM: the month's total, then each category sorted by amount with its total, its share and a text bar chart made of █ characters, plus a warning for any category over its monthly_budget. Do the grouping in SQL.",
        steps: [venv],
        understand: ["Which part runs in SQL and which in Python, and why?", "How do you work out the length of each bar?"],
        check: [{ text: "Import the sample CSV, run the report for that month, and check one category's total by hand." }],
        commit: "Add monthly report",
      },
      apiTask("GET /expenses?month=&category= and POST /expenses."),
    ],
    done: ["Data lives in SQLite", "report shows totals and bars by category", "The API and CLI read and write the same data", mergedLine],
  },
  shipWeek("Expense tracker CLI + API", testsTask("negative and non-number amounts, unknown categories, empty months in the report, bad CSV rows, and the API's 422 and 404 cases."), expenseDone),
]

/* ------------------------------------------------------------------ */
/* Web scraper with alerts                                             */
/* ------------------------------------------------------------------ */

const scraperDone = ["A network error doesn't stop the other items being checked.", "Alerts fire once per drop, not on every run.", "Parser tests pass on saved pages.", "README explains the scraping etiquette you followed."]

const scraper: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — including the rules you'll follow as a polite scraper — then write the core classes.",
    tasks: [
      planTask({
        parts: ["Sites — the 2–3 sites you'll scrape, and proof they allow it (their robots.txt and terms).", "Etiquette — how often you'll fetch, how long you'll wait between requests, and what your User-Agent says."],
        questions: ["What does robots.txt tell you, and what happens if you ignore it?", "Why test your parser on saved pages instead of the live site?"],
      }),
      classesTask("TrackedItem (url, name, target_price, active) and PricePoint (item_id, price, checked_at)", "the url starts with http:// or https://; target_price is above zero; a PricePoint's price is above zero."),
    ],
    done: ["docs/plan.md with your sites and etiquette", "TrackedItem and PricePoint with tested rules", mergedLine],
  },
  {
    intro: "Fetch politely, parse reliably — with tests on saved pages — and a CLI to drive it.",
    tasks: [
      {
        id: "fetch-parse",
        title: "Fetch politely and parse",
        why: "Fetching and parsing are the parts that break: networks fail and sites change. Keep them separate, and test parsing without the internet.",
        branch: "feat/fetch-parse",
        prompt: "Write app/fetch.py: get(url) with requests, a 10-second timeout, a User-Agent naming my project, up to 3 retries with a growing wait, and a check of robots.txt (urllib.robotparser) before fetching. Write app/parse.py: parse_price(html) and parse_title(html) with BeautifulSoup for books.toscrape.com. Add tests in tests/test_parse.py that read saved HTML files from tests/fixtures/, never the internet.",
        steps: [venv, { text: "Follow Reference → Sample data to install BeautifulSoup and save a product page into tests/fixtures/. Update requirements.txt." }],
        understand: ["What happens if the site takes 30 seconds to answer?", "Why does parse.py never touch the internet?", "What breaks if the site changes its HTML, and how will you know?"],
        check: [{ text: "Run the tests:", code: "python -m pytest", expect: "the parser tests pass with your Wi-Fi turned off" }],
        commit: "Add polite fetching and parsing",
      },
      cliTask("track <url> <target_price> [--name], list, check (fetch every active item now, waiting 2 seconds between sites; one failing item mustn't stop the others), untrack <id>. For now, save items in a JSON file in data/.", ["check"]),
    ],
    done: ["Fetching is polite and retries; parsing is tested offline", "track, list, check and untrack work", "One failing site doesn't stop the run", mergedLine],
  },
  {
    intro: "Price history in SQLite, alerts that fire once per drop, and runs on a schedule.",
    tasks: [
      sqliteTask("tracked_items, and price_points with item_id, price, checked_at"),
      {
        id: "alerts",
        title: "Alerts, once per drop",
        why: "An alert you get every hour gets ignored. Send it when the price first drops below your target — and not again until it's gone back up.",
        branch: "feat/alerts",
        screens: ["alert"],
        prompt: "Add alerts to check: when an item's price falls below its target for the first time, send a Telegram message (bot token and chat id from config — Environment & secrets showed how) with the name, old and new price and the link. Save that it was alerted, and reset it when the price goes back above the target. If Telegram isn't set up, log the message instead. Add history <id> to show the price history.",
        steps: [venv],
        understand: ["How does your code remember it already alerted for this drop?", "What happens if Telegram is down?"],
        check: [{ text: "Set a target just above an item's current price and run check twice: one alert arrives, not two." }],
        commit: "Add price-drop alerts",
      },
      {
        id: "schedule",
        title: "Run it on a schedule",
        why: "A price watcher you have to run by hand isn't watching. Your computer can run it every few hours for you.",
        branch: "docs/schedule",
        screens: ["check"],
        prompt: "Help me run python -m app.main check every 6 hours on my computer, logging each run to logs/scraper.log (make sure logs/ is in .gitignore). Give me the exact steps for my operating system — cron on Mac and Linux, Task Scheduler on Windows — and how to check it's actually running. Then help me write those steps in docs/schedule.md.",
        understand: ["How do you know the scheduled run happened while you weren't looking?", "Why log to a file instead of the screen?"],
        check: [{ text: "Schedule it for the next few minutes, wait, and open logs/scraper.log — the run is there." }],
        commit: "Add schedule instructions",
      },
    ],
    done: ["Price history in SQLite", "One alert per drop", "Runs on a schedule, with a log", mergedLine],
  },
  shipWeek("Web scraper with alerts", testsTask("a timeout, a 404 page, a page whose price can't be parsed, alert-once logic across several runs, and the history command."), scraperDone),
]

/* ------------------------------------------------------------------ */
/* Automation toolkit                                                  */
/* ------------------------------------------------------------------ */

const toolkitDone = ["Dry-run never changes any file.", "undo restores the previous state.", "Name clashes don't overwrite files.", "Tests run against temporary folders, never real ones."]

const toolkit: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially how nothing can ever be lost — then write the core classes.",
    tasks: [
      planTask({
        parts: ["Commands — each command, one example, and what --dry-run shows for it.", "Safety — how dry-run, the undo log and name-clash handling make sure no file is ever lost or overwritten."],
        questions: ["Why must dry-run change nothing?", "What happens if two files would get the same name?"],
      }),
      classesTask("Rule (extensions, target_folder), loaded from a rules.json file, and Action (timestamp, kind, source, target)", "every extension starts with a dot and is lowercase; target_folder is a plain folder name, with no slashes or “..”."),
    ],
    done: ["docs/plan.md with your commands and safety plan", "Rule and Action classes with tested rules", mergedLine],
  },
  {
    intro: "organize and rename — always with a dry-run first — and an undo log for everything.",
    tasks: [
      {
        ...cliTask("organize <folder> [--dry-run] (move files into folders by the rules in rules.json), rename <folder> --pattern (date prefix, lowercase, numbering) [--dry-run], undo (reverse the last run). Use pathlib for every path.", ["organize"]),
        steps: [venv, { text: "Make the practice folder from Reference → Sample data — never test on your real Downloads." }, { text: "Try it:", code: "python -m app.main organize sandbox --dry-run" }],
      },
      {
        id: "undo",
        title: "Undo log and name clashes",
        why: "This is what makes people trust a tool that moves their files: every change is written down, and can be reversed.",
        branch: "feat/undo",
        screens: ["undo"],
        prompt: "Make every real move or rename append an Action to logs/actions.jsonl before it happens. undo reads the last run's actions and reverses them in reverse order. When a target name already exists, add a number (report (2).pdf) instead of overwriting. Handle permission errors by skipping the file and saying so.",
        steps: [venv],
        understand: ["Why write the log before moving the file, not after?", "Why reverse the actions in reverse order?", "What does your code do when it can't move a file?"],
        check: [{ text: "Run organize on the sandbox, then undo: the sandbox is exactly as it was (compare with the list you made first)." }],
        commit: "Add undo log and name clash handling",
      },
    ],
    done: ["organize and rename, with dry-run", "undo restores the previous state", "No file is ever overwritten", mergedLine],
  },
  {
    intro: "Find duplicates, report on a folder, keep a history in SQLite, and run on a schedule.",
    tasks: [
      {
        id: "dupes-report",
        title: "Duplicates and the folder report",
        why: "Duplicates waste space; a report shows where it's going. Both are read-only — safe to run anytime.",
        branch: "feat/dupes-report",
        screens: ["dupes", "report"],
        prompt: "Add dupes <folder>: group files by size first, then by SHA-256 hash of the content (read in chunks), and list each group of identical files. Add report <folder>: total size, file count by type, and the 10 largest files, with sizes in KB, MB or GB.",
        steps: [venv],
        understand: ["Why group by size before hashing?", "Why read the file in chunks?", "Two files have the same name but different content — are they duplicates?"],
        check: [{ text: "Copy a file in the sandbox under a new name: dupes finds the pair. report's total matches your computer's folder size." }],
        commit: "Add dupes and report",
      },
      sqliteTask("runs (id, command, folder, started_at, files_changed)"),
    ],
    done: ["dupes finds identical files by content", "report summarises any folder", "Run history in SQLite", mergedLine],
  },
  shipWeek("Automation toolkit", testsTask("dry-run changes nothing, undo restores everything, name clashes, permission errors and duplicate detection — all inside pytest's tmp_path, never a real folder."), toolkitDone),
]

export const pythonBuilds: Record<string, ProjectBuild> = {
  "expense-cli": expenseCli,
  "web-scraper": scraper,
  "automation-toolkit": toolkit,
}

/* ------------------------------------------------------------------ */
/* Screens — what you'll see in the terminal                           */
/* ------------------------------------------------------------------ */

type Line = { text: string; tone?: "cmd" | "ok" | "muted" | "warn" }
const term = (title: string, lines: Line[]): ProjectScreen["mock"] => ({ frame: "terminal", title, blocks: [{ kind: "terminal", lines }] })

export const pythonScreens: Record<string, ProjectScreen[]> = {
  "expense-cli": [
    {
      id: "add-list",
      name: "add and list",
      purpose: "Log spending in one line, and see it back.",
      shows: ["add with amount, category and note", "list with month and category filters", "One clear line for bad input"],
      week: 2,
      mock: term("terminal", [
        { text: 'python -m app.main add 250 food "lunch with team"', tone: "cmd" },
        { text: "Added #14: ₹250.00 food — lunch with team (2026-03-12)", tone: "ok" },
        { text: "python -m app.main add -40 food", tone: "cmd" },
        { text: "Error: amount must be above zero", tone: "warn" },
        { text: "python -m app.main list --month 2026-03 --category food", tone: "cmd" },
        { text: "  #14  2026-03-12  ₹250.00  lunch with team" },
        { text: "  #11  2026-03-09  ₹180.00  dinner" },
      ]),
    },
    {
      id: "import",
      name: "import and export",
      purpose: "Move data in and out as CSV — skipping bad rows, not crashing on them.",
      shows: ["How many rows were imported", "Which rows were skipped, and why"],
      week: 2,
      mock: term("terminal", [
        { text: "python -m app.main import data/sample-expenses.csv", tone: "cmd" },
        { text: "Imported 23 expenses.", tone: "ok" },
        { text: "Skipped row 7: amount must be above zero", tone: "warn" },
      ]),
    },
    {
      id: "report",
      name: "report",
      purpose: "Where the money went this month, as a text chart.",
      shows: ["The month's total", "Each category with a bar and its share", "A warning when over budget"],
      week: 3,
      mock: term("terminal", [
        { text: "python -m app.main report --month 2026-03", tone: "cmd" },
        { text: "March 2026 — total ₹8,420", tone: "ok" },
        { text: "  food    ████████████  ₹3,200  38%" },
        { text: "  travel  ███████       ₹1,900  23%" },
        { text: "  study   █████         ₹1,350  16%" },
        { text: "  ⚠ food is over its ₹3,000 budget", tone: "warn" },
      ]),
    },
    {
      id: "api",
      name: "The API",
      purpose: "The same expenses, from any app — read and written through the same code as the CLI.",
      shows: ["GET /expenses with filters", "POST /expenses with validation"],
      calls: ["GET /expenses", "POST /expenses"],
      week: 3,
      mock: term("localhost:8000/docs", [
        { text: "GET /expenses?month=2026-03&category=food", tone: "cmd" },
        { text: '200 OK  [{"id":14,"amount":250.0,"category":"food","note":"lunch with team"}, …]', tone: "ok" },
        { text: 'POST /expenses  {"amount":-5,"category":"food"}', tone: "cmd" },
        { text: '422  {"detail":[{"loc":["body","amount"],"msg":"Input should be greater than 0"}]}', tone: "warn" },
      ]),
    },
  ],
  "web-scraper": [
    {
      id: "check",
      name: "track and check",
      purpose: "Watch an item, then check every item's price — politely, and without one failure stopping the rest.",
      shows: ["track with a target price", "check, one line per item", "A failed site reported, the rest still checked"],
      week: 2,
      mock: term("terminal", [
        { text: "python -m app.main track https://books.toscrape.com/…/a-light-in-the-attic_1000/ 40", tone: "cmd" },
        { text: "Tracking #3: A Light in the Attic (target £40.00)", tone: "ok" },
        { text: "python -m app.main check", tone: "cmd" },
        { text: "  #1 Sapiens            £54.23  (target £45.00)" },
        { text: "  #2 Sharp Objects      timed out after 3 tries — skipped", tone: "warn" },
        { text: "  #3 A Light in the…    £38.10  ↓ below target — alert sent", tone: "ok" },
      ]),
    },
    {
      id: "alert",
      name: "The alert",
      purpose: "A Telegram message the first time a price drops below your target — not on every run.",
      shows: ["The item, old and new price", "The link"],
      week: 3,
      mock: { frame: "phone", title: "Price bot", blocks: [{ kind: "chat", messages: [{ from: "bot", text: "📉 A Light in the Attic dropped to £38.10 (was £51.77). Your target: £40.00. books.toscrape.com/…" }] }] },
    },
    {
      id: "history",
      name: "History",
      purpose: "Every price you've recorded for an item, newest first.",
      shows: ["Each check's price and time", "The lowest price seen"],
      week: 3,
      mock: term("terminal", [
        { text: "python -m app.main history 3", tone: "cmd" },
        { text: "A Light in the Attic — lowest £38.10", tone: "ok" },
        { text: "  2026-03-12 18:00  £38.10" },
        { text: "  2026-03-12 12:00  £51.77" },
        { text: "  2026-03-12 06:00  £51.77" },
      ]),
    },
  ],
  "automation-toolkit": [
    {
      id: "organize",
      name: "organize --dry-run",
      purpose: "See exactly what would move, before anything does.",
      shows: ["Each planned move", "A clear DRY RUN label", "Nothing changed until you run it for real"],
      week: 2,
      mock: term("terminal", [
        { text: "python -m app.main organize sandbox --dry-run", tone: "cmd" },
        { text: "DRY RUN — nothing will change", tone: "warn" },
        { text: "  IMG_2041.jpg       → Images/IMG_2041.jpg" },
        { text: "  resume_final.pdf   → Documents/resume_final.pdf" },
        { text: "  notes.py           → Code/notes.py" },
        { text: "3 files would move. Run without --dry-run to do it.", tone: "ok" },
      ]),
    },
    {
      id: "undo",
      name: "undo",
      purpose: "Reverse the last run — every file back where it was.",
      shows: ["Each file moved back", "How many actions were reversed"],
      week: 2,
      mock: term("terminal", [
        { text: "python -m app.main undo", tone: "cmd" },
        { text: "Undoing run from 2026-03-12 18:04 (3 actions)…", tone: "muted" },
        { text: "  Code/notes.py → notes.py" },
        { text: "  Documents/resume_final.pdf → resume_final.pdf" },
        { text: "  Images/IMG_2041.jpg → IMG_2041.jpg" },
        { text: "Done. sandbox is back to how it was.", tone: "ok" },
      ]),
    },
    {
      id: "dupes",
      name: "dupes",
      purpose: "Find files with identical content, whatever they're called.",
      shows: ["Groups of identical files", "Space you could free up"],
      week: 3,
      mock: term("terminal", [
        { text: "python -m app.main dupes sandbox", tone: "cmd" },
        { text: "2 groups of duplicates (could free 4.2 MB):", tone: "ok" },
        { text: "  resume_final.pdf  ·  resume_final (1).pdf  ·  cv.pdf" },
        { text: "  IMG_2041.jpg  ·  IMG_2041 copy.jpg" },
      ]),
    },
    {
      id: "report",
      name: "report",
      purpose: "What's in a folder, and what's taking the space.",
      shows: ["Total size and file count by type", "The 10 largest files"],
      week: 3,
      mock: term("terminal", [
        { text: "python -m app.main report ~/Downloads", tone: "cmd" },
        { text: "Downloads — 1,284 files, 6.8 GB", tone: "ok" },
        { text: "  Videos 4.1 GB · Images 1.2 GB · Documents 0.9 GB · Other 0.6 GB" },
        { text: "  Largest: lecture-recording.mp4 (1.4 GB), ubuntu.iso (1.2 GB) …" },
      ]),
    },
  ],
}
