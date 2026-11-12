import type { BuildTask, BuildWeek, ProjectBuild } from "@/data/docs/types"

/*
 * Full-Stack: the three projects, week by week. Every project builds on the
 * my-fullstack-app repo from Setup (client/ + server/). Tasks shared by all
 * three projects are written once below.
 */

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

/**
 * Week 1's task. Start here already gives the diagrams, so the student
 * doesn't redraw them: they write their own plan, in their own words, with
 * AI interviewing them instead of writing it for them.
 */
function planTask(extra: string, questions: string[]): BuildTask {
  return {
    id: "plan",
    title: "Write your plan, in your own words",
    why: "Reading Start here tells you what to build. Writing the plan yourself proves you understood it — and gives your mentor something to sign off before you code.",
    branch: "docs/plan",
    prompt: `Don't write this for me. Interview me, one question at a time, to help me write docs/plan.md. Cover:
1. Build order — every Must have feature from my brief as a checklist, in the order I'll build them, and why that order.
2. Errors — the one JSON shape every error will use, and which status codes I'll return for: not logged in, not allowed, not found, invalid input.
${extra}
4. One decision — one choice I made (a library, a rule, a trade-off), and why.
5. Questions — anything I'm unsure about, for my mentor.
After each answer, tell me if it's unclear or wrong and why. At the end, turn my answers into docs/plan.md, keeping my words.`,
    steps: [{ text: "In the Explorer, right-click the empty space → New File… → type docs/plan.md and press Enter." }],
    understand: ["Which feature will you build first, and why that one?", "Pick one screen: which endpoints does it call, and which tables do they read or change?", ...questions],
    check: [{ text: "Preview the file in VS Code (Ctrl + Shift + V, or Cmd + Shift + V on a Mac): all five parts are filled in, in your own words." }],
    debug: ["The AI starts writing the whole plan for you: remind it to ask questions one at a time and wait for your answers."],
    commit: "Add project plan",
  }
}

const testsSetupSteps = [
  { text: "In the server folder, install the test tools:", code: "cd server\nnpm install -D vitest supertest @types/supertest\nnpm pkg set scripts.test=\"vitest run\"" },
  { text: "Tests need their own database, so they can't wipe your real data. Copy server/.env to server/.env.test and change the database name at the end of DATABASE_URL to devvy_fullstack_test." },
  { text: "Open server/.gitignore and add .env.test on its own line — it has your database password too." },
]

const deployApiTask: BuildTask = {
  id: "deploy-api",
  title: "Deploy the API and database",
  why: "A project only counts when other people can use it. The API and database go on Render, which deploys every time you push to main.",
  branch: "chore/deploy-api",
  prompt:
    "I'm deploying server/ to Render with a Render PostgreSQL database. Check my server code is ready for production: the port comes from PORT, CORS only allows CLIENT_URL, there are build and start scripts, migrations run with prisma migrate deploy, and no secret is hard-coded. List what needs changing and why, then show the changes one file at a time.",
  steps: [
    { text: "Follow Building → Deployment, parts 1 and 2, to create the database and the web service on Render." },
    { text: "On Render, set JWT_SECRET to a new random value — never reuse the one from your laptop." },
  ],
  understand: [
    "Why does the server read its port from PORT instead of always using 4000?",
    "What's the difference between prisma migrate dev and prisma migrate deploy, and why does Render use deploy?",
    "Which settings live in Render's Environment page, and why aren't they in your code?",
  ],
  check: [{ text: "Open https://YOUR-API.onrender.com/health in your browser.", expect: '{"ok":true}' }],
  debug: [
    "The deploy fails at “prisma migrate deploy”: DATABASE_URL on Render must be the database's Internal URL.",
    "It deploys but /health never loads: check Render's Logs tab. “Missing script: start” means the start script isn't in server/package.json.",
    "The first request takes a minute: free Render services sleep when idle. That's normal.",
  ],
  commit: "Prepare API for production",
}

const deployClientTask: BuildTask = {
  id: "deploy-client",
  title: "Deploy the React app",
  why: "The client goes on Vercel and talks to your live API. After this, anyone with the link can use your app.",
  branch: "chore/deploy-client",
  prompt:
    "I'm deploying client/ (Vite + React Router) to Vercel. It reads VITE_API_URL. What do I need so that refreshing a page like /login doesn't give a 404 on Vercel? Show me the file to add and explain why it's needed.",
  steps: [
    { text: "Follow Building → Deployment, part 3, to import the repo on Vercel with root directory client and VITE_API_URL set to your Render URL." },
    { text: "Copy your Vercel URL into CLIENT_URL on Render, and redeploy the API so CORS allows it." },
  ],
  understand: [
    "Why does a single-page app need every path rewritten to index.html?",
    "VITE_API_URL ends up inside your JavaScript — why is that fine for an address but never for a secret?",
    "What does CORS actually block, and why does the API need to know your Vercel URL?",
  ],
  check: [
    { text: "Open your Vercel URL, sign up as a new user and use the main feature end to end." },
    { text: "Refresh the page while on /login and on a logged-in page. Both still load." },
  ],
  debug: [
    "“blocked by CORS policy” in the browser console (F12): CLIENT_URL on Render must match your Vercel URL exactly — https, no slash at the end.",
    "Every API call goes to localhost: VITE_API_URL wasn't set on Vercel before the build. Set it, then redeploy.",
  ],
  commit: "Add Vercel config",
}

function readmeTask(name: string): BuildTask {
  return {
    id: "readme",
    title: "README and demo video",
    why: "The README is the first thing a recruiter or your mentor sees. It should say what the app does, show it, and let anyone run it.",
    branch: "docs/readme",
    prompt: `Write the README for ${name} using my brief and docs/plan.md. Sections: what it does (2–3 sentences), live link, screenshots (leave placeholders), tech stack, how to run it locally (both client and server, step by step), environment variables (name and what it's for — never values), and the API endpoints. Keep it short and plain.`,
    steps: [
      { text: "Take 3–4 screenshots of the live app and drag them into the README on GitHub, or save them in docs/ and link them." },
      { os: ["mac"], text: "Record a 2–3 minute demo: press Cmd + Shift + 5, choose Record Selected Portion, and walk through the main flow while you talk." },
      { os: ["windows"], text: "Record a 2–3 minute demo: open the Snipping Tool, switch to Record (the video icon), select your browser window, and walk through the main flow while you talk." },
      { os: ["linux"], text: "Record a 2–3 minute demo: press Print Screen, switch to the screen recorder (the video icon), select your browser, and walk through the main flow while you talk." },
      { text: "Upload the video to YouTube as Unlisted (or Google Drive, shared as Anyone with the link) and put the link in the README." },
    ],
    understand: ["If a stranger cloned your repo today, which step would they get stuck on?", "Why do you list environment variable names but never their values?"],
    check: [
      { text: "Clone your repo into a new folder and follow your own README from the top. It runs without you guessing anything." },
      { text: "The live link, screenshots and demo video all open." },
    ],
    debug: ["Screenshots don't show on GitHub: the image path is relative to the README — docs/home.png, not /docs/home.png."],
    commit: "Write README with demo",
  }
}

function finalReviewTask(doneWhen: string[]): BuildTask {
  return {
    id: "final-review",
    title: "Get ready for your final review",
    why: "In the final review your mentor uses the live app, reads your code and asks you to explain it. Practise that first.",
    prompt: `Act as a strict senior engineer reviewing my project. Here is what “done” means:\n${doneWhen.map((d) => `- ${d}`).join("\n")}\nAsk me 10 questions, one at a time, that a reviewer would ask about my code, my design decisions and a bug I fixed. Wait for my answer each time, then tell me what a stronger answer would include.`,
    steps: [
      { text: "Read Reviews → Review rubric and Reviews → Submission checklist, and tick every line." },
      { text: "Tick off every feature in the checklist in docs/plan.md, so it matches what you built." },
      { text: "Email your mentor: live link, repo link, demo video link, and one line on what you're proudest of." },
    ],
    understand: [
      "Explain the hardest bug you hit: what you saw, how you found the cause, and how you fixed it.",
      "Which part did AI write that you had to change, and why?",
      "If you had one more week, what would you build or fix first?",
    ],
    check: doneWhen.map((d) => ({ text: `On the live site: ${d}` })),
  }
}

/** Week 4 is the same shape for every project: deploy both halves, write it up, final review. */
function shipWeek(name: string, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it. You'll put the API and the app online, write the README, record a demo, and get ready for the final review.",
    tasks: [deployApiTask, deployClientTask, readmeTask(name), finalReviewTask(doneWhen)],
    done: ["The app is live and works for a brand-new user", "The README lets a stranger run it locally", "The demo video is linked from the README", "Your mentor has the links for the final review"],
  }
}

const requestsFile = (body: string) => ({
  text: "Create server/requests.http and paste this. Each ### block is one request — click Send Request above it to run it:",
  file: "server/requests.http",
  code: `@api = http://localhost:4000\n\n${body}`,
})

const restClientStep = {
  text: "Install the REST Client extension (Extensions → search REST Client, by Huachao Mao). It sends API requests from a file, the same way on every computer.",
}

const authRequests = `### Sign up
# @name signup
POST {{api}}/api/auth/signup
Content-Type: application/json

{ "name": "Asha", "email": "asha@example.com", "password": "secret123" }

### Log in
# @name login
POST {{api}}/api/auth/login
Content-Type: application/json

{ "email": "asha@example.com", "password": "secret123" }

### Wrong password
POST {{api}}/api/auth/login
Content-Type: application/json

{ "email": "asha@example.com", "password": "nope" }`

const authUnderstand = [
  "Why do you store a bcrypt hash instead of the password? What would an attacker get if they stole your database?",
  "What's inside your JWT? Why must a password never go in it?",
  "Walk through requireAuth: what does it do when the token is missing, invalid or expired?",
]

const authDebug = [
  "Every request says 401: the header must be exactly Authorization: Bearer <token> — one space, no quotes.",
  "“secretOrPrivateKey must have a value”: JWT_SECRET isn't in server/.env, or the server wasn't restarted after you added it.",
]

const frontendAuthTask: BuildTask = {
  id: "auth-pages",
  screens: ["auth"],
  title: "Login, signup and protected pages",
  why: "Everything else in the app needs a logged-in user, so the client's auth comes first — along with one helper that every API call goes through.",
  branch: "feat/auth-pages",
  prompt:
    "In client/, add React Router with /login, /signup and / (the main page). / must redirect to /login when nobody is logged in. Write client/src/lib/api.ts: one function that calls VITE_API_URL, adds the saved token as Authorization: Bearer, and throws the API's error message when the response isn't OK. Build login and signup forms that show the API's error under the form and disable the button while sending. Add a Log out button.",
  steps: [{ text: "In a terminal, install the router:", code: "cd client\nnpm install react-router" }],
  understand: [
    "Where is the token stored after login? What's the risk of that, and how does your app limit it?",
    "Click Log in and narrate every step until the next page shows — which function runs, which request is sent, what the API answers.",
    "How does a protected page know someone is logged in? What happens when the token expires?",
  ],
  check: [
    { text: "Sign up in the browser — you land on the main page." },
    { text: "Refresh — you're still logged in. Log out — you're back on /login." },
    { text: "Log in with a wrong password — the API's message shows under the form." },
  ],
  debug: [
    "“blocked by CORS policy” in the console (F12): CLIENT_URL in server/.env must be exactly http://localhost:5173. Restart the server after changing it.",
    "“Failed to fetch”: the API isn't running, or VITE_API_URL is wrong. Restart the client after changing client/.env.",
  ],
  commit: "Add auth pages and protected routes",
}

/* ------------------------------------------------------------------ */
/* Job application tracker                                             */
/* ------------------------------------------------------------------ */

const jobTrackerDone = [
  "A new user can sign up, add five applications and move them across stages.",
  "One user can never see another user's applications.",
  "Every form shows a clear error for invalid input.",
  "The README explains how to run it locally.",
]

const jobTracker: ProjectBuild = [
  {
    intro: "You've read Start here, so you know what you're building. Now plan it, in your own words, for your mentor to sign off. No app code yet.",
    tasks: [
      planTask("3. Stages — the five stages, and whether an application can move from any stage to any other.", [
        "Draw, on paper, what happens when a logged-in user adds an application: which part talks to which, and what's sent each time.",
        "Why does every Application row have a userId? Which endpoints must check it?",
        "What status code does your API return when the token is missing? When the application belongs to someone else?",
      ]),
    ],
    done: ["docs/plan.md lists every feature as a checklist, in build order", "docs/plan.md has your build order, error format, stages, one decision and your questions", "Your mentor has approved your plan PR"],
  },
  {
    intro: "Build the API: the database tables, sign-up and login, and every applications endpoint — each one tested before it's merged.",
    tasks: [
      {
        id: "schema",
        title: "Database tables and seed data",
        why: "Every feature reads or writes these tables. Seed data gives you realistic rows to test with from day one.",
        branch: "feat/schema",
        prompt:
          "Write the Prisma models for User and Application in server/prisma/schema.prisma, matching my brief. Stage must be an enum. Then write server/prisma/seed.ts that deletes existing rows, creates one test user (asha@example.com, password secret123, hashed with bcrypt) and 8 applications spread across all five stages, some with follow-up dates.",
        steps: [
          { text: "Create the tables (run in server):", code: "cd server\nnpx prisma migrate dev --name users-and-applications" },
          { text: "Tell Prisma how to seed: open server/prisma.config.ts and, inside migrations, add this line under path:", file: "server/prisma.config.ts", code: 'seed: "tsx prisma/seed.ts",' },
          { text: "Run the seed, then open Prisma Studio to look at your data:", code: "npx prisma db seed\nnpx prisma studio" },
        ],
        understand: [
          "What does @relation do? What happens to a user's applications if the user is deleted — and is that what you want?",
          "Why is email marked @unique, and what error do you get if you insert the same email twice?",
          "What's the difference between prisma migrate dev and prisma db seed?",
        ],
        check: [{ text: "Prisma Studio opens in your browser and shows 1 user and 8 applications across all five stages." }],
        debug: ["P1001: PostgreSQL isn't running.", "“Unique constraint failed on the fields: (email)” when seeding: the seed must delete existing rows first (deleteMany), so it can run twice."],
        commit: "Add User and Application models with seed data",
      },
      {
        id: "auth",
        title: "Sign up and log in",
        why: "Every applications endpoint needs to know who's calling. Signup and login hand out a token; a middleware checks it on every request.",
        branch: "feat/auth",
        prompt:
          'Add POST /api/auth/signup and POST /api/auth/login. Validate bodies with zod (name, email, password of at least 8 characters). Hash passwords with bcrypt. Both return { "token": "...", "user": { "id", "name", "email" } }, with a JWT signed with JWT_SECRET that expires in 7 days. Signup with a used email returns 409; a wrong login returns 401 with the same message whether the email or the password was wrong. Add requireAuth middleware that reads "Authorization: Bearer <token>", verifies it and puts the user id on the request. Use server/src/routes/auth.ts and server/src/middleware/auth.ts, and the error format from docs/plan.md.',
        steps: [restClientStep, requestsFile(authRequests)],
        understand: [...authUnderstand, "Why does a wrong login give the same message for a wrong email and a wrong password?"],
        check: [
          { text: "Send Sign up.", expect: "201, with a token" },
          { text: "Send Sign up again with the same email.", expect: "409" },
          { text: "Send Log in, then Wrong password.", expect: "200 with a token, then 401" },
        ],
        debug: authDebug,
        commit: "Add signup, login and auth middleware",
      },
      {
        id: "applications-api",
        title: "Applications endpoints",
        why: "This is the core of the app. The most important rule: a user only ever sees and changes their own applications.",
        branch: "feat/applications-api",
        prompt:
          "Build the applications endpoints from my brief, all behind requireAuth: GET /api/applications?stage=&q= (q searches company and role), POST /api/applications, PATCH /api/applications/:id and DELETE /api/applications/:id. Validate bodies with zod. Every query must include the logged-in user's id, so nobody can read or change another user's application — return 404 when it isn't theirs. Then add GET /api/stats: counts per stage and the next 5 follow-ups. Use server/src/routes/applications.ts.",
        steps: [
          {
            text: "Add these to the bottom of server/requests.http to try it — sign up a second user too, and try to change the first user's application with their token:",
            file: "server/requests.http",
            code: '### Add an application\nPOST {{api}}/api/applications\nAuthorization: Bearer {{login.response.body.token}}\nContent-Type: application/json\n\n{ "company": "Zomato", "role": "Frontend intern", "stage": "APPLIED" }\n\n### List\nGET {{api}}/api/applications?stage=APPLIED\nAuthorization: Bearer {{login.response.body.token}}\n\n### Stats\nGET {{api}}/api/stats\nAuthorization: Bearer {{login.response.body.token}}',
          },
        ],
        understand: [
          "Point to the exact line that stops user A from editing user B's application.",
          "Why return 404 instead of 403 for someone else's application?",
          "What does zod do when the stage is something like GHOSTED? What does the client get back?",
        ],
        check: [
          { text: "Create, list (with and without ?stage=), update and delete an application with REST Client — each gives the status code in your API contract." },
          { text: "With a second user's token, PATCH the first user's application.", expect: "404" },
          { text: "GET /api/stats returns the right count for each stage." },
        ],
        debug: ["“Invalid value for argument stage”: the value isn't one of the enum's values — zod should reject it before Prisma sees it."],
        commit: "Add applications and stats endpoints",
      },
      {
        id: "api-tests",
        title: "Automated tests for the API",
        why: "Tests check your rules every time you change something — especially the one that keeps users' data apart.",
        branch: "test/api",
        prompt:
          "Set up Vitest and Supertest for server/. Tests must use the database in server/.env.test: a Vitest global setup should load it and run prisma migrate reset --force before the tests. Export the Express app from app.ts without starting the server. Write tests for: signup, signup with a used email (409), login with a wrong password (401), creating an application, and another user getting 404 when they try to read or change it.",
        steps: testsSetupSteps,
        understand: [
          "Why do tests use a different database from the one you develop with?",
          "Why does importing app (not index.ts) let Supertest test the API without starting a server?",
          "Break the ownership check on purpose: which test fails? Put it back.",
        ],
        check: [{ text: "Run the tests (in server):", code: "npm test", expect: "every test passes" }],
        debug: ["“database devvy_fullstack_test does not exist”: migrate reset creates it — check the user and password in .env.test match server/.env."],
        commit: "Add API tests",
      },
    ],
    done: ["The database has User and Application tables, with seed data", "Signup, login and every applications endpoint work, with validation", "A user can never read or change another user's application", "npm test passes", "Every task merged through a reviewed pull request"],
  },
  {
    intro: "Build the React app on top of your API: login and signup, the board, and the form — with loading, empty and error states everywhere.",
    tasks: [
      frontendAuthTask,
      {
        id: "board",
        screens: ["board", "list"],
        title: "Board and list views",
        why: "The board is the screen users live on. It also teaches the three states every screen with data needs: loading, empty and error.",
        branch: "feat/board",
        prompt:
          "Build the main page: a board with five columns (Wishlist, Applied, Interview, Offer, Rejected) and a card per application showing company, role and follow-up date, loaded from GET /api/applications. Add a toggle to a list view with a search box that uses ?q=. Show a loading state, an empty state (“No applications yet — add your first one”) and an error state with a Retry button.",
        understand: [
          "Why does the page need loading, empty and error states, not just the data?",
          "Does the search run in the browser or in the API? Why is that the better choice here?",
          "What makes this component re-render? What would cause it to fetch twice?",
        ],
        check: [
          { text: "Log in as the seed user: 8 cards appear in the right columns." },
          { text: "Search for part of a company name in list view — only matches show." },
          { text: "Stop the API (Ctrl + C) and refresh — the error state shows. Start it again and click Retry." },
        ],
        debug: ["The board flashes empty before the cards appear: show the loading state until the first response arrives, not the empty state."],
        commit: "Add board and list views",
      },
      {
        id: "application-form",
        screens: ["form", "follow-ups"],
        title: "Add, edit and move applications",
        why: "This is where the project's main flow comes alive: add an application, move it to Interview, and see it in upcoming follow-ups.",
        branch: "feat/application-form",
        prompt:
          "Add an Add application button that opens a form (company, role, URL, location, salary range, stage, follow-up date, notes), used for both create and edit. Validate in the browser with clear messages next to each field, and send to POST or PATCH. Add Delete with a confirm. Above the board, show counts per stage and Upcoming follow-ups from GET /api/stats.",
        understand: [
          "Why validate in the browser when the API validates too?",
          "After saving, how does the board update — fetch again, or change the list in memory? What's the trade-off?",
          "How do you send the follow-up date so it doesn't shift by a day for users in different time zones?",
        ],
        check: [
          { text: "Follow the Add an application flow from Start here: the card appears in the right column and the count updates." },
          { text: "Follow Move to interview: the card moves and shows under Upcoming follow-ups." },
          { text: "Submit the form empty — each field shows its own message, and nothing is sent." },
        ],
        debug: ["The follow-up date is a day off: send it as YYYY-MM-DD and store it as a date, not a date-time in local time."],
        commit: "Add application form, delete and stats",
      },
    ],
    done: ["Login, signup and logout work, and pages are protected", "The board and list show every application, with search", "Add, edit, move and delete all work from the browser", "Every screen has loading, empty and error states", "Every task merged through a reviewed pull request"],
  },
  shipWeek("Job application tracker", jobTrackerDone),
]

/* ------------------------------------------------------------------ */
/* Event booking platform                                              */
/* ------------------------------------------------------------------ */

const eventDone = [
  "Booking stops exactly at the seat limit, even when two people book at once.",
  "Attendees can't create events; organisers can only edit their own.",
  "Cancelling a booking frees the seat.",
  "The README explains the booking logic.",
]

const eventBooking: ProjectBuild = [
  {
    intro: "You've read Start here, so you know what you're building. Now plan it, in your own words — including exactly how you'll stop two people taking the last seat.",
    tasks: [
      planTask("3. The last seat — step by step, how you'll stop two people who book at the same moment from both getting the last seat.", [
        "Two attendees press Book on the last seat at the same moment. Walk through what your design does for each of them.",
        "What does the unique constraint on (eventId, userId) prevent?",
        "Which endpoints can only organisers call, and which only the event's own organiser?",
      ]),
    ],
    done: ["docs/plan.md lists every feature as a checklist, in build order", "docs/plan.md has your build order, error format, last-seat plan, one decision and your questions", "Your mentor has approved your plan PR"],
  },
  {
    intro: "Build the API: tables, accounts with roles, events for organisers, and a booking endpoint that never overbooks.",
    tasks: [
      {
        id: "schema",
        title: "Database tables and seed data",
        why: "Users, events and bookings — with a rule in the database itself that one person can't book the same event twice.",
        branch: "feat/schema",
        prompt:
          "Write the Prisma models for User (with a role enum ORGANISER | ATTENDEE), Event (with a status enum PUBLISHED | CANCELLED) and Booking in server/prisma/schema.prisma, matching my brief. Booking needs a unique constraint on (eventId, userId). Then write server/prisma/seed.ts that deletes existing rows and creates one organiser and two attendees (password secret123, hashed with bcrypt), and 4 upcoming events — one with only 1 seat left.",
        steps: [
          { text: "Create the tables (run in server):", code: "cd server\nnpx prisma migrate dev --name users-events-bookings" },
          { text: "Open server/prisma.config.ts and, inside migrations, add this line under path:", file: "server/prisma.config.ts", code: 'seed: "tsx prisma/seed.ts",' },
          { text: "Seed and look at the data:", code: "npx prisma db seed\nnpx prisma studio" },
        ],
        understand: [
          "What does @@unique([eventId, userId]) stop, and what error does Prisma throw when it's broken?",
          "Why is the event's seat count stored as totalSeats rather than a seatsLeft number you keep changing?",
          "What should happen to bookings when an event is cancelled?",
        ],
        check: [{ text: "Prisma Studio shows 3 users, 4 events and the bookings that fill one event to 1 seat left." }],
        debug: ["“Unique constraint failed” when seeding: delete bookings first, then events, then users — children before parents."],
        commit: "Add User, Event and Booking models with seed data",
      },
      {
        id: "auth",
        title: "Accounts with roles",
        why: "Organisers and attendees can do different things. The token says who you are; a role check decides what you may do.",
        branch: "feat/auth",
        prompt:
          'Add POST /api/auth/signup (with a role: ORGANISER or ATTENDEE) and POST /api/auth/login, validated with zod and hashed with bcrypt. Both return { "token": "...", "user": { "id", "name", "email", "role" } } with a JWT signed with JWT_SECRET (7 days). Add requireAuth middleware (reads "Authorization: Bearer <token>") and requireRole("ORGANISER") middleware that returns 403 for anyone else. Use server/src/routes/auth.ts and server/src/middleware/auth.ts.',
        steps: [restClientStep, requestsFile(authRequests.replace('"password": "secret123" }\n\n### Log in', '"password": "secret123", "role": "ORGANISER" }\n\n### Log in'))],
        understand: [...authUnderstand, "What's the difference between 401 and 403, and when does your API return each?"],
        check: [
          { text: "Send Sign up, then Log in.", expect: "201, then 200 — both with a token and the role" },
          { text: "Send Wrong password.", expect: "401" },
        ],
        debug: authDebug,
        commit: "Add accounts with roles",
      },
      {
        id: "events-api",
        title: "Events for organisers",
        why: "Organisers publish and manage events; everyone can browse them. The rule to get right: organisers only touch their own events.",
        branch: "feat/events-api",
        prompt:
          "Build GET /api/events?q=&when=upcoming|past (public, with seatsLeft for each event), GET /api/events/:id, POST /api/events (organisers only), and PATCH /api/events/:id (only the event's own organiser — edit fields or cancel). Validate with zod: totalSeats is at least 1, and startsAt is in the future when creating. Use server/src/routes/events.ts.",
        understand: [
          "How is seatsLeft worked out? Why not store it as a column?",
          "Point to the line that stops organiser A from editing organiser B's event.",
          "What does an attendee get back from POST /api/events, and which middleware decides that?",
        ],
        check: [
          { text: "As the organiser, create an event, then edit it — 201, then 200." },
          { text: "As an attendee, try to create an event.", expect: "403" },
          { text: "GET /api/events?when=upcoming lists only future events, each with seatsLeft." },
        ],
        debug: ["Every event shows seatsLeft as the full total: count the event's bookings with Prisma's _count, then subtract."],
        commit: "Add events endpoints",
      },
      {
        id: "bookings-api",
        title: "Booking without overbooking",
        why: "The hard part of this project. Two requests for the last seat can arrive at the same moment — only one may win.",
        branch: "feat/bookings",
        prompt:
          "Build POST /api/events/:id/bookings (attendees only), DELETE /api/bookings/:id (only the attendee who made it), GET /api/me/bookings and GET /api/events/:id/attendees (only that event's organiser). Create the booking inside a Prisma interactive transaction with isolationLevel Serializable: count the event's bookings, refuse with 409 when it's full, a cancelled event or already booked by this user. Retry once if the transaction fails with a serialization error. Then set up Vitest and Supertest (tests use server/.env.test, reset with prisma migrate reset --force in a global setup) and write a test that books the last seat twice at the same time with Promise.all and expects exactly one 201 and one 409.",
        steps: testsSetupSteps,
        understand: [
          "Without the transaction, describe exactly how two people could both get the last seat.",
          "What does the Serializable isolation level do, and why does that mean you sometimes need to retry?",
          "Why does the test send both requests with Promise.all instead of one after the other?",
        ],
        check: [
          { text: "Run the tests (in server):", code: "npm test", expect: "the double-booking test passes" },
          { text: "With REST Client, book the seeded event that has 1 seat left as one attendee, then as the other.", expect: "201, then 409" },
          { text: "Cancel the first booking, then book again as the second attendee.", expect: "201" },
        ],
        debug: ["The double-booking test sometimes passes and sometimes fails: the count and the insert aren't in the same transaction. Read your transaction code line by line."],
        commit: "Add bookings with seat limit and tests",
      },
    ],
    done: ["Users, events and bookings in the database, with seed data", "Organiser-only and own-event-only rules return 403", "Booking the last seat twice at once gives exactly one 201 and one 409", "npm test passes", "Every task merged through a reviewed pull request"],
  },
  {
    intro: "Build the React app: the public events list, booking from the event page, My bookings, and the organiser dashboard.",
    tasks: [
      { ...frontendAuthTask, prompt: frontendAuthTask.prompt.replace("Build login and signup forms", "The signup form lets people choose Organiser or Attendee. Build login and signup forms") },
      {
        id: "events-pages",
        screens: ["events", "event"],
        title: "Events list and event page",
        why: "Most visitors only browse. The list must be quick to scan, and the event page must make booking obvious.",
        branch: "feat/events-pages",
        prompt:
          "Build / as the public events list (no login needed) with a search box and Upcoming / Past filters, using GET /api/events. Build /events/:id with the details, seats left and a Book button: it sends to login if you're not logged in, is disabled when full, and shows the API's message on 409. Show loading, empty and error states.",
        understand: [
          "Why can the events list work without login, while booking can't?",
          "After a successful booking, how does seats left update on the page?",
          "What does the user see when someone else took the last seat a second before they clicked Book?",
        ],
        check: [
          { text: "Logged out, browse and search events — it works." },
          { text: "Book a seat as an attendee: seats left goes down by one, and the button changes to Booked." },
          { text: "Open the full event: the Book button is disabled and says Full." },
        ],
        debug: ["Seats left doesn't change after booking: fetch the event again after a 201 (or subtract one locally — and know why that can be wrong)."],
        commit: "Add events list and event page",
      },
      {
        id: "dashboards",
        screens: ["my-bookings", "organiser"],
        title: "My bookings and the organiser dashboard",
        why: "Each role needs its own home: attendees see what they booked; organisers manage events and see who's coming.",
        branch: "feat/dashboards",
        prompt:
          "Build /me/bookings for attendees (list with Cancel, using GET /api/me/bookings and DELETE /api/bookings/:id). Build /organiser for organisers: their events, a New event form (create and edit, validated in the browser), Cancel event, and an attendee list per event from GET /api/events/:id/attendees. Hide links a user's role can't use, and redirect if they open the page anyway.",
        understand: [
          "Hiding the organiser link isn't security. What actually stops an attendee from creating events?",
          "Why does cancelling a booking make a seat available again without changing the event row?",
          "Where in your code do you decide which links each role sees?",
        ],
        check: [
          { text: "As an attendee: book, see it in My bookings, cancel it — the seat comes back." },
          { text: "As an organiser: create an event, see it in the public list, open its attendee list." },
          { text: "As an attendee, type /organiser into the address bar — you're sent away." },
        ],
        commit: "Add My bookings and organiser dashboard",
      },
    ],
    done: ["Anyone can browse events; attendees can book and cancel", "Organisers create, edit and cancel events and see attendees", "Each role only sees its own pages", "Every screen has loading, empty and error states", "Every task merged through a reviewed pull request"],
  },
  shipWeek("Event booking platform", eventDone),
]

/* ------------------------------------------------------------------ */
/* Team task manager                                                   */
/* ------------------------------------------------------------------ */

const taskDone = [
  "A non-member gets 403 for any team, board or task URL.",
  "Members see the same board state after refresh.",
  "My tasks lists tasks from every board, earliest due first.",
  "The README has the permission table.",
]

const taskManager: ProjectBuild = [
  {
    intro: "You've read Start here, so you know what you're building. Now plan it, in your own words — with a permission table that says exactly who can do what.",
    tasks: [
      planTask("3. Permissions — a table with one row per action (view board, add task, delete board, add member…) and columns Admin, Member, Not a member.", [
        "A user opens a board URL from a team they're not in. Walk through what your API does.",
        "Why is membership its own table instead of a teamId on User?",
        "Which actions are admin-only, and why?",
      ]),
    ],
    done: ["docs/plan.md lists every feature as a checklist, in build order", "docs/plan.md has your build order, error format, permission table, one decision and your questions", "Your mentor has approved your plan PR"],
  },
  {
    intro: "Build the API: five tables, accounts, teams and members, boards and tasks — with one permission check every route uses.",
    tasks: [
      {
        id: "schema",
        title: "Database tables and seed data",
        why: "Five related tables: users belong to teams through memberships, and teams own boards and tasks.",
        branch: "feat/schema",
        prompt:
          "Write the Prisma models for User, Team, Membership (role ADMIN | MEMBER, unique on userId + teamId), Board and Task (status TODO | IN_PROGRESS | DONE, priority LOW | MEDIUM | HIGH) in server/prisma/schema.prisma, matching my brief. Then write server/prisma/seed.ts that deletes existing rows and creates 3 users (password secret123, bcrypt), one team where the first user is admin and the second a member, two boards and 10 tasks with different assignees, statuses and due dates. The third user belongs to no team.",
        steps: [
          { text: "Create the tables (run in server):", code: "cd server\nnpx prisma migrate dev --name teams-boards-tasks" },
          { text: "Open server/prisma.config.ts and, inside migrations, add this line under path:", file: "server/prisma.config.ts", code: 'seed: "tsx prisma/seed.ts",' },
          { text: "Seed and look at the data:", code: "npx prisma db seed\nnpx prisma studio" },
        ],
        understand: [
          "Draw the five tables and the lines between them. Which side of each relation holds the foreign key?",
          "Why is there a unique constraint on (userId, teamId) in Membership?",
          "What happens to a board's tasks when the board is deleted? Is that what you want?",
        ],
        check: [{ text: "Prisma Studio shows 3 users, 1 team with 2 memberships, 2 boards and 10 tasks." }],
        commit: "Add team, board and task models with seed data",
      },
      {
        id: "auth-teams",
        title: "Accounts, teams and members",
        why: "Before boards and tasks, users need accounts and teams. Creating a team makes you its admin.",
        branch: "feat/auth-teams",
        prompt:
          'Add POST /api/auth/signup and POST /api/auth/login (zod, bcrypt, return { "token": "...", "user": { "id", "name", "email" } } with a 7-day JWT signed with JWT_SECRET) and requireAuth middleware (reads "Authorization: Bearer <token>"). Then add POST /api/teams (the creator becomes ADMIN), GET /api/teams (only my teams) and POST /api/teams/:id/members (admins only — add an existing user by email; 404 if no such user, 409 if already a member). Write one helper, requireMembership(teamId, { admin?: boolean }), that every team route uses and that returns 403 when the user isn\'t allowed.',
        steps: [restClientStep, requestsFile(authRequests)],
        understand: [...authUnderstand, "Show where requireMembership is used. What would break if one route forgot it?"],
        check: [
          { text: "Sign up, log in and create a team.", expect: "201 — and you're its ADMIN" },
          { text: "As a MEMBER, try to add someone to the team.", expect: "403" },
          { text: "As the user with no team, GET /api/teams.", expect: "an empty list" },
        ],
        debug: authDebug,
        commit: "Add auth, teams and members",
      },
      {
        id: "boards-tasks-api",
        title: "Boards and tasks",
        why: "The work itself. Every board and task route goes through the same membership check — that's the heart of this project.",
        branch: "feat/boards-tasks",
        prompt:
          "Add GET and POST /api/teams/:id/boards (members list and create), DELETE /api/boards/:id (admins only), GET and POST /api/boards/:id/tasks, PATCH /api/tasks/:id (status, assignee, due date, priority — the assignee must be a member of the team) and GET /api/me/tasks (every task assigned to me across all teams, earliest due first). Every route finds the team that owns the board or task and calls requireMembership. Then set up Vitest and Supertest (tests use server/.env.test, reset with prisma migrate reset --force in a global setup) and test that a non-member gets 403 on a board, a task and a team.",
        steps: testsSetupSteps,
        understand: [
          "For PATCH /api/tasks/:id, how does your code find which team to check membership for?",
          "Why must the assignee be a member of the team?",
          "Break requireMembership on purpose: which tests fail? Put it back.",
        ],
        check: [
          { text: "Run the tests (in server):", code: "npm test", expect: "every test passes" },
          { text: "As a member, create a board and a task, then move the task to DONE." },
          { text: "GET /api/me/tasks lists tasks from both boards, earliest due date first." },
        ],
        debug: ["A non-member gets 404 instead of 403: decide which you want, write it in docs/plan.md, and make every route do the same."],
        commit: "Add boards and tasks with membership checks",
      },
    ],
    done: ["Five tables with seed data", "Teams, members, boards and tasks all work through the API", "Every route checks membership; non-members get 403", "npm test passes", "Every task merged through a reviewed pull request"],
  },
  {
    intro: "Build the React app: switch between teams, a three-column board, the task form and My tasks.",
    tasks: [
      frontendAuthTask,
      {
        id: "board-view",
        screens: ["board", "members"],
        title: "Team switcher and board",
        why: "The board is where the team works. Users in several teams need to switch between them easily.",
        branch: "feat/board-view",
        prompt:
          "Build the main page: a team switcher (from GET /api/teams, with Create team), the selected team's boards (with New board, and Delete board for admins only), and the selected board as three columns — To do, In progress, Done — each card showing title, assignee, priority and due date. Add an Add member form for admins. Show loading, empty and error states.",
        understand: [
          "Where do you keep the selected team and board, and why there?",
          "The Delete board button is hidden for members. What actually stops a member from deleting a board?",
          "What happens on screen when you switch team while the old team's boards are still loading?",
        ],
        check: [
          { text: "Log in as the seed admin: switch to the team, open a board — tasks appear in the right columns." },
          { text: "Log in as the seed member: Delete board and Add member aren't shown." },
          { text: "Log in as the user with no team: an empty state invites them to create one." },
        ],
        commit: "Add team switcher and board view",
      },
      {
        id: "tasks-ui",
        screens: ["task-form", "my-tasks"],
        title: "Task form and My tasks",
        why: "This brings the project's flows to life: assign a task, and see your own work across every board.",
        branch: "feat/tasks-ui",
        prompt:
          "Add an Add task form (title, description, assignee from the team's members, due date, priority), also used for editing, validated in the browser. Let users change a task's status from the card. Build /me/tasks from GET /api/me/tasks, grouped by board and sorted by due date, with overdue tasks highlighted.",
        understand: [
          "Where does the assignee list come from, and why only team members?",
          "When you change a task's status, how does the board update?",
          "How do you decide a task is overdue — and in whose time zone?",
        ],
        check: [
          { text: "Follow the Assign a task flow from Start here, as the admin: the task shows in To do and in the assignee's My tasks." },
          { text: "Follow Finish a task as the member, then refresh the board as the admin — it's in Done." },
        ],
        commit: "Add task form and My tasks",
      },
    ],
    done: ["Users can create and switch teams, boards and tasks from the browser", "Admin-only actions are hidden from members and refused by the API", "My tasks shows every assigned task, earliest due first", "Every screen has loading, empty and error states", "Every task merged through a reviewed pull request"],
  },
  shipWeek("Team task manager", taskDone),
]

export const fullStackBuilds: Record<string, ProjectBuild> = {
  "job-tracker": jobTracker,
  "event-booking": eventBooking,
  "task-manager": taskManager,
}
