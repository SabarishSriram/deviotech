import type { TrackDocs } from "@/data/docs/types"

export const frontendDocs: TrackDocs = {
  track: "frontend",
  projects: [
    {
      slug: "finance-dashboard",
      pitch: "Build a personal finance dashboard that turns a year of transactions into clear charts, budgets and filters.",
      users: [{ who: "Student or young professional", need: "Understand where their money goes and stay within budget." }],
      mustHave: [
        "Load transactions from a JSON file or mock API (you'll get a sample dataset).",
        "Overview page: income, spending and balance for the selected month.",
        "Charts: spending by category and month-over-month trend.",
        "Transactions table with search, category filter, date range and sorting.",
        "Monthly budgets per category with progress bars and over-budget warnings.",
        "Responsive down to phone width; keyboard accessible.",
      ],
      niceToHave: ["Add/edit transactions saved to localStorage.", "Dark mode.", "CSV import."],
      outOfScope: ["Real bank connections.", "Multiple users."],
      flows: [
        { name: "Check the month", steps: ["User opens the dashboard.", "Picks a month.", "Sees totals, category chart and budget progress update."] },
        { name: "Find a transaction", steps: ["User opens Transactions.", "Searches “Swiggy” and filters to Food.", "Sorts by amount."] },
      ],
      overview: "Data loads on the server for the first paint; filters live in the URL so a filtered view can be shared or bookmarked.",
      data: [
        { name: "Transaction", fields: ["id", "date", "description", "category", "amount (negative = spend)", "account"] },
        { name: "Budget", fields: ["category", "monthlyLimit"] },
      ],
      interface: [
        { label: "/ (Overview)", detail: "Month picker, KPI cards, charts, budget progress." },
        { label: "/transactions", detail: "Table with search, filters and sorting (state in the URL)." },
        { label: "/budgets", detail: "Set and view category limits." },
      ],
      weeks: [
        ["Component tree for all three screens.", "Design tokens and Tailwind/shadcn setup.", "Decide where each piece of state lives."],
        ["Reusable components: KPI card, chart card, data table, filters.", "Layout, navigation and routing.", "Accessibility pass on the components."],
        ["Load the dataset; wire filters to the URL.", "Charts and budgets.", "Loading, empty and error states."],
        ["Lighthouse audit and fixes.", "Deploy on Vercel; README and demo.", "Final review."],
      ],
      doneWhen: [
        "Totals always match the filtered transactions.",
        "Refreshing the page keeps the current filters.",
        "Usable on a phone and with only a keyboard.",
        "Deployed with a Lighthouse report in the README.",
      ],
    },
    {
      slug: "movie-discovery",
      pitch: "Build a movie discovery app on top of a public movie API: browse trending titles, search, filter and keep a personal watchlist.",
      users: [{ who: "Movie fan", need: "Find something good to watch fast and remember it for later." }],
      mustHave: [
        "Trending and top-rated rows from TMDB (free API key).",
        "Search with debounced input and infinite scroll results.",
        "Filters: genre, year and minimum rating.",
        "Movie detail page: poster, overview, cast, trailer link.",
        "Watchlist saved in the browser (Zustand + localStorage).",
        "Skeleton loading states and graceful API errors.",
      ],
      niceToHave: ["Similar movies on the detail page.", "Share a movie link.", "Light/dark theme."],
      outOfScope: ["User accounts.", "Streaming video."],
      flows: [
        { name: "Search", steps: ["User types in the search box.", "Results appear after they pause typing.", "Scrolling loads more."] },
        { name: "Save for later", steps: ["User opens a movie.", "Clicks “Add to watchlist”.", "It appears on /watchlist, even after refresh."] },
      ],
      overview: "Server components fetch trending lists and detail pages (fast first load, API key stays on the server). Search and infinite scroll run on the client with React Query.",
      data: [
        { name: "Movie (from TMDB)", fields: ["id", "title", "posterPath", "releaseDate", "voteAverage", "genreIds", "overview"] },
        { name: "WatchlistItem", fields: ["movieId", "title", "posterPath", "addedAt"] },
      ],
      interface: [
        { label: "/", detail: "Trending and top-rated rows." },
        { label: "/search?q=&genre=&year=", detail: "Search with filters and infinite scroll." },
        { label: "/movie/[id]", detail: "Detail page." },
        { label: "/watchlist", detail: "Saved movies." },
      ],
      weeks: [
        ["Get a TMDB key (keep it in .env.local).", "Component plan for four screens.", "Design tokens and setup."],
        ["Movie card, row, grid and skeleton components.", "Routing and layout.", "Accessible focus states."],
        ["Server-side fetching for home and detail.", "Search with React Query and infinite scroll.", "Watchlist store."],
        ["Lighthouse fixes (image sizes, lazy loading).", "Deploy on Vercel; README and demo.", "Final review."],
      ],
      doneWhen: [
        "The API key never appears in the browser's network requests.",
        "Search doesn't fire a request on every keystroke.",
        "Watchlist survives a refresh.",
        "Deployed with a Lighthouse report.",
      ],
    },
    {
      slug: "admin-panel",
      pitch: "Build the admin panel a small company uses to manage users and orders: data tables, forms and views that change by role.",
      users: [
        { who: "Admin", need: "Manage users and orders, including editing and deleting." },
        { who: "Support agent", need: "Look up orders and users, but not delete anything." },
      ],
      mustHave: [
        "Mock login that picks a role (admin or support).",
        "Users table: search, sort, paginate; create and edit users in a form with validation.",
        "Orders table with status filters and an order detail drawer.",
        "Role-based UI: support can't see delete buttons or the settings page.",
        "Toasts for success and errors; confirm dialog before destructive actions.",
        "Use a mock API (e.g. JSON server or Next.js route handlers).",
      ],
      niceToHave: ["Bulk select and bulk status change.", "Export table to CSV.", "Saved filters."],
      outOfScope: ["Real authentication.", "A real backend database."],
      flows: [
        { name: "Edit a user", steps: ["Admin searches the users table.", "Opens a user, edits the form.", "Saves; a toast confirms and the table updates."] },
        { name: "Support lookup", steps: ["Support agent filters orders by status.", "Opens one in the drawer.", "Has no edit or delete options."] },
      ],
      overview: "One reusable data table component powers both tables. Role checks live in one helper so the UI and route guards agree.",
      data: [
        { name: "User", fields: ["id", "name", "email", "role", "status (active | suspended)", "createdAt"] },
        { name: "Order", fields: ["id", "customerName", "total", "status (pending | paid | shipped | refunded)", "items[]", "createdAt"] },
      ],
      interface: [
        { label: "/login", detail: "Pick a role (mock)." },
        { label: "/users · /users/[id]", detail: "Table and edit form." },
        { label: "/orders", detail: "Table with filters and a detail drawer." },
        { label: "/settings", detail: "Admins only." },
      ],
      weeks: [
        ["Component plan; list what each role can see.", "Design tokens and shadcn setup.", "Mock data and API shape."],
        ["Reusable data table (search, sort, paginate).", "Form components with validation.", "Layout with sidebar navigation."],
        ["Wire users and orders to the mock API with React Query.", "Role-based UI and route guard.", "Toasts, dialogs, loading and empty states."],
        ["Lighthouse and accessibility fixes.", "Deploy on Vercel; README and demo.", "Final review."],
      ],
      doneWhen: [
        "Support role can't reach /settings or delete anything, even by typing the URL.",
        "Forms show field-level errors.",
        "Both tables use the same component.",
        "Deployed with README and demo.",
      ],
    },
  ],
}
