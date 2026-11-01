import type { ApiContract } from "@/data/docs/types"

/*
 * API contracts: the exact agreement between whoever builds the API and
 * whoever calls it. Keyed by project slug; only projects with an API have one.
 */

const jwtAuth = "Send the token from login in every protected request: Authorization: Bearer <token>. Missing or invalid token → 401."
const errorShape = '{ "error": "Human-readable message", "details": [ … optional field errors … ] }'

export const contracts: Record<string, ApiContract> = {
  /* ---------------- Full-Stack ---------------- */
  "job-tracker": {
    baseUrl: "http://localhost:4000/api",
    auth: jwtAuth,
    errorShape,
    endpoints: [
      { method: "POST", path: "/auth/signup", auth: "Public", summary: "Create an account.", request: '{ "name": "Asha", "email": "asha@example.com", "password": "min 8 chars" }', response: '201 { "token": "eyJ…", "user": { "id": "u_1", "name": "Asha", "email": "asha@example.com" } }', errors: ["400 invalid email or short password", "409 email already registered"] },
      { method: "POST", path: "/auth/login", auth: "Public", summary: "Log in.", request: '{ "email": "asha@example.com", "password": "…" }', response: '200 { "token": "eyJ…", "user": { … } }', errors: ["401 wrong email or password"] },
      { method: "GET", path: "/applications?stage=INTERVIEW&q=swiggy", auth: "Logged-in user", summary: "List your applications, optionally filtered.", response: '200 [ { "id": "a_1", "company": "Swiggy", "role": "SDE Intern", "stage": "INTERVIEW", "followUpOn": "2026-03-20", "updatedAt": "…" } ]' },
      { method: "POST", path: "/applications", auth: "Logged-in user", summary: "Add an application.", request: '{ "company": "Swiggy", "role": "SDE Intern", "stage": "APPLIED", "url": "https://…", "notes": "" }', response: '201 { "id": "a_2", … }', errors: ["400 missing company or role, or unknown stage"] },
      { method: "PATCH", path: "/applications/:id", auth: "Owner only", summary: "Update fields or move stage.", request: '{ "stage": "INTERVIEW", "followUpOn": "2026-03-20" }', response: "200 { …updated application }", errors: ["404 not found or not yours"] },
      { method: "DELETE", path: "/applications/:id", auth: "Owner only", summary: "Delete an application.", response: "204 (no body)", errors: ["404 not found or not yours"] },
      { method: "GET", path: "/stats", auth: "Logged-in user", summary: "Dashboard numbers.", response: '200 { "byStage": { "APPLIED": 12, "INTERVIEW": 3, "OFFER": 1, "REJECTED": 4, "WISHLIST": 2 }, "upcomingFollowUps": [ … ] }' },
    ],
  },
  "event-booking": {
    baseUrl: "http://localhost:4000/api",
    auth: jwtAuth + " Organiser-only routes return 403 for attendees.",
    errorShape,
    endpoints: [
      { method: "POST", path: "/auth/signup", auth: "Public", summary: "Create an account with a role.", request: '{ "name": "Asha", "email": "…", "password": "…", "role": "ORGANISER" }', response: '201 { "token": "…", "user": { "id": "u_1", "role": "ORGANISER" } }' },
      { method: "GET", path: "/events?q=react&when=upcoming", auth: "Public", summary: "List events with seats left.", response: '200 [ { "id": "e_1", "title": "React Meetup", "venue": "Koramangala", "startsAt": "2026-06-14T17:00:00Z", "totalSeats": 30, "seatsLeft": 12 } ]' },
      { method: "POST", path: "/events", auth: "Organiser", summary: "Create an event.", request: '{ "title": "React Meetup", "description": "…", "venue": "Koramangala", "startsAt": "2026-06-14T17:00:00Z", "totalSeats": 30 }', response: '201 { "id": "e_1", … }', errors: ["400 invalid fields", "403 not an organiser"] },
      { method: "PATCH", path: "/events/:id", auth: "Event's organiser", summary: "Edit or cancel.", request: '{ "status": "CANCELLED" }', response: "200 { …updated event }", errors: ["403 not your event"] },
      { method: "POST", path: "/events/:id/bookings", auth: "Attendee", summary: "Book one seat.", response: '201 { "id": "b_1", "eventId": "e_1", "createdAt": "…" }', errors: ["409 event is full", "409 already booked", "404 event not found or cancelled"] },
      { method: "DELETE", path: "/bookings/:id", auth: "Booking's attendee", summary: "Cancel a booking.", response: "204 (no body)" },
      { method: "GET", path: "/events/:id/attendees", auth: "Event's organiser", summary: "Who's coming.", response: '200 [ { "name": "Ravi", "email": "…", "bookedAt": "…" } ]' },
    ],
  },
  "task-manager": {
    baseUrl: "http://localhost:4000/api",
    auth: jwtAuth + " Team routes return 403 if you're not a member; admin routes return 403 for members.",
    errorShape,
    endpoints: [
      { method: "POST", path: "/teams", auth: "Logged-in user", summary: "Create a team; you become its admin.", request: '{ "name": "Design team" }', response: '201 { "id": "t_1", "name": "Design team", "role": "ADMIN" }' },
      { method: "POST", path: "/teams/:id/members", auth: "Team admin", summary: "Add a member by email.", request: '{ "email": "arjun@example.com" }', response: '201 { "userId": "u_2", "role": "MEMBER" }', errors: ["404 no user with that email", "409 already a member"] },
      { method: "GET", path: "/teams/:id/boards", auth: "Team member", summary: "List boards.", response: '200 [ { "id": "b_1", "name": "Website" } ]' },
      { method: "POST", path: "/boards/:id/tasks", auth: "Team member", summary: "Create a task.", request: '{ "title": "Hero copy", "assigneeId": "u_2", "dueOn": "2026-03-18", "priority": "HIGH" }', response: '201 { "id": "k_1", "status": "TODO", … }', errors: ["400 assignee isn't in this team"] },
      { method: "PATCH", path: "/tasks/:id", auth: "Team member", summary: "Update status, assignee or due date.", request: '{ "status": "DONE" }', response: "200 { …updated task }" },
      { method: "GET", path: "/me/tasks", auth: "Logged-in user", summary: "Everything assigned to you, earliest due first.", response: '200 [ { "id": "k_1", "title": "Hero copy", "board": "Website", "team": "Design team", "dueOn": "2026-03-18" } ]' },
    ],
  },

  /* ---------------- Backend ---------------- */
  "url-shortener": {
    baseUrl: "http://localhost:4000",
    auth: jwtAuth + " The redirect route is public.",
    errorShape,
    endpoints: [
      { method: "POST", path: "/api/links", auth: "Logged-in user · rate-limited", summary: "Create a short link.", request: '{ "url": "https://example.com/very/long/path", "customAlias": "launch" }', response: '201 { "id": 42, "code": "launch", "shortUrl": "http://localhost:4000/launch" }', errors: ["400 not a valid URL", "409 alias taken", "429 too many requests"] },
      { method: "GET", path: "/api/links?page=1&pageSize=20", auth: "Logged-in user", summary: "Your links, newest first.", response: '200 { "items": [ { "id": 42, "code": "launch", "targetUrl": "…", "clicks": 318 } ], "page": 1, "total": 57 }' },
      { method: "GET", path: "/:code", auth: "Public", summary: "Redirect to the original URL and record a click.", response: "302 Location: https://example.com/very/long/path", errors: ["404 unknown or expired code"] },
      { method: "GET", path: "/api/links/:id/stats?from=2026-03-01&to=2026-03-14", auth: "Link owner", summary: "Click analytics.", response: '200 { "total": 318, "byDay": [ { "date": "2026-03-14", "clicks": 41 } ], "topReferrers": [ { "referrer": "twitter.com", "clicks": 120 } ], "devices": { "mobile": 190, "desktop": 128 } }' },
      { method: "DELETE", path: "/api/links/:id", auth: "Link owner", summary: "Delete a link and clear its cache.", response: "204 (no body)" },
    ],
  },
  "ecommerce-backend": {
    baseUrl: "http://localhost:4000/api",
    auth: jwtAuth + " Admin routes return 403 for customers. All money is in paise (integers).",
    errorShape,
    endpoints: [
      { method: "GET", path: "/products?category=shoes&q=runner&page=1", auth: "Public", summary: "Cached product list.", response: '200 { "items": [ { "id": 7, "name": "Runner X", "priceInPaise": 349900, "stock": 12 } ], "page": 1, "total": 48 }' },
      { method: "POST", path: "/products", auth: "Admin", summary: "Add a product.", request: '{ "name": "Runner X", "category": "shoes", "priceInPaise": 349900, "stock": 12 }', response: '201 { "id": 7, … }' },
      { method: "POST", path: "/cart", auth: "Customer", summary: "Add an item (or increase quantity).", request: '{ "productId": 7, "quantity": 2 }', response: '200 { "items": [ { "productId": 7, "quantity": 2, "lineTotalInPaise": 699800 } ], "totalInPaise": 699800 }', errors: ["409 not enough stock"] },
      { method: "PATCH", path: "/cart/:productId", auth: "Customer", summary: "Change quantity (0 removes it).", request: '{ "quantity": 1 }', response: "200 { …cart }" },
      { method: "POST", path: "/orders", auth: "Customer", summary: "Checkout: create order, reduce stock, clear cart — all or nothing.", response: '201 { "id": 1043, "status": "PLACED", "totalInPaise": 699800, "items": [ … ] }', errors: ["400 cart is empty", "409 an item ran out of stock"] },
      { method: "GET", path: "/orders", auth: "Customer (own) · Admin (all)", summary: "Order history.", response: '200 [ { "id": 1043, "status": "PLACED", "totalInPaise": 699800, "createdAt": "…" } ]' },
      { method: "PATCH", path: "/orders/:id/status", auth: "Admin", summary: "Move an order along.", request: '{ "status": "SHIPPED" }', response: "200 { …order }", errors: ["400 invalid status change (e.g. DELIVERED → PLACED)"] },
    ],
  },
  "booking-api": {
    baseUrl: "http://localhost:4000/api",
    auth: "Customers book with their email (no login). Provider routes need an API key header: X-API-Key: <key>.",
    errorShape,
    endpoints: [
      { method: "GET", path: "/providers/:id/availability?date=2026-03-18", auth: "Public", summary: "Free slots on a date (cached).", response: '200 { "date": "2026-03-18", "slotMinutes": 30, "slots": ["10:00", "10:30", "11:30"] }', errors: ["400 date in the past or badly formatted"] },
      { method: "POST", path: "/bookings", auth: "Public · rate-limited", summary: "Book a slot.", request: '{ "providerId": 3, "startsAt": "2026-03-18T10:30:00+05:30", "customerEmail": "ravi@example.com" }', response: '201 { "id": 881, "status": "BOOKED", "startsAt": "…" }', errors: ["409 slot already taken", "400 outside working hours"] },
      { method: "DELETE", path: "/bookings/:id?email=ravi@example.com", auth: "The booking's customer", summary: "Cancel before the cut-off.", response: "204 (no body)", errors: ["403 email doesn't match", "409 too late to cancel"] },
      { method: "PUT", path: "/providers/:id/hours", auth: "Provider (API key)", summary: "Replace weekly working hours.", request: '[ { "weekday": 1, "startTime": "10:00", "endTime": "18:00" } ]', response: "200 [ …hours ]" },
      { method: "GET", path: "/providers/:id/bookings?date=2026-03-18", auth: "Provider (API key)", summary: "The day's bookings.", response: '200 [ { "id": 881, "startsAt": "…", "customerEmail": "…" } ]' },
    ],
  },

  /* ---------------- Java ---------------- */
  "library-api": {
    baseUrl: "http://localhost:8080/api",
    auth: "Send X-API-Key: <key> on every request (one key for the librarian). Missing or wrong key → 401.",
    errorShape: '{ "error": "Human-readable message" }',
    endpoints: [
      { method: "GET", path: "/books?q=clean", auth: "Librarian", summary: "Search by title, author or ISBN.", response: '200 [ { "id": 12, "isbn": "9780132350884", "title": "Clean Code", "author": "Robert C. Martin", "availableCopies": 2 } ]' },
      { method: "POST", path: "/books", auth: "Librarian", summary: "Add a book.", request: '{ "isbn": "9780132350884", "title": "Clean Code", "author": "Robert C. Martin", "totalCopies": 3 }', response: '201 { "id": 12, … }', errors: ["409 ISBN already exists"] },
      { method: "POST", path: "/loans", auth: "Librarian", summary: "Lend a book.", request: '{ "memberId": 5, "bookId": 12 }', response: '201 { "id": 301, "dueOn": "2026-04-01" }', errors: ["409 no copies available", "409 member at loan limit"] },
      { method: "POST", path: "/loans/{id}/return", auth: "Librarian", summary: "Return a book and calculate any fine.", response: '200 { "id": 301, "returnedOn": "2026-04-04", "daysLate": 3, "fine": 30 }', errors: ["409 already returned"] },
      { method: "GET", path: "/loans/overdue", auth: "Librarian", summary: "Overdue loans.", response: '200 [ { "loanId": 287, "member": "Ravi", "book": "Effective Java", "dueOn": "…", "daysLate": 6 } ]' },
      { method: "GET", path: "/members/{id}/loans", auth: "Librarian", summary: "A member's loans and fines.", response: '200 { "member": "Asha", "active": [ … ], "totalFines": 30 }' },
    ],
  },
  "banking-api": {
    baseUrl: "http://localhost:8080/api",
    auth: "Send X-API-Key: <key> on every request. Amounts are decimals with two places (use BigDecimal).",
    errorShape: '{ "error": "Human-readable message" }',
    endpoints: [
      { method: "POST", path: "/accounts", auth: "API key", summary: "Open an account (balance starts at 0.00).", request: '{ "ownerName": "Asha" }', response: '201 { "id": 1, "accountNumber": "AC1001", "balance": 0.00 }' },
      { method: "POST", path: "/accounts/{id}/deposit", auth: "API key", summary: "Deposit money.", request: '{ "amount": 5000.00 }', response: '200 { "balance": 5000.00, "transactionId": 77 }', errors: ["400 amount must be positive"] },
      { method: "POST", path: "/accounts/{id}/withdraw", auth: "API key", summary: "Withdraw (no overdraft).", request: '{ "amount": 1200.00 }', response: '200 { "balance": 3800.00, "transactionId": 78 }', errors: ["422 insufficient funds"] },
      { method: "POST", path: "/transfers", auth: "API key", summary: "Move money between accounts atomically.", request: '{ "fromAccount": "AC1001", "toAccount": "AC1002", "amount": 2500.00 }', response: '201 { "reference": "TX-88412", "status": "COMPLETED" }', errors: ["422 insufficient funds", "404 account not found", "400 same account"] },
      { method: "GET", path: "/accounts/{id}/statement?from=2026-03-01&to=2026-03-31", auth: "API key", summary: "Transactions in a date range.", response: '200 { "opening": 10000.00, "closing": 7500.00, "transactions": [ { "type": "TRANSFER_OUT", "amount": 2500.00, "createdAt": "…" } ] }' },
    ],
  },
  "inventory-system": {
    baseUrl: "http://localhost:8080/api",
    auth: "Send X-API-Key: <key> on every request.",
    errorShape: '{ "error": "Human-readable message" }',
    endpoints: [
      { method: "GET", path: "/products?q=milk&category=Dairy&page=0", auth: "API key", summary: "Search products with current stock.", response: '200 { "content": [ { "sku": "MLK-1L", "name": "Milk 1L", "stock": 46, "reorderLevel": 20 } ], "totalElements": 18 }' },
      { method: "POST", path: "/products", auth: "API key", summary: "Add a product.", request: '{ "sku": "MLK-1L", "name": "Milk 1L", "category": "Dairy", "supplierId": 2, "reorderLevel": 20 }', response: '201 { "id": 4, … }', errors: ["409 SKU already exists"] },
      { method: "POST", path: "/stock-movements", auth: "API key", summary: "Record stock in or out.", request: '{ "sku": "MLK-1L", "type": "IN", "quantity": 40, "note": "Morning delivery" }', response: '201 { "sku": "MLK-1L", "currentStock": 46 }', errors: ["409 OUT quantity exceeds stock"] },
      { method: "GET", path: "/reports/low-stock", auth: "API key", summary: "Products at or below reorder level.", response: '200 [ { "sku": "BRD-WHT", "stock": 3, "reorderLevel": 10, "supplier": "Fresh Bakes" } ]' },
      { method: "GET", path: "/suppliers", auth: "API key", summary: "List suppliers (POST/PUT/DELETE manage them).", response: '200 [ { "id": 1, "name": "Fresh Bakes", "phone": "…" } ]' },
    ],
  },

  /* ---------------- Mobile & Python ---------------- */
  "food-ordering": {
    baseUrl: "http://YOUR-WIFI-IP:4000 (the json-server mock — see Sample data)",
    auth: "None — it's a mock API for development.",
    errorShape: "json-server returns 404 with an empty body for unknown ids.",
    endpoints: [
      { method: "GET", path: "/menu", auth: "Public", summary: "All menu items.", response: '200 [ { "id": "1", "name": "Chicken Biryani", "category": "Biryani", "price": 249, "addOns": ["Extra raita"] } ]' },
      { method: "GET", path: "/menu?category=Starters", auth: "Public", summary: "Filter by category.", response: "200 [ …items ]" },
      { method: "POST", path: "/orders", auth: "Public", summary: "Place an order.", request: '{ "items": [ { "menuItemId": "1", "quantity": 2, "addOns": ["Extra raita"] } ], "total": 538, "customer": { "name": "Ravi", "phone": "9876543210", "address": "…" }, "status": "placed", "createdAt": "…" }', response: '201 { "id": "1", …same fields }' },
      { method: "GET", path: "/orders/:id", auth: "Public", summary: "Poll the order's status every few seconds.", response: '200 { "id": "1", "status": "preparing", … }' },
    ],
  },
  "expense-cli": {
    baseUrl: "http://localhost:8000 (fastapi dev app/api.py)",
    auth: "None — it runs on your own machine.",
    errorShape: 'FastAPI validation errors: 422 { "detail": [ { "loc": ["body", "amount"], "msg": "…" } ] }',
    endpoints: [
      { method: "GET", path: "/expenses?month=2026-03&category=food", auth: "None", summary: "List expenses.", response: '200 [ { "id": 42, "amount": 250.0, "category": "food", "note": "lunch", "spent_on": "2026-03-01" } ]' },
      { method: "POST", path: "/expenses", auth: "None", summary: "Add an expense (validated with Pydantic).", request: '{ "amount": 250, "category": "food", "note": "lunch", "spent_on": "2026-03-01" }', response: '201 { "id": 43, … }', errors: ["422 amount must be greater than 0"] },
      { method: "GET", path: "/reports/2026-03", auth: "None", summary: "Totals by category for a month.", response: '200 { "month": "2026-03", "total": 8240.0, "byCategory": { "food": 3410.0, "travel": 2150.0 } }' },
    ],
  },
}
