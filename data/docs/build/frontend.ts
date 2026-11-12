import { finalReviewTask, mergedLine, planTask, readmeTask } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * Frontend: three Next.js apps, week by week, built on the my-frontend-app
 * repo from Setup (Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui,
 * React Query and Zustand installed).
 */

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

function shellTask(routes: string, nav: string): BuildTask {
  return {
    id: "shell",
    title: "Layout, navigation and empty pages",
    why: "Before any real component, put the skeleton in place: every page exists, the navigation works, and the look (colours, spacing, fonts) is decided once.",
    branch: "feat/shell",
    prompt: `Using the Next.js App Router, create these pages with a heading and a short placeholder each: ${routes}. Add a shared layout in app/layout.tsx with ${nav}, which highlights the current page and collapses to a menu button on phones. Use shadcn/ui and Tailwind. Explain the difference between a layout and a page.`,
    understand: ["Which file decides the URL of each page?", "What does app/layout.tsx wrap, and why does the navigation go there?", "How does the navigation know which page is current?"],
    check: [
      { text: "Click through every page — each one loads, and the current page is highlighted." },
      { text: "Make the browser narrow (or open DevTools → phone view): the navigation becomes a menu button that still works." },
    ],
    debug: ["A page shows 404: the folder name is the URL. /transactions needs app/transactions/page.tsx."],
    commit: "Add layout, navigation and pages",
  }
}

const a11yTask: BuildTask = {
  id: "a11y",
  title: "Keyboard and screen-reader pass",
  why: "Many people never touch a mouse. If your app works with only a keyboard and reads well aloud, it works better for everyone.",
  branch: "fix/a11y",
  prompt:
    "Review my components for accessibility. For each problem, say what it is, who it affects and where it is: missing labels on inputs and icon buttons, focus you can't see, things you can't reach with Tab, wrong heading order, colour contrast below 4.5:1, and charts or images with no text alternative. Don't fix anything yet — list them.",
  steps: [{ text: "Unplug your mouse (or don't touch the trackpad) and use the whole app with Tab, Shift + Tab, Enter, Space and Esc. Note every place you get stuck, then fix them one by one." }],
  understand: ["Why does every icon-only button need an aria-label?", "What's a focus ring for, and why must it never be removed without a replacement?", "How does a screen reader user know what a chart shows?"],
  check: [{ text: "You can do every main task with only the keyboard, and you can always see where the focus is." }, { text: "Chrome DevTools → Lighthouse → Accessibility scores 90 or more." }],
  commit: "Fix keyboard and screen-reader issues",
}

const lighthouseTask: BuildTask = {
  id: "lighthouse",
  title: "Lighthouse audit and fixes",
  why: "Lighthouse turns “is it fast and accessible?” into numbers. You fix what it finds, and the report goes in your README.",
  branch: "perf/lighthouse",
  prompt:
    "Here's my Lighthouse report (I'll paste the failing items). For each one, explain what it means for a real user and the smallest change that fixes it in a Next.js app — for example next/image with sizes, next/font, lazy-loading below the fold, or labels.",
  steps: [
    { text: "Build and run the production version (Lighthouse on npm run dev isn't fair):", code: "npm run build\nnpm start" },
    { text: "In Chrome, open http://localhost:3000 → DevTools (F12) → Lighthouse → Analyze page load. Screenshot the scores, then paste the failing items into your AI chat." },
  ],
  understand: ["What is LCP, and what was the biggest thing on your page?", "Which fix made the biggest difference, and why?"],
  check: [{ text: "Performance, Accessibility and Best Practices are 90 or more. The before and after screenshots are saved in docs/." }],
  debug: ["Scores jump between runs: close other tabs and extensions (or use a Guest window), and run it twice."],
  commit: "Fix Lighthouse issues",
}

const deployTask: BuildTask = {
  id: "deploy",
  title: "Deploy on Vercel",
  why: "Vercel is made by the Next.js team: connect your repo and every push to main goes live.",
  branch: "chore/deploy",
  prompt: "I'm deploying my Next.js app to Vercel. Check it's ready: npm run build passes with no errors, every environment variable it needs is listed in .env.example, and nothing secret starts with NEXT_PUBLIC_. List anything to fix and why.",
  steps: [{ text: "Follow Building → Deployment: import the repo on vercel.com and add every variable from .env.example with its real value." }],
  understand: ["Why must npm run build pass before you deploy?", "Which of your variables reach the browser, and which stay on the server?"],
  check: [{ text: "Open your Vercel URL and use every page. Refresh on a page that isn't the home page — it still loads." }],
  debug: ["The build fails on Vercel but works on your laptop: run npm run build locally — type errors and lint errors fail the build."],
  commit: "Prepare for deployment",
}

function shipWeek(name: string, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it: fix what Lighthouse finds, deploy on Vercel, write it up and get ready for the final review.",
    tasks: [
      lighthouseTask,
      deployTask,
      readmeTask({ name, sections: "live link, screenshots, your Lighthouse scores, tech stack, how to run it locally, environment variables (names only)", demo: "use every page", check: "The live link, Lighthouse screenshots and demo video all open." }),
      finalReviewTask(doneWhen, "your live site"),
    ],
    done: ["Lighthouse scores of 90+ in the README", "The site is live on Vercel", "The demo video is linked from the README", "Your mentor has the links for the final review"],
  }
}

const statesUnderstand = "Why does every screen with data need loading, empty and error states?"

/* ------------------------------------------------------------------ */
/* Personal finance dashboard                                          */
/* ------------------------------------------------------------------ */

const financeDone = ["Totals always match the filtered transactions.", "Refreshing the page keeps the current filters.", "Usable on a phone and with only a keyboard.", "Deployed with a Lighthouse report in the README."]

const finance: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — the components and where each piece of state lives — then build the empty skeleton of the app.",
    tasks: [
      planTask({
        parts: ["Components — the component tree for each screen: which pieces repeat (a KPI card, a chart card, a filter bar) and what each one takes as props.", "State — for each piece of state (month, filters, budgets), where it lives: the URL, a component, or Zustand — and why."],
        questions: ["Why do the filters live in the URL?", "Which component will you reuse the most?"],
      }),
      shellTask("/ (Overview), /transactions and /budgets", "a sidebar with the three pages"),
    ],
    done: ["docs/plan.md has your component tree and state plan", "All three pages exist with working navigation", mergedLine],
  },
  {
    intro: "Build the reusable pieces — KPI cards, charts, the data table and filters — with sample data, before wiring real data.",
    tasks: [
      {
        id: "components",
        title: "KPI cards and charts",
        why: "Small, typed, reusable components are the heart of frontend work. Build them with fake data first, so you can see every state.",
        branch: "feat/components",
        screens: ["overview"],
        prompt: "Install Recharts. Build typed components in components/: KpiCard (label, value, change from last month), CategoryChart (spending by category, a bar or donut chart) and TrendChart (monthly totals, a line chart). Each takes its data as props and has a loading skeleton. Put them on the Overview page with hard-coded sample data.",
        steps: [{ text: "Install the chart library:", code: "npm install recharts" }],
        understand: ["What are this component's props, and why those?", "How would someone using a screen reader get the information in your chart?", "Why build with fake data first?"],
        check: [{ text: "The Overview page shows three KPI cards and both charts. Make the window phone-sized — nothing overflows." }],
        commit: "Add KPI cards and charts",
      },
      {
        id: "table",
        title: "Transactions table and filters",
        why: "A good data table — search, filter, sort — is one of the most reused things in real frontend work.",
        branch: "feat/table",
        screens: ["transactions"],
        prompt: "Build a TransactionsTable component (columns: date, description, category, amount — spending in red) with sortable column headers, and a FiltersBar with a search box, a category select and a date range. Use shadcn/ui's Table, Input and Select. For now, filter the sample data in the component.",
        steps: [{ text: "Add the shadcn/ui pieces you need:", code: "npx shadcn@latest add table select badge" }],
        understand: ["How does sorting work when you click a column header twice?", "What's the difference between a controlled and an uncontrolled input?"],
        check: [{ text: "Search, filter by category and sort by amount — the table updates each time." }],
        commit: "Add transactions table and filters",
      },
      a11yTask,
    ],
    done: ["KPI cards, charts, table and filters as reusable components", "Everything works with a keyboard", mergedLine],
  },
  {
    intro: "Wire it to real data: load the year of transactions, put the filters in the URL, and add budgets.",
    tasks: [
      {
        id: "data",
        title: "Load the data and put filters in the URL",
        why: "The first paint comes from the server. Filters in the URL mean a refresh — or a shared link — keeps exactly what you were looking at.",
        branch: "feat/data",
        screens: ["overview", "transactions"],
        prompt: "My transactions are in public/transactions.json. Write lib/transactions.ts that reads it on the server with functions to filter by month, category, search text and date range, and to total them. Load it in the server components for / and /transactions. Move every filter into the URL search params (?month=&category=&q=&from=&to=&sort=), so the page reads them on the server and the filter bar updates the URL.",
        steps: [{ text: "Follow Reference → Sample data in the sidebar: it gives you a small script that generates a year of transactions into public/transactions.json. Run it once and commit the file." }],
        understand: ["Walk through what happens when you change the category filter, from the click to the new table.", "Why are the totals worked out from the filtered list, not stored?", statesUnderstand],
        check: [
          { text: "Filter to one category and one month, then refresh — the same filters are still applied." },
          { text: "Add up a few rows by hand: the totals match the table." },
        ],
        debug: ["“useSearchParams() should be wrapped in a suspense boundary”: wrap the client component that uses it in <Suspense>."],
        commit: "Load transactions and keep filters in the URL",
      },
      {
        id: "budgets",
        title: "Budgets",
        why: "Budgets turn the numbers into decisions: how close am I to my limit this month?",
        branch: "feat/budgets",
        screens: ["budgets"],
        prompt: "Build /budgets: a form to set a monthly limit per category, saved with Zustand's persist middleware in localStorage. Show each category as a progress bar of this month's spending against its limit — amber over 80%, red over 100%, with the word Over budget (not only the colour). Show the same bars on the Overview page.",
        understand: ["Why Zustand here, and not the URL?", "Why say Over budget in words, not only in red?"],
        check: [{ text: "Set a small limit for one category: its bar turns red and says Over budget — on /budgets and on the Overview. Refresh: the limit is still there." }],
        commit: "Add budgets",
      },
    ],
    done: ["Every page reads real data", "Filters survive a refresh", "Budgets save and warn when you're over", mergedLine],
  },
  shipWeek("Personal finance dashboard", financeDone),
]

/* ------------------------------------------------------------------ */
/* Movie discovery app                                                 */
/* ------------------------------------------------------------------ */

const movieDone = ["The API key never appears in the browser's network requests.", "Search doesn't fire a request on every keystroke.", "Watchlist survives a refresh.", "Deployed with a Lighthouse report."]

const movies: ProjectBuild = [
  {
    intro: "You've read Start here. Get your TMDB key, plan the app in your own words, then build the empty skeleton.",
    tasks: [
      planTask({
        parts: ["Components — the component tree for the four screens: what repeats (a movie card, a row, a grid) and their props.", "Data — which data is fetched on the server, which in the browser, and why the API key must never reach the browser."],
        questions: ["Why does the home page fetch on the server?", "Where will the watchlist live, and why there?"],
      }),
      { ...shellTask("/ (Home), /search, /movie/[id] (show the id for now) and /watchlist", "a top bar with the app name, a search link and the watchlist"), steps: [{ text: "Get a free API key at themoviedb.org (Settings → API) and put it in .env.local as TMDB_API_KEY — never with NEXT_PUBLIC_." }] },
    ],
    done: ["docs/plan.md has your component tree and data plan", "All four pages exist with working navigation", "Your TMDB key is in .env.local only", mergedLine],
  },
  {
    intro: "Build the reusable pieces — movie cards, rows, grids and skeletons — and make them keyboard-friendly.",
    tasks: [
      {
        id: "components",
        title: "Movie card, row, grid and skeletons",
        why: "Every screen is built from the same few pieces. Get them right once.",
        branch: "feat/components",
        screens: ["home"],
        prompt: "Build typed components: MovieCard (poster with next/image, title, year, rating; links to /movie/[id]), MovieRow (a horizontally scrolling row with a title), MovieGrid (a responsive grid) and a skeleton version of each. Allow image.tmdb.org in next.config.ts. Show them on the home page with three hard-coded movies.",
        understand: ["Why next/image instead of <img>?", "What do the skeletons prevent?", "How does a keyboard user scroll a row?"],
        check: [{ text: "The home page shows a row and a grid of cards with posters. Tab moves through the cards, and you can see which one has focus." }],
        debug: ["“hostname image.tmdb.org is not configured”: add it to images.remotePatterns in next.config.ts and restart npm run dev."],
        commit: "Add movie card, row, grid and skeletons",
      },
      a11yTask,
    ],
    done: ["Reusable card, row, grid and skeletons", "Everything works with a keyboard", mergedLine],
  },
  {
    intro: "Wire it to TMDB: server-side rows and detail pages, search with infinite scroll, and the watchlist.",
    tasks: [
      {
        id: "server-data",
        title: "Home and detail pages from TMDB",
        why: "Fetching on the server gives a fast first load — and keeps your API key off the browser entirely.",
        branch: "feat/tmdb",
        screens: ["home", "detail"],
        prompt: "Write lib/tmdb.ts with typed functions that call TMDB with TMDB_API_KEY: trending movies, top rated, one movie with its credits and videos. Use them in server components for / (two rows) and /movie/[id] (poster, overview, cast, a trailer link). Add loading.tsx skeletons and an error.tsx with a Try again button.",
        understand: ["Open DevTools → Network on the home page: why is there no request to TMDB?", "What do loading.tsx and error.tsx do?", statesUnderstand],
        check: [{ text: "Home shows trending and top-rated rows. Open a movie: its details, cast and trailer link appear." }, { text: "DevTools → Network: search the requests for your API key — it's not there." }],
        commit: "Load home and detail pages from TMDB",
      },
      {
        id: "search",
        title: "Search with infinite scroll",
        why: "Search runs in the browser as you type — so it must wait for a pause, and load more as you scroll.",
        branch: "feat/search",
        screens: ["search"],
        prompt: "Add a route handler app/api/search/route.ts that calls TMDB's search with the server-side key. On /search, build a search box debounced by 400 ms and genre, year and rating filters kept in the URL. Load results with React Query's useInfiniteQuery from my route handler, loading the next page when the user scrolls near the bottom (IntersectionObserver).",
        understand: ["What does debouncing do, and what would happen without it?", "Why go through your own /api/search instead of calling TMDB from the browser?", "How does infinite scroll know when to load more?"],
        check: [{ text: "Type a title quickly: Network shows one search request after you stop typing, not one per letter." }, { text: "Scroll to the bottom: more results load." }],
        commit: "Add search with infinite scroll",
      },
      {
        id: "watchlist",
        title: "Watchlist",
        why: "The one piece of state that's yours, kept in the browser between visits.",
        branch: "feat/watchlist",
        screens: ["watchlist"],
        prompt: "Create a Zustand store with the persist middleware for the watchlist (movieId, title, posterPath, addedAt). Add an Add to watchlist / Remove button on the detail page and on cards, and build /watchlist with an empty state that links to the home page.",
        understand: ["Why does the watchlist live in Zustand + localStorage?", "What would you need to change to sync it between devices?"],
        check: [{ text: "Add two movies, refresh, and open /watchlist — both are there. Remove one." }],
        debug: ["“Hydration failed” on /watchlist: the server doesn't know what's in localStorage. Show the list only after the component has mounted."],
        commit: "Add watchlist",
      },
    ],
    done: ["Home and detail pages load from TMDB on the server", "Search waits for a pause and scrolls forever", "The watchlist survives a refresh", mergedLine],
  },
  shipWeek("Movie discovery app", movieDone),
]

/* ------------------------------------------------------------------ */
/* Admin panel                                                         */
/* ------------------------------------------------------------------ */

const adminDone = ["Support role can't reach /settings or delete anything, even by typing the URL.", "Forms show field-level errors.", "Both tables use the same component.", "Deployed with README and demo."]

const adminPanel: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially what each role can see — then build the skeleton and a mock API.",
    tasks: [
      planTask({
        parts: ["Roles — a table of every page and action, and whether Admin and Support can use it.", "Components — the one data table both pages share: its props, and what's different between users and orders."],
        questions: ["Why does one data table power both pages?", "Hiding a button isn't security. What else stops Support from deleting?"],
      }),
      {
        ...shellTask("/login, /users, /users/[id], /orders and /settings", "a sidebar (Users, Orders, Settings) and the current user's role in the corner"),
        prompt:
          "Using the Next.js App Router, create /login, /users, /users/[id], /orders and /settings with a placeholder each, and a shared layout (except on /login) with a sidebar (Users, Orders, Settings) that highlights the current page and collapses on phones. Then add a mock API with route handlers in app/api/users and app/api/orders that read and write data/db.json. Start from the users and orders in Reference → Sample data, and ask AI for more rows until you have about 40 users and 60 orders. Explain the difference between a layout and a page.",
      },
    ],
    done: ["docs/plan.md has the roles table and component plan", "All pages exist with working navigation", "The mock API returns users and orders", mergedLine],
  },
  {
    intro: "Build the reusable pieces: one data table for everything, and form components with validation.",
    tasks: [
      {
        id: "data-table",
        title: "One reusable data table",
        why: "Real admin panels are mostly tables. One good, generic table component saves you building it twice.",
        branch: "feat/data-table",
        screens: ["users"],
        prompt: "Build a generic DataTable<T> component: you pass columns (header, how to show a cell, sortable or not) and rows; it does search, column sorting and pagination (20 per page), with an empty state. Use shadcn/ui's Table. Show it on /users with the mock users.",
        steps: [{ text: "Add the shadcn/ui pieces you need:", code: "npx shadcn@latest add table badge dropdown-menu" }],
        understand: ["What does the <T> in DataTable<T> mean, and what does it give you?", "How does someone add a new column without changing DataTable itself?"],
        check: [{ text: "On /users: search, sort by name and created date, and page through all 40 users." }],
        commit: "Add reusable data table",
      },
      {
        id: "forms",
        title: "User form with validation",
        why: "Forms are where users make mistakes. Clear errors next to each field fix most of them.",
        branch: "feat/forms",
        screens: ["edit-user"],
        prompt: "Build the user form on /users/[id] (and a New user button) with react-hook-form and zod: name required, valid email, role and status selects. Show each error under its field, disable Save while sending, and use shadcn/ui's Form components.",
        steps: [{ text: "Install form tools:", code: "npm install react-hook-form zod @hookform/resolvers\nnpx shadcn@latest add form select sonner" }],
        understand: ["Where does validation happen, and when does it run?", "Why disable Save while the form is sending?"],
        check: [{ text: "Submit the form empty and with a bad email — each field shows its own error." }],
        commit: "Add user form with validation",
      },
      a11yTask,
    ],
    done: ["One data table component", "The user form validates every field", "Everything works with a keyboard", mergedLine],
  },
  {
    intro: "Wire it up: real data through React Query, the orders drawer, toasts, and roles that hide — and block — what they should.",
    tasks: [
      {
        id: "wire",
        title: "Users and orders from the mock API",
        why: "React Query loads, caches and refreshes your data — and tells you when it's loading or failed.",
        branch: "feat/wire-api",
        screens: ["users", "orders"],
        prompt: "Wrap the app in a React Query provider. Load users and orders from my mock API with useQuery, and save the user form with useMutation, refreshing the users list afterwards. On /orders, use the same DataTable with status filter chips, and open an order's details (items and total) in a shadcn/ui Sheet drawer. Show success and error toasts, and a confirm dialog before deleting.",
        understand: ["What does React Query do that useEffect + fetch doesn't?", "After you save a user, how does the table know to refresh?", statesUnderstand],
        check: [{ text: "Edit a user and save: a toast confirms and the table shows the change. Filter orders by status and open one in the drawer." }],
        commit: "Load users and orders with React Query",
      },
      {
        id: "roles",
        title: "Roles in the UI — and the routes",
        why: "Support agents can look but not delete. The UI hides what they can't use, and the route blocks it even if they type the URL.",
        branch: "feat/roles",
        screens: ["login", "settings"],
        prompt: "On /login, let the user pick Admin or Support and save the role in a cookie. Write one helper, lib/roles.ts, that answers “can this role do this action?”, and use it everywhere: hide delete buttons and the Settings link for Support, and in proxy.ts (Next.js 16's new name for middleware) redirect Support away from /settings. The mock API's delete routes also check the cookie and return 403.",
        understand: ["Why one helper for every role check?", "Support types /settings into the address bar. Walk through what stops them.", "Why must the API check the role too?"],
        check: [{ text: "Log in as Support: no delete buttons, no Settings link, and typing /settings sends you away." }],
        commit: "Add role-based UI and route guard",
      },
    ],
    done: ["Both tables load from the mock API with React Query", "Toasts and confirm dialogs on changes", "Support can't reach /settings or delete, even by URL", mergedLine],
  },
  shipWeek("Admin panel", adminDone),
]

export const frontendBuilds: Record<string, ProjectBuild> = {
  "finance-dashboard": finance,
  "movie-discovery": movies,
  "admin-panel": adminPanel,
}

/* ------------------------------------------------------------------ */
/* Screens                                                             */
/* ------------------------------------------------------------------ */

export const frontendScreens: Record<string, ProjectScreen[]> = {
  "finance-dashboard": [
    {
      id: "overview",
      name: "Overview",
      purpose: "The month at a glance: what came in, what went out, where it went, and how the budgets are doing.",
      shows: ["A month picker", "Income, spending and balance cards", "Spending by category and the monthly trend", "Budget progress bars"],
      week: 2,
      mock: {
        frame: "browser",
        title: "Paisa",
        url: "paisa.vercel.app/?month=2026-03",
        nav: ["Overview", "Transactions", "Budgets"],
        blocks: [
          { kind: "kpis", items: [{ label: "Income", value: "₹42,000" }, { label: "Spending", value: "₹31,480" }, { label: "Balance", value: "₹10,520" }, { label: "vs Feb", value: "−8%" }] },
          { kind: "bars", title: "Spending by category", values: [9200, 6400, 5100, 4300, 3100], labels: ["Rent", "Food", "Travel", "Shopping", "Bills"] },
        ],
      },
    },
    {
      id: "transactions",
      name: "Transactions",
      purpose: "Every transaction, searchable and filterable — and the filters stay in the URL.",
      shows: ["Search, category and date range filters", "A sortable table", "Totals for what's filtered"],
      week: 2,
      mock: {
        frame: "browser",
        title: "Paisa",
        url: "paisa.vercel.app/transactions?q=swiggy&category=food",
        nav: ["Overview", "Transactions", "Budgets"],
        active: 1,
        blocks: [
          { kind: "search", placeholder: "swiggy", chips: ["Food", "Mar 2026", "Amount ↓"] },
          { kind: "table", columns: ["Date", "Description", "Category", "Amount"], rows: [["Mar 14", "Swiggy", "Food", "−₹482"], ["Mar 9", "Swiggy Instamart", "Food", "−₹1,240"], ["Mar 2", "Swiggy", "Food", "−₹356"]] },
        ],
      },
    },
    {
      id: "budgets",
      name: "Budgets",
      purpose: "Set a monthly limit per category and see how close you are.",
      shows: ["A limit per category", "Progress bars: amber over 80%, red and “Over budget” over 100%"],
      week: 3,
      mock: {
        frame: "browser",
        title: "Paisa",
        url: "paisa.vercel.app/budgets",
        nav: ["Overview", "Transactions", "Budgets"],
        active: 2,
        blocks: [
          {
            kind: "list",
            title: "March budgets",
            items: [
              { title: "Food", meta: "₹6,400 of ₹6,000", right: "Over budget" },
              { title: "Travel", meta: "₹5,100 of ₹6,000", right: "85%" },
              { title: "Shopping", meta: "₹4,300 of ₹8,000", right: "54%" },
            ],
          },
          { kind: "form", title: "Set a limit", fields: ["Category", "Monthly limit (₹)"], button: "Save" },
        ],
      },
    },
  ],
  "movie-discovery": [
    {
      id: "home",
      name: "Home",
      purpose: "Something good to watch, fast: trending and top-rated rows, loaded on the server.",
      shows: ["A trending row and a top-rated row", "Poster cards with title, year and rating", "Skeletons while loading"],
      week: 3,
      mock: { frame: "browser", title: "Reel", url: "reel.vercel.app", blocks: [{ kind: "posters", title: "Trending this week", items: ["Dune: Part Two", "Inside Out 2", "Oppenheimer", "Laapataa Ladies", "The Batman", "12th Fail"] }, { kind: "posters", title: "Top rated", items: ["Interstellar", "3 Idiots", "Parasite", "Spirited Away", "Whiplash", "Drishyam"] }] },
    },
    {
      id: "search",
      name: "Search",
      purpose: "Find any movie: search waits for you to stop typing, filters narrow it down, and scrolling loads more.",
      shows: ["A debounced search box", "Genre, year and rating filters", "A grid that loads more as you scroll"],
      week: 3,
      mock: { frame: "browser", title: "Reel", url: "reel.vercel.app/search?q=space&genre=sci-fi", blocks: [{ kind: "search", placeholder: "space", chips: ["Sci-fi", "2010+", "7+ rating"] }, { kind: "posters", title: "Results", items: ["Interstellar", "Gravity", "The Martian", "Arrival", "Ad Astra", "Moon"] }] },
    },
    {
      id: "detail",
      name: "Movie page",
      purpose: "Everything about one movie, and the button to save it for later.",
      shows: ["Poster, overview and rating", "Cast", "A trailer link", "Add to watchlist"],
      week: 3,
      mock: { frame: "browser", title: "Reel", url: "reel.vercel.app/movie/157336", blocks: [{ kind: "stat", label: "Interstellar · 2014 · 2h 49m", value: "★ 8.4", caption: "Sci-fi · Drama · Adventure" }, { kind: "cards", items: [{ title: "Matthew McConaughey", meta: "Cooper" }, { title: "Anne Hathaway", meta: "Brand" }, { title: "Jessica Chastain", meta: "Murph" }] }, { kind: "form", title: "", fields: [], button: "+ Add to watchlist" }] },
    },
    {
      id: "watchlist",
      name: "Watchlist",
      purpose: "Movies you saved — still there after a refresh.",
      shows: ["Saved movies, newest first", "Remove from the watchlist", "An empty state that links home"],
      week: 3,
      mock: { frame: "browser", title: "Reel", url: "reel.vercel.app/watchlist", blocks: [{ kind: "posters", title: "My watchlist (4)", items: ["Interstellar", "Laapataa Ladies", "Arrival", "Whiplash"] }] },
    },
  ],
  "admin-panel": [
    {
      id: "login",
      name: "Log in (pick a role)",
      purpose: "A mock login: choose Admin or Support to see how the panel changes.",
      shows: ["An Admin / Support choice", "Remembered in a cookie"],
      week: 3,
      mock: { frame: "browser", title: "Control", url: "control.vercel.app/login", blocks: [{ kind: "form", title: "Log in as", fields: ["Role: Admin / Support"], button: "Continue" }] },
    },
    {
      id: "users",
      name: "Users",
      purpose: "Every user in one searchable, sortable, paginated table — the same table component as Orders.",
      shows: ["Search and sortable columns", "Status badges", "Pagination", "New user (and Delete, for admins)"],
      week: 2,
      mock: {
        frame: "browser",
        title: "Control",
        url: "control.vercel.app/users",
        nav: ["Users", "Orders", "Settings"],
        blocks: [
          { kind: "search", placeholder: "Search users", chips: ["All", "Active", "Suspended"] },
          { kind: "table", columns: ["Name", "Email", "Role", "Status"], rows: [["Priya Sharma", "priya@acme.in", "Admin", "Active"], ["Arjun Mehta", "arjun@acme.in", "Support", "Active"], ["Neha Gupta", "neha@acme.in", "Customer", "Suspended"]] },
        ],
      },
    },
    {
      id: "edit-user",
      name: "Edit a user",
      purpose: "Change a user's details, with an error next to any field that's wrong.",
      shows: ["Name, email, role and status", "Errors under each field", "Save, with a toast when it's done"],
      week: 2,
      mock: { frame: "browser", title: "Control", url: "control.vercel.app/users/42", nav: ["Users", "Orders", "Settings"], blocks: [{ kind: "form", title: "Edit Neha Gupta", fields: ["Name", "Email", "Role", "Status"], button: "Save changes" }] },
    },
    {
      id: "orders",
      name: "Orders",
      purpose: "Find any order by status and open its details in a drawer — without leaving the table.",
      shows: ["Status filter chips", "The same data table as Users", "A detail drawer with items and total"],
      week: 3,
      mock: {
        frame: "browser",
        title: "Control",
        url: "control.vercel.app/orders?status=paid",
        nav: ["Users", "Orders", "Settings"],
        active: 1,
        blocks: [
          { kind: "search", placeholder: "Search orders", chips: ["Paid", "Pending", "Shipped", "Refunded"] },
          { kind: "table", columns: ["Order", "Customer", "Total", "Status"], rows: [["#1042", "Rahul V", "₹2,499", "Paid"], ["#1041", "Sana K", "₹899", "Paid"], ["#1038", "Dev P", "₹4,150", "Paid"]] },
        ],
      },
    },
    {
      id: "settings",
      name: "Settings (admins only)",
      purpose: "Only admins get here. Support is redirected away — even by typing the URL.",
      shows: ["Company settings", "Hidden from Support, and blocked by the route guard"],
      week: 3,
      mock: { frame: "browser", title: "Control", url: "control.vercel.app/settings", nav: ["Users", "Orders", "Settings"], active: 2, blocks: [{ kind: "form", title: "Company settings", fields: ["Company name", "Support email", "Default order status"], button: "Save" }] },
    },
  ],
}
