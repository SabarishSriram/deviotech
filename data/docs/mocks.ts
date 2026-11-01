import type { Mock } from "@/data/docs/types"

/**
 * Illustrative mockups of each project's main screen, keyed by project slug.
 * They show what “done” roughly looks like — students design their own UI.
 * Design-track projects have none on purpose: designing the screens is the work.
 */
export const mocks: Record<string, Mock> = {
  /* ---------------- Full-Stack ---------------- */
  "job-tracker": {
    frame: "browser",
    title: "JobTrack",
    url: "jobtrack.vercel.app/board",
    nav: ["Board", "List", "Follow-ups", "Stats"],
    blocks: [
      { kind: "kpis", items: [{ label: "Applied", value: "24" }, { label: "Interviews", value: "5" }, { label: "Offers", value: "1" }, { label: "Follow-ups due", value: "3" }] },
      {
        kind: "kanban",
        columns: [
          { title: "Applied", cards: ["Razorpay · SDE Intern", "Zomato · Frontend", "CRED · Backend"] },
          { title: "Interview", cards: ["Swiggy · SDE Intern", "Groww · Full-stack"] },
          { title: "Offer", cards: ["Freshworks · Intern"] },
          { title: "Rejected", cards: ["Flipkart · SDE"] },
        ],
      },
    ],
  },
  "event-booking": {
    frame: "browser",
    title: "EventHub",
    url: "eventhub.vercel.app/events",
    blocks: [
      { kind: "search", placeholder: "Search events", chips: ["Upcoming", "This weekend", "Past"] },
      {
        kind: "cards",
        items: [
          { title: "React Bengaluru Meetup", meta: "Sat 14 Mar · Koramangala", badge: "12 left" },
          { title: "Open Mic Night", meta: "Fri 20 Mar · Indiranagar", badge: "Full" },
          { title: "Startup Pitch Day", meta: "Sun 22 Mar · HSR Layout", badge: "40 left" },
        ],
      },
    ],
  },
  "task-manager": {
    frame: "browser",
    title: "TeamBoard",
    url: "teamboard.vercel.app/teams/design",
    nav: ["Design team", "Website board", "My tasks", "Members"],
    blocks: [
      {
        kind: "kanban",
        columns: [
          { title: "To do", cards: ["Hero copy · Priya · Mar 18", "Pricing page · Arjun"] },
          { title: "In progress", cards: ["Navbar redesign · You · Mar 15"] },
          { title: "Done", cards: ["Brand colours", "Logo exports"] },
        ],
      },
    ],
  },

  /* ---------------- Backend ---------------- */
  "url-shortener": {
    frame: "terminal",
    title: "api-requests",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "curl -X POST /api/links -d '{\"url\":\"https://example.com/very/long/path\"}'", tone: "cmd" },
          { text: '201 Created  {"code":"x7Kp2","shortUrl":"https://sho.rt/x7Kp2"}', tone: "ok" },
          { text: "curl -I /x7Kp2", tone: "cmd" },
          { text: "302 Found  location: https://example.com/very/long/path  (12 ms · cache hit)", tone: "ok" },
          { text: "curl /api/links/42/stats", tone: "cmd" },
          { text: '{"clicks":318,"byDay":[{"2026-03-14":41}],"topReferrers":["twitter.com","linkedin.com"]}' },
          { text: "for i in {1..120}; do curl -X POST /api/links …; done", tone: "cmd" },
          { text: "429 Too Many Requests  rate limit: 100/min", tone: "warn" },
        ],
      },
    ],
  },
  "ecommerce-backend": {
    frame: "terminal",
    title: "api-requests",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "curl '/api/products?category=shoes&page=1'", tone: "cmd" },
          { text: '200 OK  {"items":[{"name":"Runner X","priceInPaise":349900,"stock":12}],"page":1,"total":48}', tone: "ok" },
          { text: "curl -X POST /api/cart -d '{\"productId\":7,\"quantity\":2}'", tone: "cmd" },
          { text: '200 OK  {"items":2,"totalInPaise":699800}', tone: "ok" },
          { text: "curl -X POST /api/orders", tone: "cmd" },
          { text: '201 Created  {"orderId":1043,"status":"PLACED","totalInPaise":699800}', tone: "ok" },
          { text: "curl -X POST /api/orders   # stock ran out", tone: "cmd" },
          { text: '409 Conflict  {"error":"Runner X has only 1 left"}', tone: "warn" },
        ],
      },
    ],
  },
  "booking-api": {
    frame: "terminal",
    title: "api-requests",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "curl '/api/providers/3/availability?date=2026-03-18'", tone: "cmd" },
          { text: '200 OK  {"slots":["10:00","10:30","11:30","14:00","14:30"]}', tone: "ok" },
          { text: "curl -X POST /api/bookings -d '{\"providerId\":3,\"startsAt\":\"2026-03-18T10:30\"}'", tone: "cmd" },
          { text: '201 Created  {"id":881,"status":"BOOKED"}  · confirmation email sent', tone: "ok" },
          { text: "curl -X POST /api/bookings -d '{… same slot …}'", tone: "cmd" },
          { text: '409 Conflict  {"error":"That slot was just booked"}', tone: "warn" },
        ],
      },
    ],
  },

  /* ---------------- Frontend ---------------- */
  "finance-dashboard": {
    frame: "browser",
    title: "Moneywise",
    url: "moneywise.vercel.app",
    nav: ["Overview", "Transactions", "Budgets"],
    blocks: [
      { kind: "kpis", items: [{ label: "Income", value: "₹42,000" }, { label: "Spent", value: "₹28,450" }, { label: "Saved", value: "₹13,550" }, { label: "Budget used", value: "71%" }] },
      { kind: "bars", title: "Spending by category · March", values: [9200, 6400, 4100, 3800, 2900, 2050], labels: ["Rent", "Food", "Travel", "Shop", "Bills", "Fun"] },
      { kind: "table", columns: ["Date", "Description", "Category", "Amount"], rows: [["14 Mar", "Swiggy", "Food", "−₹412"], ["13 Mar", "Metro card", "Travel", "−₹500"], ["12 Mar", "Salary", "Income", "+₹42,000"]] },
    ],
  },
  "movie-discovery": {
    frame: "browser",
    title: "Flickpick",
    url: "flickpick.vercel.app",
    blocks: [
      { kind: "search", placeholder: "Search movies…", chips: ["All genres", "Sci-fi", "Drama", "2020s", "Rating 7+"] },
      { kind: "posters", title: "Trending this week", items: ["Dune: Part Two", "Oppenheimer", "Jawan", "Inside Out 2", "Laapataa Ladies", "Interstellar"] },
    ],
  },
  "admin-panel": {
    frame: "browser",
    title: "Admin",
    url: "admin.acme.dev/users",
    nav: ["Users", "Orders", "Settings"],
    blocks: [
      { kind: "search", placeholder: "Search users", chips: ["All", "Active", "Suspended"] },
      {
        kind: "table",
        columns: ["Name", "Email", "Role", "Status"],
        rows: [["Ananya Rao", "ananya@acme.dev", "Admin", "Active"], ["Rahul Mehta", "rahul@acme.dev", "Support", "Active"], ["Sara Khan", "sara@acme.dev", "Customer", "Suspended"]],
      },
    ],
  },

  /* ---------------- App Development ---------------- */
  "habit-tracker": {
    frame: "phone",
    title: "Today",
    nav: ["Today", "Habits", "Settings"],
    blocks: [
      { kind: "stat", label: "Current best streak", value: "12 days", caption: "Read 20 min" },
      {
        kind: "list",
        items: [
          { title: "Read 20 min", meta: "12-day streak", done: true },
          { title: "Workout", meta: "4-day streak", done: true },
          { title: "Code 1 hour", meta: "Due today", done: false },
          { title: "Drink 2L water", meta: "Due today", done: false },
        ],
      },
    ],
  },
  "expense-manager": {
    frame: "phone",
    title: "March",
    nav: ["Home", "Reports", "Budget"],
    blocks: [
      { kind: "stat", label: "Spent this month", value: "₹8,240", caption: "82% of ₹10,000 budget" },
      {
        kind: "list",
        title: "Today",
        items: [
          { title: "Lunch", meta: "Food", right: "₹180" },
          { title: "Auto", meta: "Travel", right: "₹90" },
          { title: "Notebook", meta: "Study", right: "₹60" },
        ],
      },
    ],
  },
  "food-ordering": {
    frame: "phone",
    title: "Menu",
    nav: ["Menu", "Cart", "Orders"],
    blocks: [
      { kind: "search", placeholder: "Search dishes", chips: ["Biryani", "Starters", "Desserts"] },
      {
        kind: "cards",
        items: [
          { title: "Chicken Biryani", meta: "₹249 · Bestseller", badge: "Add" },
          { title: "Paneer Tikka", meta: "₹199", badge: "Add" },
          { title: "Gulab Jamun (2)", meta: "₹79", badge: "Add" },
        ],
      },
    ],
  },

  /* ---------------- AI & ML ---------------- */
  "resume-screener": {
    frame: "browser",
    title: "Resume screener",
    url: "resume-screener.streamlit.app",
    blocks: [
      { kind: "form", title: "Job description", fields: ["Paste the job description", "Upload resumes (PDF/text)"], button: "Rank resumes" },
      {
        kind: "table",
        columns: ["Rank", "Resume", "Score", "Matched skills"],
        rows: [["1", "resume_014.pdf", "87", "Python, SQL, pandas"], ["2", "resume_003.pdf", "79", "Python, ML, Git"], ["3", "resume_021.pdf", "64", "SQL, Excel"]],
      },
    ],
  },
  "document-qa": {
    frame: "browser",
    title: "Ask your documents",
    url: "doc-qa.streamlit.app",
    blocks: [
      {
        kind: "chat",
        messages: [
          { from: "user", text: "What is the notice period in this contract?" },
          { from: "bot", text: "The notice period is 60 days for either party. [contract.pdf · page 7]" },
          { from: "user", text: "Who is the CEO of the company?" },
          { from: "bot", text: "I don't know — that isn't in the uploaded documents." },
        ],
      },
    ],
  },
  "fake-news-classifier": {
    frame: "browser",
    title: "Headline checker",
    url: "headline-check.streamlit.app",
    blocks: [
      { kind: "form", title: "Check a headline", fields: ["Headline or article text"], button: "Check" },
      { kind: "stat", label: "Prediction", value: "Likely fake · 91%", caption: "Top words: “shocking”, “secret”, “they don't want you to know”" },
    ],
  },

  /* ---------------- Data Science ---------------- */
  "ipl-analysis": {
    frame: "browser",
    title: "IPL insights",
    url: "ipl-insights.streamlit.app",
    nav: ["Overview", "Teams", "Players"],
    blocks: [
      { kind: "kpis", items: [{ label: "Matches", value: "1,095" }, { label: "Toss winner wins", value: "51.2%" }, { label: "Chasing wins", value: "54.8%" }, { label: "Seasons", value: "2008–24" }] },
      { kind: "bars", title: "Win rate when chasing, by venue", values: [61, 58, 55, 52, 47], labels: ["Wankhede", "Chinnaswamy", "Eden", "Chepauk", "Kotla"] },
    ],
  },
  "sales-dashboard": {
    frame: "browser",
    title: "Sales insights",
    url: "sales-insights.streamlit.app",
    nav: ["Overview", "Regions", "Products"],
    blocks: [
      { kind: "kpis", items: [{ label: "Revenue", value: "₹2.3 Cr" }, { label: "Profit", value: "₹28.6 L" }, { label: "Orders", value: "9,994" }, { label: "Avg order", value: "₹2,296" }] },
      { kind: "bars", title: "Monthly revenue", values: [14, 11, 18, 16, 19, 21, 17, 22, 26, 24, 31, 35], labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] },
    ],
  },
  "real-estate-analysis": {
    frame: "browser",
    title: "Price explorer",
    url: "price-explorer.streamlit.app",
    nav: ["Localities", "Drivers", "Estimator"],
    blocks: [
      { kind: "bars", title: "Price per sq ft by locality (₹)", values: [14200, 11800, 9600, 7400, 6100], labels: ["Indiranagar", "Koramangala", "HSR", "Whitefield", "Electronic City"] },
      { kind: "stat", label: "Estimate · 2 BHK · 1,100 sq ft · HSR", value: "₹98 L – ₹1.12 Cr", caption: "Based on 214 comparable listings" },
    ],
  },

  /* ---------------- Python ---------------- */
  "expense-cli": {
    frame: "terminal",
    title: "terminal",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: 'python -m app.main add 250 food "lunch with team"', tone: "cmd" },
          { text: "✓ Saved expense #42 · ₹250 · food", tone: "ok" },
          { text: "python -m app.main report --month 2026-03", tone: "cmd" },
          { text: "March 2026 · total ₹8,240" },
          { text: "food     ₹3,410  ████████████░░░░" },
          { text: "travel   ₹2,150  ████████░░░░░░░░" },
          { text: "study    ₹1,280  █████░░░░░░░░░░░" },
          { text: "python -m app.main add -50 food", tone: "cmd" },
          { text: "✗ Amount must be positive", tone: "warn" },
        ],
      },
    ],
  },
  "web-scraper": {
    frame: "terminal",
    title: "terminal",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "python -m app.main track https://shop.example/headphones 2999", tone: "cmd" },
          { text: "✓ Tracking “Wireless Headphones” · target ₹2,999", tone: "ok" },
          { text: "python -m app.main check", tone: "cmd" },
          { text: "Wireless Headphones   ₹3,499 → ₹2,849   ↓ below target", tone: "ok" },
          { text: "Laptop Stand          ₹1,299 (no change)" },
          { text: "Mechanical Keyboard   timeout — will retry next run", tone: "warn" },
          { text: "✓ Alert sent to Telegram", tone: "ok" },
        ],
      },
    ],
  },
  "automation-toolkit": {
    frame: "terminal",
    title: "terminal",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "python -m app.main organize ~/Downloads --dry-run", tone: "cmd" },
          { text: "Would move 38 files:" },
          { text: "  IMG_2041.jpg      → Images/" },
          { text: "  resume_final.pdf  → Documents/" },
          { text: "  script.py         → Code/" },
          { text: "python -m app.main organize ~/Downloads", tone: "cmd" },
          { text: "✓ Moved 38 files · undo log saved", tone: "ok" },
          { text: "python -m app.main dupes ~/Downloads", tone: "cmd" },
          { text: "Found 4 duplicates (212 MB)", tone: "warn" },
        ],
      },
    ],
  },

  /* ---------------- Java ---------------- */
  "library-api": {
    frame: "terminal",
    title: "api-requests",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "curl '/api/books?q=clean+code'", tone: "cmd" },
          { text: '200 OK  [{"isbn":"9780132350884","title":"Clean Code","availableCopies":2}]', tone: "ok" },
          { text: "curl -X POST /api/loans -d '{\"memberId\":5,\"bookId\":12}'", tone: "cmd" },
          { text: '201 Created  {"loanId":301,"dueOn":"2026-04-01"}', tone: "ok" },
          { text: "curl -X POST /api/loans/287/return", tone: "cmd" },
          { text: '200 OK  {"daysLate":3,"fine":30}', tone: "ok" },
          { text: "curl -X POST /api/loans -d '{\"memberId\":5,…}'   # 4th book", tone: "cmd" },
          { text: '409 Conflict  {"error":"Member already has 3 books"}', tone: "warn" },
        ],
      },
    ],
  },
  "banking-api": {
    frame: "terminal",
    title: "api-requests",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "curl -X POST /api/transfers -d '{\"from\":\"AC1001\",\"to\":\"AC1002\",\"amount\":2500.00}'", tone: "cmd" },
          { text: '201 Created  {"reference":"TX-88412","status":"COMPLETED"}', tone: "ok" },
          { text: "curl /api/accounts/1/statement?from=2026-03-01", tone: "cmd" },
          { text: '200 OK  {"opening":10000.00,"closing":7500.00,"transactions":[…]}', tone: "ok" },
          { text: "curl -X POST /api/accounts/1/withdraw -d '{\"amount\":99999}'", tone: "cmd" },
          { text: '422 Unprocessable  {"error":"Insufficient funds"}  · balance unchanged', tone: "warn" },
        ],
      },
    ],
  },
  "inventory-system": {
    frame: "terminal",
    title: "api-requests",
    blocks: [
      {
        kind: "terminal",
        lines: [
          { text: "curl -X POST /api/stock-movements -d '{\"sku\":\"MLK-1L\",\"type\":\"IN\",\"quantity\":40}'", tone: "cmd" },
          { text: '201 Created  {"sku":"MLK-1L","currentStock":46}', tone: "ok" },
          { text: "curl /api/reports/low-stock", tone: "cmd" },
          { text: '200 OK  [{"sku":"BRD-WHT","stock":3,"reorderLevel":10,"supplier":"Fresh Bakes"}]', tone: "ok" },
          { text: "curl -X POST /api/stock-movements -d '{\"sku\":\"BRD-WHT\",\"type\":\"OUT\",\"quantity\":5}'", tone: "cmd" },
          { text: '409 Conflict  {"error":"Only 3 in stock"}', tone: "warn" },
        ],
      },
    ],
  },
}
