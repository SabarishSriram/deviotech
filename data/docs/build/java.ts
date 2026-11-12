import { finalReviewTask, mergedLine, planTask, readmeTask } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * Java: three APIs, week by week, built on the my-java-api repo from Setup
 * (Spring Boot with Maven, Spring Web, Spring Data JPA, PostgreSQL and
 * Validation; package com.example.my_java_api; settings in .env).
 * Week 1 is plain Java, week 2 SQL + JDBC, week 3 Spring Boot + JPA.
 */

const run = { text: "Run the app with ./mvnw spring-boot:run (on Windows: .\\mvnw spring-boot:run), and the tests with ./mvnw test (.\\mvnw test)." }

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

function domainTask(classes: string, rules: string): BuildTask {
  return {
    id: "domain",
    title: "The domain model, in plain Java",
    why: "Before Spring, before a database: model the business in plain Java classes, with the rules inside them. This is the part of your project that would survive any framework change.",
    branch: "feat/domain",
    screens: ["tests"],
    prompt: `In the package com.example.my_java_api.domain, write plain Java classes (no Spring, no annotations) for: ${classes} Put these rules inside them, throwing your own exceptions (in domain/exceptions, extending RuntimeException) with clear messages: ${rules} Use collections where a class holds many of something, and explain why you chose a List, Set or Map. Then write JUnit 5 tests in src/test/java/…/domain for every rule, including the edge cases. Teach me encapsulation and custom exceptions as you go.`,
    steps: [run],
    understand: ["Why are the fields private, and how does the rest of the code change them?", "Why your own exception classes instead of IllegalArgumentException everywhere?", "Which collection did you use, and why that one?"],
    check: [{ text: "Run the tests:", code: "./mvnw test", expect: "BUILD SUCCESS, with your domain tests listed" }],
    debug: ["“permission denied: ./mvnw” on Mac or Linux: run chmod +x mvnw once."],
    commit: "Add domain model with tests",
  }
}

function schemaTask(tables: string): BuildTask {
  return {
    id: "schema",
    title: "Design the schema in SQL",
    why: "Write the tables yourself, in SQL, before any framework writes them for you. You'll understand every column JPA maps later.",
    branch: "feat/schema",
    prompt: `Help me write src/main/resources/schema.sql for PostgreSQL with these tables: ${tables} Start it with DROP TABLE IF EXISTS … CASCADE for each (so every start is fresh while developing), use the right types (NUMERIC(12,2) for money, TIMESTAMP, foreign keys with REFERENCES, UNIQUE and CHECK constraints for the rules). Explain each constraint.`,
    steps: [
      { text: "Make Spring run your SQL instead of creating tables itself. In application.properties, change ddl-auto and add the second line:", file: "src/main/resources/application.properties", code: "spring.jpa.hibernate.ddl-auto=none\nspring.sql.init.mode=always" },
      { text: "Put the sample rows from Reference → Sample data into src/main/resources/data.sql. (You don't need the defer-datasource-initialization line it mentions — your schema.sql creates the tables.)" },
      run,
    ],
    understand: ["Which rules does the database itself enforce, and why have them there as well as in Java?", "Why NUMERIC for money, not REAL or DOUBLE?", "What does ON DELETE do on your foreign keys?"],
    check: [{ text: "Start the app: no errors, and in a terminal, psql (or pgAdmin) shows your tables with the sample rows." }],
    debug: ["“relation already exists” or duplicate rows: check schema.sql starts with the DROP TABLE lines."],
    commit: "Add schema and sample data",
  }
}

function jdbcTask(what: string): BuildTask {
  return {
    id: "jdbc",
    title: "Save and load with JDBC",
    why: "JDBC is how Java talks to databases underneath every framework. Writing the SQL yourself once means JPA will never feel like magic.",
    branch: "feat/jdbc",
    prompt: `Write repository classes in com.example.my_java_api.jdbc using Spring's JdbcTemplate (plain JDBC with less boilerplate) to ${what} Map rows to my domain classes with a RowMapper, and always use ? placeholders. Add integration tests with @SpringBootTest against my local database. Explain what JdbcTemplate does for me compared with raw Connection and PreparedStatement.`,
    steps: [run],
    understand: ["Why ? placeholders and never string concatenation? What attack do they stop?", "What does a RowMapper do?", "Pick one query and explain every part of it."],
    check: [{ text: "Run the tests:", code: "./mvnw test", expect: "BUILD SUCCESS, including the JDBC tests" }],
    commit: "Add JDBC repositories",
  }
}

function jpaTask(entities: string): BuildTask {
  return {
    id: "jpa",
    title: "Spring Boot layers with JPA",
    why: "Now the real thing: controllers take requests, services hold the rules, repositories talk to the database — and Spring Data JPA writes most of the SQL for you.",
    branch: "feat/spring",
    prompt: `Move to Spring Boot layers. Turn ${entities} into JPA @Entity classes matching my schema.sql exactly, with Spring Data repositories. Write services that use my domain rules, and @RestController classes for every endpoint in my brief, taking and returning DTO records (never entities). Keep the JDBC classes for now — I'll compare them. Explain the controller → service → repository flow with one endpoint.`,
    steps: [{ text: "Make JPA check your entities against your schema instead of changing it:", file: "src/main/resources/application.properties", code: "spring.jpa.hibernate.ddl-auto=validate" }, run],
    understand: ["Walk one request through controller, service and repository.", "Why return DTOs instead of entities?", "Compare one JDBC query with its JPA repository method: what did JPA write for you?"],
    check: [{ text: "Call every endpoint with REST Client (see the requests file in the next task) — each answers with the status code in your plan." }],
    debug: ["“Schema-validation: missing column”: an entity field doesn't match schema.sql. Fix the name with @Column(name = \"…\")."],
    commit: "Add Spring Boot layers with JPA",
  }
}

const errorsTask: BuildTask = {
  id: "errors",
  title: "Validation and one error format",
  why: "Every error, from any endpoint, should look the same — so whoever calls your API can handle them all in one place.",
  branch: "feat/errors",
  prompt: "Add Bean Validation annotations (@NotBlank, @Positive, @Email…) to my request DTOs with @Valid in the controllers. Then write one @RestControllerAdvice that turns validation errors (400), my domain exceptions (409 or 422, as in my plan) and not-found (404) into one JSON shape: { \"error\": \"message\", \"fields\": { … } }. Then create requests.http with a request for every endpoint, including the error cases.",
  steps: [{ text: "Install the REST Client extension in VS Code if you haven't (Extensions → search REST Client, by Huachao Mao), so you can run requests.http." }, run],
  understand: ["Where does a validation error get turned into JSON?", "Why one error shape for every endpoint?", "Which status code does each of your domain exceptions map to, and why?"],
  check: [{ text: "Run every request in requests.http: the error cases all come back in the same JSON shape." }],
  commit: "Add validation and error handler",
}

function testsTask(focus: string): BuildTask {
  return {
    id: "tests",
    title: "Unit and integration tests",
    why: "Unit tests check the rules fast; integration tests check the whole request through Spring and the database. You need both.",
    branch: "test/suite",
    prompt: `Help me fill the gaps in my tests: ${focus} Use JUnit 5 with @ParameterizedTest where cases repeat, and MockMvc with @SpringBootTest for endpoint tests. Explain what each kind of test proves that the other doesn't.`,
    steps: [run],
    understand: ["What does a unit test prove that an integration test doesn't, and the other way round?", "Which test would catch the bug you'd be most embarrassed by?"],
    check: [{ text: "Run them:", code: "./mvnw test", expect: "BUILD SUCCESS, no skipped tests" }],
    commit: "Add unit and integration tests",
  }
}

const deployTask: BuildTask = {
  id: "deploy",
  title: "Deploy the API",
  why: "Live on the internet, with a real database — the same jar you've been running.",
  branch: "chore/deploy",
  prompt: "I'm deploying my Spring Boot API to Render with Docker and a Render PostgreSQL database. Explain the two-stage Dockerfile on the Deployment page line by line, and check my application.properties is ready: every secret comes from DATABASE_URL, DATABASE_USER and DATABASE_PASSWORD, and schema.sql won't drop live tables (it must not run in production).",
  steps: [
    { text: "Follow Building → Deployment to add the Dockerfile and deploy on Render." },
    { text: "Stop schema.sql and data.sql from wiping the live database: on Render, add the environment variable SPRING_SQL_INIT_MODE=never after the first successful deploy." },
  ],
  understand: ["Why must schema.sql never run against the live database after the first time?", "Where do the live database settings come from?"],
  check: [{ text: "Open https://YOUR-API.onrender.com/health, then call one real endpoint on the live URL." }],
  debug: ["The deploy fails at mvnw: the Dockerfile must make it executable first — check it has chmod +x mvnw."],
  commit: "Add Dockerfile",
}

function shipWeek(name: string, tests: BuildTask, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it: tests you trust, the API live on Render, a README with every endpoint, and the final review.",
    tasks: [
      tests,
      deployTask,
      readmeTask({ name, sections: "the live URL, every endpoint with an example request and response, how to run it locally (database, .env, ./mvnw spring-boot:run), how to run the tests, environment variables (names only)", demo: "call each endpoint with REST Client against the live API, including one error case", check: "The live URL and the demo video open, and every example in the README works." }),
      finalReviewTask(doneWhen, "your live API"),
    ],
    done: ["./mvnw test passes", "The API is live", "The README shows every endpoint", "Your mentor has the links for the final review"],
  }
}

/* ------------------------------------------------------------------ */
/* Library management API                                              */
/* ------------------------------------------------------------------ */

const libraryDone = ["A member can't exceed their loan limit.", "Fines are correct for 0, 1 and 10 days late.", "Errors return a consistent JSON shape.", "Tests pass with ./mvnw test."]

const library: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words, then model the library in plain Java with its rules and tests.",
    tasks: [
      planTask({
        parts: ["Rules — every rule (loan limit, copies available, due date, fine per day) and what happens when it's broken.", "Errors — the status code for: invalid input, not found, limit reached, no copies left."],
        questions: ["Why model it in plain Java before Spring?", "How is a fine worked out for a book returned 10 days late?"],
      }),
      domainTask("Book (isbn, title, author, totalCopies, availableCopies), Member (name, email, maxLoans, its current loans) and Loan (book, member, borrowedOn, dueOn = borrowedOn + 14 days, returnedOn, fine), plus a Library class that lends and takes back books.", "a member can't borrow past maxLoans (LoanLimitReachedException); no copies left means NoCopiesAvailableException; returning works out a fine of ₹5 per day late (use java.time.LocalDate and ChronoUnit)."),
    ],
    done: ["docs/plan.md in your own words", "Book, Member, Loan and Library in plain Java, with tested rules", mergedLine],
  },
  {
    intro: "The data layer: tables in SQL, sample data, and JDBC queries.",
    tasks: [
      schemaTask("book (isbn unique, copies with CHECK available ≤ total and ≥ 0), member (email unique, max_loans), loan (book and member foreign keys, borrowed_on, due_on, returned_on, fine NUMERIC(10,2))"),
      jdbcTask("find books by title, author or ISBN; save a loan; find a member's active loans; and find overdue loans."),
    ],
    done: ["schema.sql with constraints for the rules", "Sample data loads on start", "JDBC queries with integration tests", mergedLine],
  },
  {
    intro: "Spring Boot: the REST API on JPA, with validation and one error format.",
    tasks: [
      { ...jpaTask("Book, Member and Loan"), screens: ["search", "borrow"] },
      { ...errorsTask, screens: ["return", "overdue"] },
    ],
    done: ["Every endpoint works through controller → service → repository", "One JSON error shape everywhere", mergedLine],
  },
  shipWeek("Library management API", testsTask("fines for 0, 1 and 10 days late (parameterized), the loan limit, no copies left, and MockMvc tests for borrowing past the limit (409) and a bad request (400)."), libraryDone),
]

/* ------------------------------------------------------------------ */
/* Banking system API                                                  */
/* ------------------------------------------------------------------ */

const bankingDone = ["A failed transfer changes neither balance.", "No money uses double or float.", "Statements add up to the current balance.", "Tests cover success and failure paths."]

const banking: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially how money stays exact — then model it in plain Java.",
    tasks: [
      planTask({
        parts: ["Money — why BigDecimal, how you'll round, and why a balance must always equal the sum of its transactions.", "Transfers — step by step, how a transfer happens so that both sides change or neither does."],
        questions: ["Why is double wrong for money? Give an example.", "A transfer fails halfway. What must the balances be?"],
      }),
      domainTask("Account (accountNumber, ownerName, balance as BigDecimal, its list of transactions) and Transaction (type DEPOSIT, WITHDRAWAL, TRANSFER_IN or TRANSFER_OUT, amount, createdAt, reference), plus a Bank class that transfers between two accounts.", "amounts must be above zero with at most 2 decimal places (InvalidAmountException); a withdrawal or transfer can't overdraw (InsufficientFundsException); a transfer to the same account is refused; the balance always equals the sum of the transactions."),
    ],
    done: ["docs/plan.md in your own words", "Account, Transaction and Bank in plain Java, with tested rules", mergedLine],
  },
  {
    intro: "The data layer: tables in SQL with money rules, sample data, and JDBC — including a transfer done by hand in one database transaction.",
    tasks: [
      schemaTask("account (account_number unique, balance NUMERIC(12,2) with CHECK balance ≥ 0), transaction (account foreign key, type, amount NUMERIC(12,2) with CHECK amount > 0, created_at, reference)"),
      {
        ...jdbcTask("find an account, save a transaction, and get a statement between two dates."),
        prompt: "Write repository classes in com.example.my_java_api.jdbc using Spring's JdbcTemplate to find an account, save a transaction and get a statement between two dates. Then write a JDBC transfer that runs in ONE database transaction using TransactionTemplate: debit, credit and both transaction rows commit together or roll back together. Add an integration test that forces a failure after the debit and proves both balances are unchanged. Always use ? placeholders.",
        understand: ["What does commit do, and what does rollback undo?", "Walk through your failure test: where does it fail, and what proves nothing changed?", "Why ? placeholders and never string concatenation?"],
      },
    ],
    done: ["schema.sql with money constraints", "A JDBC transfer that rolls back completely on failure", mergedLine],
  },
  {
    intro: "Spring Boot: the REST API on JPA, with @Transactional transfers, validation and one error format.",
    tasks: [
      { ...jpaTask("Account and Transaction"), screens: ["accounts", "transfer"], prompt: "Move to Spring Boot layers. Turn Account and Transaction into JPA @Entity classes matching my schema.sql exactly, with Spring Data repositories. Write a service whose transfer method is @Transactional and locks both accounts (in a consistent order, to avoid deadlocks) before changing them. Add @RestController classes for every endpoint in my brief, taking and returning DTO records. Explain what @Transactional does and why the locking order matters." },
      { ...errorsTask, screens: ["statement"] },
    ],
    done: ["Every endpoint works through controller → service → repository", "Transfers are @Transactional", "One JSON error shape everywhere", mergedLine],
  },
  shipWeek("Banking system API", testsTask("transfers that succeed, fail for insufficient funds, and fail halfway (both balances unchanged); amounts with 3 decimals; statements that add up to the balance; and MockMvc tests for 400 and 409 cases."), bankingDone),
]

/* ------------------------------------------------------------------ */
/* Inventory system                                                    */
/* ------------------------------------------------------------------ */

const inventoryDone = ["Stock can't go negative.", "Current stock always equals IN minus OUT.", "Low-stock report is correct after every movement.", "Tests pass with ./mvnw test."]

const inventory: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially why stock comes from movements — then model it in plain Java.",
    tasks: [
      planTask({
        parts: ["Stock — why you store movements and work out the stock, instead of storing one number.", "Errors — the status code for: invalid input, unknown SKU, not enough stock, duplicate SKU."],
        questions: ["Why is a list of movements better than a stock number you overwrite?", "What happens when someone records OUT 10 but only 6 are in stock?"],
      }),
      domainTask("Product (sku, name, category, reorderLevel, its supplier), Supplier (name, phone, email) and StockMovement (type IN or OUT, quantity, note, createdAt), plus an Inventory class that records movements.", "quantity must be above zero (InvalidQuantityException); an OUT can't take stock below zero (InsufficientStockException); current stock = all IN minus all OUT; a product is low on stock when current stock ≤ reorderLevel."),
    ],
    done: ["docs/plan.md in your own words", "Product, Supplier, StockMovement and Inventory in plain Java, with tested rules", mergedLine],
  },
  {
    intro: "The data layer: tables in SQL, sample data, and JDBC — including the query that works out stock.",
    tasks: [
      schemaTask("supplier, product (sku unique, supplier foreign key, reorder_level), stock_movement (product foreign key, type with CHECK in ('IN','OUT'), quantity with CHECK > 0, note, created_at)"),
      jdbcTask("search products with their current stock (worked out in SQL with SUM and CASE), record a movement, and list low-stock products."),
    ],
    done: ["schema.sql with constraints", "Stock worked out in SQL from movements", "JDBC queries with integration tests", mergedLine],
  },
  {
    intro: "Spring Boot: the REST API on JPA, the low-stock report, validation and one error format.",
    tasks: [
      { ...jpaTask("Supplier, Product and StockMovement"), screens: ["products", "movement"] },
      { ...errorsTask, screens: ["low-stock"] },
    ],
    done: ["Every endpoint works through controller → service → repository", "The low-stock report is right after every movement", "One JSON error shape everywhere", mergedLine],
  },
  shipWeek("Inventory system", testsTask("stock after a mix of IN and OUT movements, an OUT that would go negative, the low-stock rule at exactly the reorder level, and MockMvc tests for 400, 404 and 409 cases."), inventoryDone),
]

export const javaBuilds: Record<string, ProjectBuild> = {
  "library-api": library,
  "banking-api": banking,
  "inventory-system": inventory,
}

/* ------------------------------------------------------------------ */
/* Screens — the API, seen from outside                                */
/* ------------------------------------------------------------------ */

type Line = { text: string; tone?: "cmd" | "ok" | "muted" | "warn" }
const term = (title: string, lines: Line[]): ProjectScreen["mock"] => ({ frame: "terminal", title, blocks: [{ kind: "terminal", lines }] })
const testsScreen = (names: string[]): ProjectScreen => ({
  id: "tests",
  name: "Your domain tests",
  purpose: "Week 1's result: the business rules in plain Java, proved by tests — before any framework.",
  shows: ["A test for every rule", "BUILD SUCCESS"],
  week: 1,
  mock: term("terminal", [{ text: "./mvnw test", tone: "cmd" }, ...names.map((n): Line => ({ text: `  ✔ ${n}`, tone: "ok" })), { text: "[INFO] BUILD SUCCESS", tone: "ok" }]),
})

export const javaScreens: Record<string, ProjectScreen[]> = {
  "library-api": [
    testsScreen(["borrowing past maxLoans throws LoanLimitReachedException", "no copies left throws NoCopiesAvailableException", "returning 10 days late charges ₹50"]),
    {
      id: "search",
      name: "Search books",
      purpose: "Find a book by title, author or ISBN, and see how many copies are free.",
      shows: ["Matching books", "Available and total copies"],
      calls: ["GET /api/books?q="],
      week: 3,
      mock: term("requests.http", [{ text: "GET /api/books?q=effective", tone: "cmd" }, { text: '200 OK  [{"isbn":"9780134685991","title":"Effective Java","author":"Joshua Bloch","available":2,"total":2}]', tone: "ok" }]),
    },
    {
      id: "borrow",
      name: "Borrow a book",
      purpose: "Lend a book — refused when the member is at their limit or no copies are left.",
      shows: ["201 with the due date", "409 when the limit is reached"],
      calls: ["POST /api/loans"],
      week: 3,
      mock: term("requests.http", [
        { text: 'POST /api/loans  {"memberId":1,"bookId":2}', tone: "cmd" },
        { text: '201 Created  {"id":31,"dueOn":"2026-03-26"}', tone: "ok" },
        { text: 'POST /api/loans  {"memberId":1,"bookId":3}   (4th book)', tone: "cmd" },
        { text: '409 Conflict  {"error":"Asha already has 3 books — the limit"}', tone: "warn" },
      ]),
    },
    {
      id: "return",
      name: "Return and fine",
      purpose: "Take a book back and work out the fine automatically.",
      shows: ["The return date", "The fine for each day late"],
      calls: ["POST /api/loans/{id}/return"],
      week: 3,
      mock: term("requests.http", [{ text: "POST /api/loans/31/return   (10 days late)", tone: "cmd" }, { text: '200 OK  {"returnedOn":"2026-04-05","daysLate":10,"fine":50.00}', tone: "ok" }]),
    },
    {
      id: "overdue",
      name: "Overdue report",
      purpose: "Every loan past its due date, for the librarian.",
      shows: ["Member, book and days overdue"],
      calls: ["GET /api/loans/overdue"],
      week: 3,
      mock: term("requests.http", [{ text: "GET /api/loans/overdue", tone: "cmd" }, { text: '200 OK  [{"member":"Ravi","book":"Spring in Action","dueOn":"2026-03-01","daysOverdue":11}]', tone: "ok" }]),
    },
  ],
  "banking-api": [
    testsScreen(["withdrawing more than the balance throws InsufficientFundsException", "a failed transfer leaves both balances unchanged", "balance equals the sum of transactions"]),
    {
      id: "accounts",
      name: "Open and deposit",
      purpose: "Open an account at zero, then put money in.",
      shows: ["201 with the account number", "The new balance after a deposit"],
      calls: ["POST /api/accounts", "POST /api/accounts/{id}/deposit"],
      week: 3,
      mock: term("requests.http", [
        { text: 'POST /api/accounts  {"ownerName":"Asha"}', tone: "cmd" },
        { text: '201 Created  {"id":7,"accountNumber":"AC1007","balance":"0.00"}', tone: "ok" },
        { text: 'POST /api/accounts/7/deposit  {"amount":"5000.00"}', tone: "cmd" },
        { text: '200 OK  {"balance":"5000.00"}', tone: "ok" },
      ]),
    },
    {
      id: "transfer",
      name: "Transfer",
      purpose: "Move money between accounts — both sides, or neither.",
      shows: ["201 with both new balances", "409 when there isn't enough money — and nothing changed"],
      calls: ["POST /api/transfers"],
      week: 3,
      mock: term("requests.http", [
        { text: 'POST /api/transfers  {"from":7,"to":2,"amount":"1200.00"}', tone: "cmd" },
        { text: '201 Created  {"fromBalance":"3800.00","toBalance":"3700.00"}', tone: "ok" },
        { text: 'POST /api/transfers  {"from":7,"to":2,"amount":"99999.00"}', tone: "cmd" },
        { text: '409 Conflict  {"error":"Insufficient funds in AC1007"}', tone: "warn" },
      ]),
    },
    {
      id: "statement",
      name: "Statement",
      purpose: "Every movement in a date range — adding up to the balance.",
      shows: ["Transactions in the range", "Opening and closing balance"],
      calls: ["GET /api/accounts/{id}/statement"],
      week: 3,
      mock: term("requests.http", [
        { text: "GET /api/accounts/7/statement?from=2026-03-01&to=2026-03-31", tone: "cmd" },
        { text: '200 OK  {"opening":"0.00","closing":"3800.00","transactions":[', tone: "ok" },
        { text: '  {"type":"DEPOSIT","amount":"5000.00"},{"type":"TRANSFER_OUT","amount":"1200.00"}]}' },
      ]),
    },
  ],
  "inventory-system": [
    testsScreen(["an OUT below zero throws InsufficientStockException", "stock equals IN minus OUT", "low stock at exactly the reorder level"]),
    {
      id: "products",
      name: "Products and stock",
      purpose: "Search products and see what's on the shelf right now.",
      shows: ["Products with current stock", "Filters and pages"],
      calls: ["GET /api/products"],
      week: 3,
      mock: term("requests.http", [{ text: "GET /api/products?category=bakery&page=0", tone: "cmd" }, { text: '200 OK  {"items":[{"sku":"BRD-001","name":"Brown bread","stock":14,"reorderLevel":10}, …],"totalPages":2}', tone: "ok" }]),
    },
    {
      id: "movement",
      name: "Stock in and out",
      purpose: "Record what came in and what went out — never below zero.",
      shows: ["201 with the new stock", "409 when an OUT is more than the stock"],
      calls: ["POST /api/stock-movements"],
      week: 3,
      mock: term("requests.http", [
        { text: 'POST /api/stock-movements  {"sku":"BRD-001","type":"OUT","quantity":6}', tone: "cmd" },
        { text: '201 Created  {"sku":"BRD-001","stock":8}', tone: "ok" },
        { text: 'POST /api/stock-movements  {"sku":"BRD-001","type":"OUT","quantity":20}', tone: "cmd" },
        { text: '409 Conflict  {"error":"Only 8 Brown bread in stock"}', tone: "warn" },
      ]),
    },
    {
      id: "low-stock",
      name: "Low-stock report",
      purpose: "What to reorder, and from whom.",
      shows: ["Products at or below their reorder level", "Their supplier's contact"],
      calls: ["GET /api/reports/low-stock"],
      week: 3,
      mock: term("requests.http", [{ text: "GET /api/reports/low-stock", tone: "cmd" }, { text: '200 OK  [{"sku":"BRD-001","name":"Brown bread","stock":8,"reorderLevel":10,"supplier":"Fresh Bakes · 9876500001"}]', tone: "ok" }]),
    },
  ],
}
