import { authDebug, authRequests, authUnderstand, finalReviewTask, mergedLine, planTask, readmeTask, requestsFile } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * Backend: three APIs, week by week, built on the my-api repo from Setup
 * (Express + TypeScript, Prisma + PostgreSQL, Redis in Docker). There's no
 * frontend, so the "screens" are the API seen from outside: Swagger and
 * real requests.
 */

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

function contractTask(models: string, endpoints: string): BuildTask {
  return {
    id: "contract",
    title: "Schema and API contract",
    why: "Before any endpoint exists, write down exactly what the database holds and what every endpoint takes and returns. Swagger then turns that contract into a page anyone can read and try.",
    branch: "feat/contract",
    prompt: `Two things, one at a time. First, write the Prisma models in prisma/schema.prisma for: ${models}. Then write docs/openapi.yaml (OpenAPI 3) for these endpoints: ${endpoints}. Include request bodies, success responses with status codes, and errors using the format in my docs/plan.md. Then serve it at /docs with swagger-ui-express and the yaml package, from src/app.ts.`,
    steps: [
      { text: "Install Swagger UI and a YAML reader:", code: "npm install swagger-ui-express yaml\nnpm install -D @types/swagger-ui-express" },
      { text: "After the models are in schema.prisma, create the tables:", code: "npx prisma migrate dev --name init-models" },
    ],
    understand: [
      "Which fields are unique, and what would go wrong without that rule?",
      "Pick one endpoint: what does it return when the input is invalid? When it's not allowed? When the thing doesn't exist?",
      "Why write the contract before the code, not after?",
    ],
    check: [
      { text: "Start the API (npm run dev) and open http://localhost:4000/docs — every endpoint is listed, with its request and responses." },
      { text: "Open Prisma Studio (npx prisma studio): every table exists, empty." },
    ],
    debug: ["/docs is blank: the path to docs/openapi.yaml is relative to where you started the server. Read it with path.join(process.cwd(), \"docs/openapi.yaml\")."],
    commit: "Add schema and OpenAPI contract",
  }
}

const bcryptStep = { text: "Install bcrypt, which hashes passwords:", code: "npm install bcrypt\nnpm install -D @types/bcrypt" }

const testsSetup = [
  { text: "Install the test tools:", code: "npm install -D vitest supertest @types/supertest\nnpm pkg set scripts.test=\"vitest run\"" },
  { text: "Copy .env to .env.test and change the database name at the end of DATABASE_URL to devvy_api_test. Then add .env.test to .gitignore on its own line." },
]

function testsTask(cases: string): BuildTask {
  return {
    id: "tests",
    title: "Integration tests",
    why: "Tests call your real API against a real (test) database — they catch the rules you'll break by accident later.",
    branch: "test/api",
    prompt: `Set up Vitest and Supertest. Tests must use the database in .env.test: a Vitest global setup loads it and runs prisma migrate reset --force before the tests. Export the Express app from src/app.ts without starting it. Write tests for: ${cases}`,
    steps: testsSetup,
    understand: [
      "Why do tests use their own database?",
      "Pick your most important test. Break the rule it checks on purpose — does it fail? Put it back.",
      "What's the difference between this and checking by hand with REST Client?",
    ],
    check: [{ text: "Run the tests:", code: "npm test", expect: "every test passes" }],
    debug: ["“database devvy_api_test does not exist”: migrate reset creates it — check the user and password in .env.test match .env."],
    commit: "Add integration tests",
  }
}

function cacheTask(what: string, invalidate: string): BuildTask {
  return {
    id: "cache",
    title: "Cache with Redis",
    why: "The database is the slow part. Redis keeps hot answers in memory, so repeat requests skip the database entirely.",
    branch: "feat/cache",
    prompt: `Using ioredis and REDIS_URL, cache ${what}. Use a clear key format and a TTL. ${invalidate} Log “cache hit” or “cache miss” for each request so I can see it working. Put the Redis client in src/lib/redis.ts.`,
    steps: [{ text: "Make sure Redis is running (Docker Desktop open, then):", code: "docker start redis" }],
    understand: [
      "What's your key format, and why that shape?",
      "What happens if the data changes and you forget to clear the cache?",
      "Why a TTL, even though you clear the cache on changes?",
    ],
    check: [
      { text: "Send the same request twice: the server logs “cache miss”, then “cache hit”." },
      { text: "Change the underlying data, then send it again — you get the new data, not the cached copy." },
    ],
    debug: ["“connect ECONNREFUSED 127.0.0.1:6379”: Redis isn't running. Open Docker Desktop and run docker start redis."],
    commit: "Cache with Redis",
  }
}

function protectTask(limited: string): BuildTask {
  return {
    id: "rate-limit-logs",
    title: "Rate limiting, logging and health",
    why: "A public API gets hammered. Rate limits stop abuse, logs tell you what happened, and a health check tells your host you're alive.",
    branch: "feat/rate-limit",
    prompt: `Add express-rate-limit with rate-limit-redis on ${limited}, returning 429 with the error format from docs/plan.md and a Retry-After header. Add pino-http for one structured log line per request (method, path, status, time taken). Make GET /health also check the database and Redis, returning 503 if either is down.`,
    steps: [{ text: "Install them:", code: "npm install express-rate-limit rate-limit-redis pino-http" }],
    understand: [
      "Why store the rate-limit counters in Redis instead of in memory?",
      "Read one log line out loud: what does each field tell you?",
      "Why should /health return 503 when the database is down, instead of 200?",
    ],
    check: [
      { text: `Send ${limited.split(" ")[0]} requests quickly until you pass the limit.`, expect: "429, with a Retry-After header" },
      { text: "Stop Redis (docker stop redis) and open /health.", expect: "503. Start Redis again afterwards." },
    ],
    commit: "Add rate limiting, logging and health check",
  }
}

function loadTestTask(endpoint: string): BuildTask {
  return {
    id: "load-test",
    title: "Load test and fix the bottleneck",
    why: "“It's fast” isn't a number. A load test gives you one — before and after a fix — and that pair of numbers goes in your README.",
    branch: "perf/load-test",
    prompt: `I'm load-testing ${endpoint} with autocannon. Explain what requests per second, latency p50 and p99 mean. Then look at my code for that endpoint and list what could make it slow (missing index, extra queries, no cache), most likely first. Don't change anything yet.`,
    steps: [
      { text: "With the API running, measure it for 10 seconds with 50 connections:", code: `npx autocannon -c 50 -d 10 http://localhost:4000${endpoint}` },
      { text: "Write the numbers in docs/performance.md. Fix the most likely cause (one change), run it again, and write the new numbers under the old ones." },
    ],
    understand: ["What's the difference between p50 and p99, and which one do users notice?", "What exactly did your fix change, and why did it help?"],
    check: [{ text: "docs/performance.md has before and after numbers, and one line on what you changed." }],
    debug: ["The numbers jump around between runs: close other apps, and run each test twice, keeping the second result."],
    commit: "Add load test results",
  }
}

const deployTask: BuildTask = {
  id: "deploy",
  title: "Dockerise and deploy",
  why: "Docker packages your API so it runs the same on your laptop and on the server. Then it goes live with a hosted database and Redis.",
  branch: "chore/deploy",
  prompt:
    "Write a Dockerfile for this Express + TypeScript + Prisma API: a build stage that compiles TypeScript and generates the Prisma client, and a small run stage that starts dist/index.js. Add a .dockerignore. Explain each line. The container must run prisma migrate deploy before starting.",
  steps: [
    { text: "Build and run it on your laptop first:", code: "docker build -t my-api .\ndocker run --env-file .env -p 4000:4000 my-api" },
    { text: "Then follow Building → Deployment to deploy the container with a hosted PostgreSQL and Redis. Set every variable from .env.example in the host's settings — with new secrets." },
  ],
  understand: ["Why two stages in the Dockerfile?", "What's in .dockerignore, and why must .env be in it?", "Where do the live database and Redis addresses come from?"],
  check: [
    { text: "Open https://YOUR-API/health on the live URL.", expect: '{"ok":true} (or your health response)' },
    { text: "Open https://YOUR-API/docs — Swagger loads, and Try it out works against the live API." },
  ],
  debug: ["The container can't reach the database on your laptop: inside Docker, localhost is the container. Use host.docker.internal instead of localhost in the URL you pass."],
  commit: "Add Dockerfile",
}

function shipWeek(name: string, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it: package the API with Docker, deploy it, publish the docs, and get ready for the final review.",
    tasks: [
      deployTask,
      readmeTask({ name, sections: "live URL and Swagger link, tech stack, how to run it locally (with Docker for Redis), environment variables (names only), your load-test numbers before and after", demo: "walk through the main flow in Swagger", check: "The live URL, the /docs link and the demo video all open." }),
      finalReviewTask(doneWhen, "your live API"),
    ],
    done: ["The API is live with Swagger docs", "The README has your performance numbers", "The demo video is linked from the README", "Your mentor has the links for the final review"],
  }
}

/* ------------------------------------------------------------------ */
/* URL shortener                                                       */
/* ------------------------------------------------------------------ */

const shortenerDone = ["Redirects are served from Redis after the first hit.", "Creating more links than the limit returns 429.", "Stats match the clicks you made.", "Swagger documents every endpoint and the API is deployed."]

const urlShortener: ProjectBuild = [
  {
    intro: "You've read Start here. Now plan it in your own words, then write the schema and the API contract your mentor signs off.",
    tasks: [
      planTask({
        parts: ["Errors — one JSON shape for every error, and the status code for: invalid URL, alias taken, not logged in, not yours, not found, too many requests.", "Codes — how you'll generate a short code, how long it is, and what happens if two links get the same one."],
        questions: ["Why is the redirect the most important endpoint to make fast?", "Postgres or MongoDB for this project — which did you pick, and why?"],
      }),
      contractTask("User, Link (code unique) and Click, matching my brief", "every endpoint in my brief"),
    ],
    done: ["docs/plan.md in your own words", "The schema is migrated", "Swagger at /docs shows every endpoint", "Your mentor has approved the plan and contract PRs"],
  },
  {
    intro: "Build the core API: accounts, creating links, the redirect, and tests for all of it.",
    tasks: [
      {
        id: "auth",
        title: "Accounts for creators",
        why: "Only creators can make and manage links. Visitors following a short link never log in.",
        branch: "feat/auth",
        prompt: 'Add POST /api/auth/signup and POST /api/auth/login (zod validation, bcrypt, return { "token": "..." } with a 7-day JWT signed with JWT_SECRET), and requireAuth middleware that reads "Authorization: Bearer <token>". Errors use the format in docs/plan.md. Routes in src/routes/auth.ts, middleware in src/middleware/auth.ts.',
        steps: [bcryptStep, ...requestsFile("requests.http", "http://localhost:4000", authRequests())],
        understand: authUnderstand,
        check: [{ text: "Send Sign up, Log in, then Wrong password.", expect: "201, 200 with a token, 401" }],
        debug: authDebug,
        commit: "Add creator accounts",
      },
      {
        id: "links",
        title: "Create links and redirect",
        why: "The heart of the project: a long URL in, a short code out — and a redirect that records every click.",
        branch: "feat/links",
        prompt:
          "Add POST /api/links (requireAuth; zod checks the URL is http or https; optional customAlias of 3–30 letters, digits or dashes; otherwise a random 7-character code; 409 if the alias is taken), GET /api/links?page= (my links, 20 per page), DELETE /api/links/:id (only mine), and GET /:code which redirects with 302 and records a Click (time, Referer header, country from the CF-IPCountry header if present, device from the User-Agent). Recording the click must not delay the redirect.",
        understand: [
          "How does your code make sure a random code isn't already taken?",
          "Why 302 and not 301 for the redirect?",
          "How do you record the click without making the visitor wait?",
        ],
        check: [
          { text: "Create a link, then open http://localhost:4000/YOUR-CODE in the browser — you land on the long URL." },
          { text: "Create a link with an alias that's taken.", expect: "409" },
          { text: "Open Prisma Studio — each visit added a Click row." },
        ],
        debug: ["Every code redirects to the same place, or GET /api/links redirects: GET /:code must be registered after your /api routes, or it catches them."],
        commit: "Add links and redirect",
      },
      testsTask("signup and login; creating a link; a taken alias returns 409; GET /:code returns 302 with the right Location header and adds a Click; deleting someone else's link returns 404."),
    ],
    done: ["Creators can sign up, log in and manage links", "Short links redirect and record clicks", "npm test passes", mergedLine],
  },
  {
    intro: "Make it production-ready: Redis for redirects, rate limits, click analytics, and real performance numbers.",
    tasks: [
      cacheTask("code → URL lookups for GET /:code", "When a link is deleted, delete its key."),
      {
        id: "stats",
        title: "Click analytics",
        why: "Creators want to know how their links perform. This is where the clicks you've been recording pay off.",
        branch: "feat/stats",
        prompt: "Add GET /api/links/:id/stats?from=&to= (only the link's owner): total clicks, clicks per day, top 5 referrers and clicks by device, using database grouping — not by loading every click into memory.",
        understand: ["Why group in the database instead of in JavaScript?", "What index makes this query fast, and why?"],
        check: [{ text: "Visit one of your links 5 times, then call its stats.", expect: "5 clicks, on today's date" }],
        commit: "Add click analytics",
      },
      protectTask("10 POST /api/links per minute per user"),
      loadTestTask("/YOUR-CODE"),
    ],
    done: ["Redirects come from Redis after the first hit", "Stats match the clicks you made", "Link creation is rate-limited (429)", "docs/performance.md has before and after numbers", mergedLine],
  },
  shipWeek("URL shortener", shortenerDone),
]

/* ------------------------------------------------------------------ */
/* E-commerce backend                                                  */
/* ------------------------------------------------------------------ */

const shopDone = ["Stock never goes below zero, even with two simultaneous checkouts.", "Order totals are calculated on the server, never trusted from the client.", "Only admins can change products or order status.", "Deployed with Swagger docs."]

const ecommerce: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially money and stock — then write the schema and API contract.",
    tasks: [
      planTask({
        parts: ["Errors — one JSON shape, and the status code for: invalid input, not logged in, not an admin, not found, out of stock.", "Money — why prices are whole numbers of paise, and how the order total is worked out."],
        questions: ["Why does an order item store its own price instead of reading the product's price?", "Two people buy the last item at the same moment. What should happen?"],
      }),
      contractTask("User (role CUSTOMER | ADMIN), Product, CartItem, Order and OrderItem, matching my brief", "every endpoint in my brief"),
    ],
    done: ["docs/plan.md in your own words", "The schema is migrated", "Swagger at /docs shows every endpoint", "Your mentor has approved the plan and contract PRs"],
  },
  {
    intro: "Build the core API: accounts with roles, products, the cart — and tests.",
    tasks: [
      {
        id: "auth",
        title: "Accounts with roles",
        why: "Customers shop; admins manage products and orders. The token says who you are; a role check says what you may do.",
        branch: "feat/auth",
        prompt: 'Add POST /api/auth/signup (always role CUSTOMER) and POST /api/auth/login (zod, bcrypt, return { "token": "..." } with a 7-day JWT signed with JWT_SECRET), requireAuth middleware ("Authorization: Bearer <token>") and requireAdmin, which returns 403 for customers. Add a script, npm run make-admin -- <email>, that makes a user an admin.',
        steps: [bcryptStep, ...requestsFile("requests.http", "http://localhost:4000", authRequests())],
        understand: [...authUnderstand, "Why can't people sign up as an admin?"],
        check: [{ text: "Send Sign up, Log in, then Wrong password.", expect: "201, 200 with a token, 401" }],
        debug: authDebug,
        commit: "Add accounts with roles",
      },
      {
        id: "products",
        title: "Products",
        why: "The catalogue: anyone can browse; only admins change it.",
        branch: "feat/products",
        prompt: "Add GET /api/products?category=&q=&page=&sort=price|newest (public, 20 per page, returns items plus total and page count), GET /api/products/:id, and POST and PATCH /api/products/:id for admins only (zod: priceInPaise and stock are whole numbers ≥ 0). Then add prisma/seed.ts with 30 products across 4 categories.",
        understand: ["How does your pagination work, and what's the total for?", "Why is price a whole number of paise, not 499.99?", "What does a customer get from POST /api/products?"],
        check: [
          { text: "GET /api/products?category=…&page=2 returns the right page of that category." },
          { text: "As a customer, create a product.", expect: "403" },
        ],
        commit: "Add products",
      },
      {
        id: "cart",
        title: "The cart",
        why: "The cart is per user, and the total is always worked out on the server — never trusted from the client.",
        branch: "feat/cart",
        prompt: "Add GET /api/cart (items with product name, unit price, line totals and a cart total calculated on the server), POST /api/cart (add a product and quantity; add to the quantity if it's already there), PATCH /api/cart/:productId (set the quantity; 0 removes it) and DELETE /api/cart/:productId. You can't add more than the product's stock.",
        understand: ["Why is the total calculated on the server?", "What happens if you add more than the stock?"],
        check: [{ text: "Add two products, change a quantity, remove one — the cart total is right each time." }],
        commit: "Add cart",
      },
      testsTask("a customer can't create products (403); adding to the cart twice adds the quantities; the cart total is right; you can't add more than the stock."),
    ],
    done: ["Customers and admins with different rights", "Products are searchable and paginated", "The cart total is calculated on the server", "npm test passes", mergedLine],
  },
  {
    intro: "Checkout without overselling, then caching, rate limits and real performance numbers.",
    tasks: [
      {
        id: "checkout",
        title: "Checkout in one transaction",
        why: "The hardest and most important task. Creating the order, reducing stock and clearing the cart happen together — or not at all.",
        branch: "feat/checkout",
        prompt: "Add POST /api/orders: in one Prisma transaction, re-read the cart, check every product has enough stock, reduce stock with a conditional update (only where stock ≥ quantity), create the Order and OrderItems with the current prices copied in, and clear the cart. If any item is short, nothing changes and you return 409 with which product. Add GET /api/orders (mine; admins see all, filterable by status) and PATCH /api/orders/:id/status for admins. Write a test that checks out the last item twice at the same time with Promise.all and expects one 201 and one 409.",
        understand: [
          "Without the transaction, describe how stock could go below zero.",
          "Why does the stock update say “only where stock ≥ quantity”?",
          "Why copy the price onto the order item?",
        ],
        check: [{ text: "Run the tests:", code: "npm test", expect: "the double-checkout test passes" }, { text: "Check out a cart, then look in Prisma Studio: stock went down, the order has its items, and the cart is empty." }],
        commit: "Add checkout and orders",
      },
      cacheTask("the product list (GET /api/products, per query)", "When an admin creates or changes a product, clear every product-list key."),
      protectTask("5 POST /api/orders per minute per user"),
      loadTestTask("/api/products"),
    ],
    done: ["Checkout never oversells, even at the same moment", "The product list is cached and cleared on changes", "Checkout is rate-limited", "docs/performance.md has before and after numbers", mergedLine],
  },
  shipWeek("E-commerce backend", shopDone),
]

/* ------------------------------------------------------------------ */
/* Booking system API                                                  */
/* ------------------------------------------------------------------ */

const bookingDone = ["Two requests for the same slot: exactly one succeeds.", "Availability excludes booked and past slots.", "Cancellation after the cut-off is refused.", "Deployed with Swagger docs."]

const bookingApi: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially how free slots are worked out — then write the schema and API contract.",
    tasks: [
      planTask({
        parts: ["Errors — one JSON shape, and the status code for: invalid date, slot taken, too late to cancel, not found.", "Availability — in plain words, step by step, how you turn working hours and bookings into a list of free slots."],
        questions: ["Why is availability calculated instead of stored?", "What stops a double booking if two requests arrive at the same moment?"],
      }),
      contractTask("Provider, WorkingHours and Booking (unique provider + start time for booked slots), matching my brief", "every endpoint in my brief"),
    ],
    done: ["docs/plan.md in your own words, including the availability steps", "The schema is migrated", "Swagger at /docs shows every endpoint", "Your mentor has approved the plan and contract PRs"],
  },
  {
    intro: "Build the core API: providers and their hours, free slots, booking and cancelling — and tests.",
    tasks: [
      {
        id: "hours",
        title: "Providers, working hours and free slots",
        why: "Customers can only book what's free. This task turns weekly hours into the list of slots for any date.",
        branch: "feat/availability",
        prompt: "Add a seed with two providers (30- and 60-minute slots) and their weekly hours. Add PUT /api/providers/:id/hours (replace the week's hours; protect it with a PROVIDER_KEY header checked against an env variable) and GET /api/providers/:id/availability?date=YYYY-MM-DD: every slot inside that weekday's hours, minus BOOKED slots and slots already in the past. Put the slot calculation in a plain function in src/services/availability.ts with unit tests.",
        understand: ["Walk through your slot function for a 10:00–12:00 day with one booking at 10:30.", "Why is the slot calculation a plain function, separate from the route?"],
        check: [{ text: "Ask for tomorrow's availability: every slot inside the provider's hours is listed." }],
        commit: "Add working hours and availability",
      },
      {
        id: "bookings",
        title: "Book and cancel",
        why: "Booking is where the no-double-booking rule is tested for real. The database has the final say.",
        branch: "feat/bookings",
        prompt: "Add POST /api/bookings { providerId, startsAt, customerEmail }: the slot must be one of the free slots, and the unique constraint catches two requests at once — turn that error into 409. Add DELETE /api/bookings/:id?email= (cancel up to 2 hours before; 409 after), GET /api/providers/:id/bookings?date= (needs PROVIDER_KEY), and a confirmation email with Nodemailer — if SMTP isn't set in .env, log the email instead.",
        understand: ["Which error does Prisma throw when the unique constraint is broken, and where do you turn it into 409?", "How does cancelling make the slot free again?"],
        check: [
          { text: "Book a slot, then book the same slot again.", expect: "201, then 409" },
          { text: "Cancel it, then ask for availability — the slot is back." },
        ],
        commit: "Add booking and cancelling",
      },
      testsTask("two bookings for the same slot sent at the same time with Promise.all give exactly one 201 and one 409; a past slot can't be booked; cancelling after the cut-off returns 409."),
    ],
    done: ["Providers set hours; customers see real free slots", "Booking the same slot twice: one 201, one 409", "npm test passes", mergedLine],
  },
  {
    intro: "Make it production-ready: cached availability, rate limits, and real performance numbers.",
    tasks: [
      cacheTask("GET /api/providers/:id/availability per provider and date", "When a booking is made or cancelled, or hours change, delete that provider's availability keys."),
      protectTask("5 POST /api/bookings per minute per IP address"),
      loadTestTask("/api/providers/1/availability?date=2026-12-01"),
    ],
    done: ["Availability is cached and cleared on every change", "Booking is rate-limited", "docs/performance.md has before and after numbers", mergedLine],
  },
  shipWeek("Booking system API", bookingDone),
]

export const backendBuilds: Record<string, ProjectBuild> = {
  "url-shortener": urlShortener,
  "ecommerce-backend": ecommerce,
  "booking-api": bookingApi,
}

/* ------------------------------------------------------------------ */
/* Screens — the API, seen from outside                                */
/* ------------------------------------------------------------------ */

const swagger = (title: string, url: string, endpoints: string[]): ProjectScreen["mock"] => ({
  frame: "browser",
  title,
  url,
  blocks: [{ kind: "list", title: `${title} — Swagger`, items: endpoints.map((e) => ({ title: e.split(" — ")[0], meta: e.split(" — ")[1] })) }],
})

const term = (title: string, lines: { text: string; tone?: "cmd" | "ok" | "muted" | "warn" }[]): ProjectScreen["mock"] => ({ frame: "terminal", title, blocks: [{ kind: "terminal", lines }] })

export const backendScreens: Record<string, ProjectScreen[]> = {
  "url-shortener": [
    {
      id: "docs",
      name: "Swagger docs",
      purpose: "Your API's front door: every endpoint, documented and tryable in the browser.",
      shows: ["Every endpoint with its method and path", "Request and response examples", "Try it out against your running API"],
      calls: ["GET /docs"],
      week: 1,
      mock: swagger("sho.rt API", "localhost:4000/docs", ["POST /api/auth/signup — create an account", "POST /api/links — shorten a URL", "GET /api/links — my links, paginated", "GET /{code} — redirect", "GET /api/links/{id}/stats — analytics"]),
    },
    {
      id: "shorten",
      name: "Shorten a link",
      purpose: "A creator sends a long URL and gets a short one back — or a clear error.",
      shows: ["201 with the code and short URL", "409 when a custom alias is taken", "400 for an invalid URL"],
      calls: ["POST /api/links"],
      week: 2,
      mock: term("requests.http", [
        { text: 'POST /api/links  {"url":"https://example.com/very/long/path","customAlias":"launch"}', tone: "cmd" },
        { text: '201 Created  {"code":"launch","shortUrl":"https://sho.rt/launch"}', tone: "ok" },
        { text: "POST /api/links  {\"customAlias\":\"launch\", …}", tone: "cmd" },
        { text: '409 Conflict  {"error":"That alias is taken"}', tone: "warn" },
      ]),
    },
    {
      id: "redirect",
      name: "The redirect",
      purpose: "The hot path: a visitor opens the short link and lands on the long one, fast — from Redis after the first hit.",
      shows: ["302 with a Location header", "A click recorded for every visit", "cache hit in the logs after the first visit"],
      calls: ["GET /{code}"],
      week: 2,
      mock: term("terminal", [
        { text: "curl -I http://localhost:4000/launch", tone: "cmd" },
        { text: "HTTP/1.1 302 Found", tone: "ok" },
        { text: "Location: https://example.com/very/long/path" },
        { text: '{"msg":"cache hit","key":"link:launch","responseTime":2}', tone: "muted" },
      ]),
    },
    {
      id: "stats",
      name: "Link stats",
      purpose: "Creators see how a link performs: clicks per day, referrers and devices.",
      shows: ["Total clicks", "Clicks per day", "Top referrers and devices"],
      calls: ["GET /api/links/{id}/stats"],
      week: 3,
      mock: term("requests.http", [
        { text: "GET /api/links/42/stats?from=2026-03-01", tone: "cmd" },
        { text: '200 OK  {"total":318,"byDay":[{"day":"2026-03-14","clicks":41}],', tone: "ok" },
        { text: '         "referrers":["twitter.com","linkedin.com"],"devices":{"mobile":201,"desktop":117}}' },
      ]),
    },
    {
      id: "limit",
      name: "Rate limit",
      purpose: "Too many links too fast gets a polite 429 — not a crashed server.",
      shows: ["429 Too Many Requests", "A Retry-After header"],
      calls: ["POST /api/links"],
      week: 3,
      mock: term("terminal", [
        { text: "for i in {1..12}; do curl -s -o /dev/null -w '%{http_code} ' -X POST …/api/links; done", tone: "cmd" },
        { text: "201 201 201 201 201 201 201 201 201 201 429 429", tone: "warn" },
      ]),
    },
  ],
  "ecommerce-backend": [
    {
      id: "docs",
      name: "Swagger docs",
      purpose: "Every endpoint of the store, documented and tryable in the browser.",
      shows: ["Products, cart, orders and admin endpoints", "Which endpoints need a token or the admin role"],
      calls: ["GET /docs"],
      week: 1,
      mock: swagger("Shop API", "localhost:4000/docs", ["GET /api/products — browse, filter, paginate", "POST /api/products — admin: add a product", "GET /api/cart — my cart, with totals", "POST /api/orders — checkout", "PATCH /api/orders/{id}/status — admin"]),
    },
    {
      id: "products",
      name: "Browse products",
      purpose: "Anyone browses the catalogue, filtered, searched and paginated — served from Redis.",
      shows: ["A page of products", "The total and page count", "Filters for category and search"],
      calls: ["GET /api/products"],
      week: 2,
      mock: term("requests.http", [
        { text: "GET /api/products?category=shoes&page=1", tone: "cmd" },
        { text: '200 OK  {"items":[{"id":7,"name":"Runner X","priceInPaise":349900,"stock":12}, …],', tone: "ok" },
        { text: '         "total":34,"page":1,"pages":2}' },
      ]),
    },
    {
      id: "cart",
      name: "The cart",
      purpose: "Each customer's cart, with every total worked out by the server.",
      shows: ["Items with quantities and line totals", "A cart total in paise"],
      calls: ["GET /api/cart", "POST /api/cart"],
      week: 2,
      mock: term("requests.http", [
        { text: "GET /api/cart", tone: "cmd" },
        { text: '200 OK  {"items":[{"name":"Runner X","quantity":2,"lineTotalInPaise":699800}],', tone: "ok" },
        { text: '         "totalInPaise":699800}' },
      ]),
    },
    {
      id: "checkout",
      name: "Checkout",
      purpose: "All or nothing: the order is created and stock drops — or nothing changes and you're told why.",
      shows: ["201 with the order", "409 naming the product that ran out"],
      calls: ["POST /api/orders"],
      week: 3,
      mock: term("requests.http", [
        { text: "POST /api/orders", tone: "cmd" },
        { text: '201 Created  {"id":1042,"status":"PLACED","totalInPaise":699800}', tone: "ok" },
        { text: "POST /api/orders   (someone else bought the last one)", tone: "cmd" },
        { text: '409 Conflict  {"error":"Not enough stock for Runner X"}', tone: "warn" },
      ]),
    },
    {
      id: "admin",
      name: "Admin: orders",
      purpose: "Admins see every order and move it along: placed → shipped → delivered.",
      shows: ["All orders, filterable by status", "Status updates — and 403 for customers"],
      calls: ["GET /api/orders", "PATCH /api/orders/{id}/status"],
      week: 3,
      mock: term("requests.http", [
        { text: 'PATCH /api/orders/1042/status  {"status":"SHIPPED"}   (admin token)', tone: "cmd" },
        { text: '200 OK  {"id":1042,"status":"SHIPPED"}', tone: "ok" },
        { text: "PATCH /api/orders/1042/status   (customer token)", tone: "cmd" },
        { text: '403 Forbidden  {"error":"Admins only"}', tone: "warn" },
      ]),
    },
  ],
  "booking-api": [
    {
      id: "docs",
      name: "Swagger docs",
      purpose: "Every endpoint of the booking API, documented and tryable in the browser.",
      shows: ["Availability, booking and provider endpoints", "Which ones need the provider key"],
      calls: ["GET /docs"],
      week: 1,
      mock: swagger("Booking API", "localhost:4000/docs", ["GET /api/providers/{id}/availability — free slots", "POST /api/bookings — book a slot", "DELETE /api/bookings/{id} — cancel", "PUT /api/providers/{id}/hours — provider", "GET /api/providers/{id}/bookings — provider"]),
    },
    {
      id: "availability",
      name: "Free slots",
      purpose: "The slots a customer can book on a date: working hours, minus bookings, minus the past.",
      shows: ["Every free slot for the date", "No booked or past slots"],
      calls: ["GET /api/providers/{id}/availability"],
      week: 2,
      mock: term("requests.http", [
        { text: "GET /api/providers/1/availability?date=2026-12-01", tone: "cmd" },
        { text: '200 OK  {"date":"2026-12-01","slots":["10:00","10:30","11:30","12:00","14:00"]}', tone: "ok" },
      ]),
    },
    {
      id: "book",
      name: "Book a slot",
      purpose: "A customer books a slot; the same slot twice is refused, even at the same moment.",
      shows: ["201 and a confirmation email", "409 when the slot is taken"],
      calls: ["POST /api/bookings"],
      week: 2,
      mock: term("requests.http", [
        { text: 'POST /api/bookings  {"providerId":1,"startsAt":"2026-12-01T10:00","customerEmail":"asha@example.com"}', tone: "cmd" },
        { text: '201 Created  {"id":88,"status":"BOOKED"}', tone: "ok" },
        { text: "POST /api/bookings   (same slot)", tone: "cmd" },
        { text: '409 Conflict  {"error":"That slot was just booked"}', tone: "warn" },
      ]),
    },
    {
      id: "provider-day",
      name: "Provider's day",
      purpose: "A provider sees the day's bookings at a glance.",
      shows: ["Every booking for the date, in time order", "Refused without the provider key"],
      calls: ["GET /api/providers/{id}/bookings"],
      week: 2,
      mock: term("requests.http", [
        { text: "GET /api/providers/1/bookings?date=2026-12-01   (X-Provider-Key)", tone: "cmd" },
        { text: '200 OK  [{"startsAt":"10:00","customerEmail":"asha@example.com"},{"startsAt":"13:00", …}]', tone: "ok" },
      ]),
    },
  ],
}
