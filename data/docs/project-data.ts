import type { Step } from "@/data/docs/types"

/*
 * How each project gets realistic data from day one: a seed script, a
 * public dataset, or a mock API. Keyed by project slug.
 */

const prismaSeedSetup = (example: string): Step[] => [
  { text: "A seed script fills your database with realistic test data, so you never start with an empty app. Create it next to your schema:", file: "prisma/seed.ts", code: example },
  { text: "Tell Prisma how to run it — add this to package.json (top level):", file: "package.json", code: '"prisma": {\n  "seed": "tsx prisma/seed.ts"\n}' },
  { text: "Run it any time you want fresh data:", code: "npx prisma db seed" },
  { text: "Seed scripts should be safe to re-run: delete old rows first (as above) so you don't get duplicates." },
]

const kaggle = (search: string, files: string, load: string): Step[] => [
  { text: `Go to kaggle.com (free account), search for “${search}”, open a well-rated dataset and click Download.` },
  { text: `Unzip it into data/raw/. You should see ${files}.` },
  { text: "Write down the dataset's name and link in your README — always credit your source." },
  { text: "Load it in your first notebook cell:", file: "notebooks/01-cleaning.ipynb", code: load },
]

const javaSeed = (inserts: string): Step[] => [
  { text: "Spring Boot runs src/main/resources/data.sql on start-up. Put sample rows there:", file: "src/main/resources/data.sql", code: inserts },
  { text: "Let it run after Hibernate creates the tables — add to application.properties:", file: "src/main/resources/application.properties", code: "spring.sql.init.mode=always\nspring.jpa.defer-datasource-initialization=true" },
  { text: "Running it again would insert duplicates — once you have data you like, set spring.sql.init.mode=never." },
]

export const sampleData: Record<string, Step[]> = {
  /* ---------------- Full-Stack ---------------- */
  "job-tracker": prismaSeedSetup(
    'import { PrismaClient } from "@prisma/client"\nimport bcrypt from "bcrypt"\n\nconst prisma = new PrismaClient()\n\nasync function main() {\n  await prisma.application.deleteMany()\n  await prisma.user.deleteMany()\n\n  const user = await prisma.user.create({\n    data: { name: "Demo User", email: "demo@example.com", passwordHash: await bcrypt.hash("password123", 10) },\n  })\n\n  await prisma.application.createMany({\n    data: [\n      { userId: user.id, company: "Razorpay", role: "SDE Intern", stage: "APPLIED" },\n      { userId: user.id, company: "Swiggy", role: "SDE Intern", stage: "INTERVIEW" },\n      { userId: user.id, company: "Freshworks", role: "Intern", stage: "OFFER" },\n      { userId: user.id, company: "Flipkart", role: "SDE", stage: "REJECTED" },\n    ],\n  })\n}\n\nmain().finally(() => prisma.$disconnect())'
  ),
  "event-booking": prismaSeedSetup(
    'import { PrismaClient } from "@prisma/client"\nimport bcrypt from "bcrypt"\n\nconst prisma = new PrismaClient()\n\nasync function main() {\n  await prisma.booking.deleteMany()\n  await prisma.event.deleteMany()\n  await prisma.user.deleteMany()\n\n  const passwordHash = await bcrypt.hash("password123", 10)\n  const organiser = await prisma.user.create({ data: { name: "Asha", email: "organiser@example.com", passwordHash, role: "ORGANISER" } })\n  await prisma.user.create({ data: { name: "Ravi", email: "attendee@example.com", passwordHash, role: "ATTENDEE" } })\n\n  await prisma.event.createMany({\n    data: [\n      { organiserId: organiser.id, title: "React Meetup", venue: "Koramangala", startsAt: new Date("2026-06-14T17:00"), totalSeats: 30, description: "Talks and pizza" },\n      { organiserId: organiser.id, title: "Open Mic Night", venue: "Indiranagar", startsAt: new Date("2026-06-20T19:00"), totalSeats: 2, description: "Test the full-event case with this one" },\n    ],\n  })\n}\n\nmain().finally(() => prisma.$disconnect())'
  ),
  "task-manager": prismaSeedSetup(
    'import { PrismaClient } from "@prisma/client"\nimport bcrypt from "bcrypt"\n\nconst prisma = new PrismaClient()\n\nasync function main() {\n  await prisma.task.deleteMany()\n  await prisma.board.deleteMany()\n  await prisma.membership.deleteMany()\n  await prisma.team.deleteMany()\n  await prisma.user.deleteMany()\n\n  const passwordHash = await bcrypt.hash("password123", 10)\n  const admin = await prisma.user.create({ data: { name: "Priya", email: "admin@example.com", passwordHash } })\n  const member = await prisma.user.create({ data: { name: "Arjun", email: "member@example.com", passwordHash } })\n  const team = await prisma.team.create({ data: { name: "Design team" } })\n  await prisma.membership.createMany({ data: [\n    { userId: admin.id, teamId: team.id, role: "ADMIN" },\n    { userId: member.id, teamId: team.id, role: "MEMBER" },\n  ] })\n  const board = await prisma.board.create({ data: { teamId: team.id, name: "Website" } })\n  await prisma.task.createMany({ data: [\n    { boardId: board.id, title: "Hero copy", status: "TODO", priority: "HIGH", assigneeId: member.id },\n    { boardId: board.id, title: "Navbar redesign", status: "IN_PROGRESS", priority: "MEDIUM", assigneeId: admin.id },\n  ] })\n}\n\nmain().finally(() => prisma.$disconnect())'
  ),

  /* ---------------- Backend ---------------- */
  "url-shortener": prismaSeedSetup(
    'import { PrismaClient } from "@prisma/client"\n\nconst prisma = new PrismaClient()\n\nasync function main() {\n  await prisma.click.deleteMany()\n  await prisma.link.deleteMany()\n  await prisma.user.deleteMany()\n\n  const user = await prisma.user.create({ data: { email: "demo@example.com", passwordHash: "seeded" } })\n  const link = await prisma.link.create({ data: { userId: user.id, code: "demo1", targetUrl: "https://example.com" } })\n\n  // 200 fake clicks over the last 14 days, so the stats endpoint has something to show\n  const referrers = ["twitter.com", "linkedin.com", "google.com", null]\n  await prisma.click.createMany({\n    data: Array.from({ length: 200 }, (_, i) => ({\n      linkId: link.id,\n      at: new Date(Date.now() - (i % 14) * 86400000),\n      referrer: referrers[i % referrers.length],\n      device: i % 3 === 0 ? "mobile" : "desktop",\n    })),\n  })\n}\n\nmain().finally(() => prisma.$disconnect())'
  ),
  "ecommerce-backend": prismaSeedSetup(
    'import { PrismaClient } from "@prisma/client"\n\nconst prisma = new PrismaClient()\n\nasync function main() {\n  await prisma.orderItem.deleteMany()\n  await prisma.order.deleteMany()\n  await prisma.cartItem.deleteMany()\n  await prisma.product.deleteMany()\n\n  await prisma.product.createMany({\n    data: [\n      { name: "Runner X", category: "shoes", priceInPaise: 349900, stock: 12 },\n      { name: "Trail Pro", category: "shoes", priceInPaise: 499900, stock: 1 },\n      { name: "Cotton Tee", category: "clothing", priceInPaise: 59900, stock: 40 },\n      { name: "Water Bottle", category: "accessories", priceInPaise: 29900, stock: 0 },\n    ],\n  })\n}\n\nmain().finally(() => prisma.$disconnect())'
  ),
  "booking-api": prismaSeedSetup(
    'import { PrismaClient } from "@prisma/client"\n\nconst prisma = new PrismaClient()\n\nasync function main() {\n  await prisma.booking.deleteMany()\n  await prisma.workingHours.deleteMany()\n  await prisma.provider.deleteMany()\n\n  const provider = await prisma.provider.create({ data: { name: "Glow Salon", slotMinutes: 30 } })\n  // Monday (1) to Saturday (6), 10:00–18:00\n  await prisma.workingHours.createMany({\n    data: [1, 2, 3, 4, 5, 6].map((weekday) => ({ providerId: provider.id, weekday, startTime: "10:00", endTime: "18:00" })),\n  })\n}\n\nmain().finally(() => prisma.$disconnect())'
  ),

  /* ---------------- Frontend ---------------- */
  "finance-dashboard": [
    { text: "Instead of downloading a dataset, generate a realistic year of transactions with a small script. Create it in your project:", file: "scripts/generate-transactions.mjs", code: 'import { writeFileSync } from "node:fs"\n\nconst categories = [\n  ["Rent", 9000, 1], ["Food", 180, 25], ["Travel", 90, 18],\n  ["Shopping", 900, 3], ["Bills", 700, 3], ["Fun", 400, 4],\n]\nconst transactions = []\nlet id = 1\n\nfor (let month = 0; month < 12; month++) {\n  transactions.push({ id: id++, date: new Date(2025, month, 1).toISOString().slice(0, 10), description: "Salary", category: "Income", amount: 42000, account: "Bank" })\n  for (const [category, avg, perMonth] of categories) {\n    for (let i = 0; i < perMonth; i++) {\n      const day = 1 + Math.floor(Math.random() * 27)\n      const amount = Math.round(avg * (0.6 + Math.random() * 0.8))\n      transactions.push({ id: id++, date: new Date(2025, month, day).toISOString().slice(0, 10), description: category + " expense", category, amount: -amount, account: "UPI" })\n    }\n  }\n}\n\nwriteFileSync("public/transactions.json", JSON.stringify(transactions, null, 2))\nconsole.log("Wrote " + transactions.length + " transactions")' },
    { text: "Run it once. It creates public/transactions.json:", code: "node scripts/generate-transactions.mjs" },
    { text: "Your app can now fetch /transactions.json. Commit the generated file so your mentor sees the same data." },
    { text: "Budgets can live in a small hard-coded object to start: { Food: 5000, Travel: 2000, … }." },
  ],
  "movie-discovery": [
    { text: "Create a free account at themoviedb.org, then go to Settings → API and request a developer key." },
    { text: "Put it in .env.local as TMDB_API_KEY (see Environment & secrets)." },
    { text: "Check it works — this should return JSON with a results list:", code: "curl \"https://api.themoviedb.org/3/trending/movie/week?api_key=YOUR_KEY\"" },
    { text: "TMDB's terms require crediting them — add “This product uses the TMDB API but is not endorsed or certified by TMDB” and their logo to your footer." },
  ],
  "admin-panel": [
    { text: "Use json-server: it turns a JSON file into a fake REST API in one command. Create the data file:", file: "mock/db.json", code: '{\n  "users": [\n    { "id": "1", "name": "Ananya Rao", "email": "ananya@acme.dev", "role": "admin", "status": "active", "createdAt": "2026-01-04" },\n    { "id": "2", "name": "Rahul Mehta", "email": "rahul@acme.dev", "role": "support", "status": "active", "createdAt": "2026-02-11" },\n    { "id": "3", "name": "Sara Khan", "email": "sara@acme.dev", "role": "customer", "status": "suspended", "createdAt": "2026-03-02" }\n  ],\n  "orders": [\n    { "id": "1001", "customerName": "Sara Khan", "total": 2499, "status": "paid", "items": ["Runner X"], "createdAt": "2026-03-10" },\n    { "id": "1002", "customerName": "Vikram Das", "total": 899, "status": "pending", "items": ["Cotton Tee"], "createdAt": "2026-03-12" }\n  ]\n}' },
    { text: "Start the mock API in a second terminal. It gives you GET/POST/PATCH/DELETE on /users and /orders:", code: "npx json-server mock/db.json --port 4000" },
    { text: "Open http://localhost:4000/users in your browser to check. Add 20–30 more rows (ask an AI tool to generate them) so pagination has something to page through." },
  ],

  /* ---------------- App Development ---------------- */
  "habit-tracker": [
    { text: "On first launch, if nothing is stored yet, save a few example habits so the screens aren't empty:", file: "lib/storage.ts", code: 'const starterHabits = [\n  { id: "1", name: "Read 20 min", icon: "book", colour: "#3b82f6", targetPerWeek: 7 },\n  { id: "2", name: "Workout", icon: "dumbbell", colour: "#22c55e", targetPerWeek: 4 },\n]\n\nexport async function loadHabits() {\n  const json = await AsyncStorage.getItem("habits")\n  if (json) return JSON.parse(json)\n  await AsyncStorage.setItem("habits", JSON.stringify(starterHabits))\n  return starterHabits\n}' },
    { text: "Add a “Reset demo data” button in Settings while developing — it saves you reinstalling the app." },
  ],
  "expense-manager": [
    { text: "Seed a month of expenses on first launch while developing, so charts have data:", file: "lib/storage.ts", code: 'const starter = Array.from({ length: 30 }, (_, i) => ({\n  id: String(i + 1),\n  amount: Math.round(50 + Math.random() * 400),\n  category: ["Food", "Travel", "Study", "Fun"][i % 4],\n  note: "",\n  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),\n}))' },
    { text: "Remove (or hide behind a dev-only flag) before you build your final APK." },
  ],
  "food-ordering": [
    { text: "The restaurant API is a mock you run yourself with json-server. Create the data file:", file: "mock/db.json", code: '{\n  "menu": [\n    { "id": "1", "name": "Chicken Biryani", "category": "Biryani", "price": 249, "imageUrl": "", "addOns": ["Extra raita", "Boiled egg"] },\n    { "id": "2", "name": "Paneer Tikka", "category": "Starters", "price": 199, "imageUrl": "", "addOns": [] },\n    { "id": "3", "name": "Gulab Jamun (2)", "category": "Desserts", "price": 79, "imageUrl": "", "addOns": [] }\n  ],\n  "orders": []\n}' },
    { text: "Start it so your phone can reach it (--host 0.0.0.0 makes it visible on your Wi-Fi):", code: "npx json-server mock/db.json --port 4000 --host 0.0.0.0" },
    { text: "Set EXPO_PUBLIC_API_URL to http://YOUR-WIFI-IP:4000 (see Environment & secrets)." },
    { text: "To simulate the order moving through statuses, update it by hand while the app polls:", code: "curl -X PATCH http://localhost:4000/orders/1 -H \"Content-Type: application/json\" -d '{\"status\":\"preparing\"}'" },
  ],

  /* ---------------- AI & ML ---------------- */
  "resume-screener": kaggle("Resume Dataset", "a CSV with resume text and a category column", 'import pandas as pd\n\ndf = pd.read_csv("../data/raw/Resume.csv")\ndf.head()'),
  "document-qa": [
    { text: "Pick 2–3 public PDFs you're allowed to use: an open textbook chapter, a government policy document, or a company's public annual report. Avoid anything private or copyrighted that you can't share." },
    { text: "Put them in data/raw/." },
    { text: "Write 15–20 evaluation questions with the expected answer and page number before you build anything — save them as data/eval.csv with columns question, expected_answer, page." },
    { text: "Extract text to check the PDFs are readable:", code: "pip install pypdf" },
  ],
  "fake-news-classifier": kaggle("Fake and real news dataset", "two CSVs — one of fake articles and one of real articles", 'import pandas as pd\n\nfake = pd.read_csv("../data/raw/Fake.csv").assign(label="fake")\nreal = pd.read_csv("../data/raw/True.csv").assign(label="real")\ndf = pd.concat([fake, real], ignore_index=True)\ndf["label"].value_counts()'),

  /* ---------------- Data Science ---------------- */
  "ipl-analysis": kaggle("IPL Complete Dataset 2008", "matches.csv and deliveries.csv", 'import pandas as pd\n\nmatches = pd.read_csv("../data/raw/matches.csv")\ndeliveries = pd.read_csv("../data/raw/deliveries.csv")\nprint(matches.shape, deliveries.shape)'),
  "sales-dashboard": kaggle("Superstore Sales", "one CSV of orders with region, category, sales and profit", 'import pandas as pd\n\ndf = pd.read_csv("../data/raw/Superstore.csv", encoding="latin-1", parse_dates=["Order Date"])\ndf.info()'),
  "real-estate-analysis": kaggle("Bengaluru House Price Data", "a CSV with location, size, total_sqft, bath and price", 'import pandas as pd\n\ndf = pd.read_csv("../data/raw/Bengaluru_House_Data.csv")\ndf.describe()'),

  /* ---------------- Python ---------------- */
  "expense-cli": [
    { text: "Create a sample CSV to test your import command with:", file: "data/sample-expenses.csv", code: "amount,category,note,spent_on\n250,food,lunch with team,2026-03-01\n90,travel,auto,2026-03-01\n1200,study,course book,2026-03-03\n180,food,dinner,2026-03-04\n500,fun,movie,2026-03-08" },
    { text: "Import it once your import command works:", code: "python -m app.main import data/sample-expenses.csv" },
  ],
  "web-scraper": [
    { text: "Practise on a site built for scraping first: books.toscrape.com has prices on every page and explicitly allows scraping." },
    { text: "Save a copy of a product page for your parser tests, so tests never hit the internet:", code: "curl -o tests/fixtures/book.html https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html" },
    { text: "Install the HTML parser:", code: "pip install beautifulsoup4" },
  ],
  "automation-toolkit": [
    { text: "Never test on your real folders. Create a messy practice folder with a script:", file: "scripts/make_sandbox.py", code: 'from pathlib import Path\n\nsandbox = Path("sandbox")\nsandbox.mkdir(exist_ok=True)\nnames = ["IMG_2041.jpg", "resume_final.pdf", "notes.txt", "script.py", "song.mp3", "IMG_2041 (1).jpg"]\nfor name in names:\n    (sandbox / name).write_text("demo " + name)\nprint("Created", len(names), "files in", sandbox)' },
    { text: "Run it, then point your tool at sandbox/:", code: "python scripts/make_sandbox.py" },
  ],

  /* ---------------- Java ---------------- */
  "library-api": javaSeed("INSERT INTO book (isbn, title, author, total_copies, available_copies) VALUES\n('9780132350884', 'Clean Code', 'Robert C. Martin', 3, 2),\n('9780134685991', 'Effective Java', 'Joshua Bloch', 2, 2),\n('9781617294945', 'Spring in Action', 'Craig Walls', 1, 0);\n\nINSERT INTO member (name, email, max_loans) VALUES\n('Asha', 'asha@example.com', 3),\n('Ravi', 'ravi@example.com', 3);"),
  "banking-api": javaSeed("INSERT INTO account (account_number, owner_name, balance, created_at) VALUES\n('AC1001', 'Asha', 10000.00, NOW()),\n('AC1002', 'Ravi', 2500.00, NOW());"),
  "inventory-system": javaSeed("INSERT INTO supplier (name, phone, email) VALUES\n('Fresh Bakes', '9876500001', 'orders@freshbakes.example'),\n('Daily Dairy', '9876500002', 'hello@dailydairy.example');\n\nINSERT INTO product (sku, name, category, supplier_id, reorder_level) VALUES\n('BRD-WHT', 'White Bread', 'Bakery', 1, 10),\n('MLK-1L', 'Milk 1L', 'Dairy', 2, 20);"),

  /* ---------------- UI/UX ---------------- */
  "app-redesign": [
    { text: "Your “data” is research. Take screenshots of every step of the flows you'll redesign and paste them into the Research page." },
    { text: "Recruit 3–5 interviewees who use the app weekly. Ask friends of friends — not your closest friends, who'll be too kind." },
  ],
  "campus-app": [
    { text: "Start with a short Google Form to 15–20 students: “What's the most annoying thing about everyday campus life?” Then interview 5 of them in depth." },
    { text: "Paste anonymised responses into FigJam and cluster them (affinity map) to choose your problem." },
  ],
  "fintech-onboarding": [
    { text: "Sign up to 3 real fintech apps and screenshot every onboarding screen — that's your teardown material. Blur any personal details." },
    { text: "Use realistic but fake details in your designs (e.g. PAN ABCDE1234F) — never real ID numbers." },
  ],
}
