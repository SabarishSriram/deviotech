import { aiMlScreens } from "@/data/docs/build/ai-ml"
import { appScreens } from "@/data/docs/build/app-development"
import { backendScreens } from "@/data/docs/build/backend"
import { dataScienceScreens } from "@/data/docs/build/data-science"
import { frontendScreens } from "@/data/docs/build/frontend"
import { javaScreens } from "@/data/docs/build/java"
import { pythonScreens } from "@/data/docs/build/python"
import { uiUxScreens } from "@/data/docs/build/ui-ux"
import type { ProjectScreen } from "@/data/docs/types"

/*
 * Every screen of each project, drawn as a simple wireframe. Students see
 * them in Start here, again in Week 1 ("the screens you'll build"), and in
 * the task that builds each one. Their own design can look different — the
 * screens must do the same things.
 */

/* ------------------------------------------------------------------ */
/* Full-Stack                                                          */
/* ------------------------------------------------------------------ */

const jobTracker: ProjectScreen[] = [
  {
    id: "auth",
    name: "Sign up and log in",
    purpose: "New users create an account; returning users log in. Everything else needs a logged-in user.",
    shows: ["Name, email and password fields", "The API's error message under the form", "A link between Sign up and Log in"],
    calls: ["POST /api/auth/signup", "POST /api/auth/login"],
    week: 3,
    mock: {
      frame: "browser",
      title: "JobTrack",
      url: "jobtrack.vercel.app/signup",
      blocks: [{ kind: "form", title: "Create your account", fields: ["Name", "Email", "Password (8+ characters)"], button: "Sign up" }],
    },
  },
  {
    id: "board",
    name: "Board",
    purpose: "The home screen: every application in a column for its stage, with the counts on top.",
    shows: ["Counts per stage and follow-ups due", "One column per stage", "A card per application: company and role", "An Add application button"],
    calls: ["GET /api/applications", "GET /api/stats"],
    week: 3,
    mock: {
      frame: "browser",
      title: "JobTrack",
      url: "jobtrack.vercel.app/board",
      nav: ["Board", "List", "Follow-ups"],
      blocks: [
        { kind: "kpis", items: [{ label: "Applied", value: "24" }, { label: "Interviews", value: "5" }, { label: "Offers", value: "1" }, { label: "Follow-ups due", value: "3" }] },
        {
          kind: "kanban",
          columns: [
            { title: "Applied", cards: ["Razorpay · SDE Intern", "Zomato · Frontend"] },
            { title: "Interview", cards: ["Swiggy · SDE Intern"] },
            { title: "Offer", cards: ["Freshworks · Intern"] },
            { title: "Rejected", cards: ["Flipkart · SDE"] },
          ],
        },
      ],
    },
  },
  {
    id: "list",
    name: "List and search",
    purpose: "Every application in one searchable list — faster than the board when you have dozens.",
    shows: ["A search box that matches company and role", "A row per application with its stage and follow-up date", "An empty state when nothing matches"],
    calls: ["GET /api/applications?q=&stage="],
    week: 3,
    mock: {
      frame: "browser",
      title: "JobTrack",
      url: "jobtrack.vercel.app/list?q=sw",
      nav: ["Board", "List", "Follow-ups"],
      active: 1,
      blocks: [
        { kind: "search", placeholder: "sw", chips: ["All stages", "Applied", "Interview", "Offer"] },
        {
          kind: "table",
          columns: ["Company", "Role", "Stage", "Follow up"],
          rows: [
            ["Swiggy", "SDE Intern", "Interview", "Mar 18"],
            ["Swiggy Instamart", "Backend", "Applied", "—"],
          ],
        },
      ],
    },
  },
  {
    id: "form",
    name: "Add or edit an application",
    purpose: "One form for adding a new application and editing an existing one — including moving it to another stage.",
    shows: ["Every field from the data model", "A stage picker", "A follow-up date", "A clear message next to each invalid field"],
    calls: ["POST /api/applications", "PATCH /api/applications/:id", "DELETE /api/applications/:id"],
    week: 3,
    mock: {
      frame: "browser",
      title: "JobTrack",
      url: "jobtrack.vercel.app/board",
      nav: ["Board", "List", "Follow-ups"],
      blocks: [{ kind: "form", title: "Add application", fields: ["Company", "Role", "Stage", "Follow-up date", "Notes"], button: "Save" }],
    },
  },
  {
    id: "follow-ups",
    name: "Upcoming follow-ups",
    purpose: "What needs chasing next, soonest first — so nothing slips.",
    shows: ["Applications with a follow-up date, soonest first", "Overdue ones highlighted", "A link to open each application"],
    calls: ["GET /api/stats"],
    week: 3,
    mock: {
      frame: "browser",
      title: "JobTrack",
      url: "jobtrack.vercel.app/follow-ups",
      nav: ["Board", "List", "Follow-ups"],
      active: 2,
      blocks: [
        {
          kind: "list",
          title: "Upcoming follow-ups",
          items: [
            { title: "Swiggy · SDE Intern", meta: "Interview — send thank-you note", right: "Today" },
            { title: "Zomato · Frontend", meta: "Applied — ask for an update", right: "Mar 18" },
            { title: "CRED · Backend", meta: "Applied", right: "Mar 21" },
          ],
        },
      ],
    },
  },
]

const eventBooking: ProjectScreen[] = [
  {
    id: "auth",
    name: "Sign up and log in",
    purpose: "Create an account as an organiser or an attendee, or log in.",
    shows: ["Name, email and password", "An Organiser / Attendee choice", "The API's error message under the form"],
    calls: ["POST /api/auth/signup", "POST /api/auth/login"],
    week: 3,
    mock: {
      frame: "browser",
      title: "EventHub",
      url: "eventhub.vercel.app/signup",
      blocks: [{ kind: "form", title: "Create your account", fields: ["Name", "Email", "Password", "I'm an: Attendee / Organiser"], button: "Sign up" }],
    },
  },
  {
    id: "events",
    name: "Events list",
    purpose: "Anyone — logged in or not — browses upcoming events and sees how many seats are left.",
    shows: ["Search, plus Upcoming and Past filters", "A card per event: title, date, venue", "Seats left, or Full"],
    calls: ["GET /api/events?q=&when="],
    week: 3,
    mock: {
      frame: "browser",
      title: "EventHub",
      url: "eventhub.vercel.app/events",
      blocks: [
        { kind: "search", placeholder: "Search events", chips: ["Upcoming", "Past"] },
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
  },
  {
    id: "event",
    name: "Event page",
    purpose: "Everything about one event, and the Book button — the screen where the last-seat problem shows up.",
    shows: ["Title, date, venue and description", "Seats left, updating after you book", "Book (or Booked / Full), and the API's message on 409"],
    calls: ["GET /api/events/:id", "POST /api/events/:id/bookings"],
    week: 3,
    mock: {
      frame: "browser",
      title: "EventHub",
      url: "eventhub.vercel.app/events/react-meetup",
      blocks: [
        { kind: "stat", label: "React Bengaluru Meetup · Sat 14 Mar, 6 pm · Koramangala", value: "1 seat left", caption: "39 of 40 booked" },
        { kind: "form", title: "Book your seat", fields: [], button: "Book a seat" },
      ],
    },
  },
  {
    id: "my-bookings",
    name: "My bookings",
    purpose: "Attendees see what they've booked and can cancel — which frees the seat.",
    shows: ["Upcoming bookings first", "A Cancel button on each", "An empty state with a link to the events list"],
    calls: ["GET /api/me/bookings", "DELETE /api/bookings/:id"],
    week: 3,
    mock: {
      frame: "browser",
      title: "EventHub",
      url: "eventhub.vercel.app/me/bookings",
      nav: ["Events", "My bookings"],
      active: 1,
      blocks: [
        {
          kind: "list",
          title: "My bookings",
          items: [
            { title: "React Bengaluru Meetup", meta: "Sat 14 Mar · Koramangala", right: "Cancel" },
            { title: "Startup Pitch Day", meta: "Sun 22 Mar · HSR Layout", right: "Cancel" },
          ],
        },
      ],
    },
  },
  {
    id: "organiser",
    name: "Organiser dashboard",
    purpose: "Organisers manage their own events and see who's coming.",
    shows: ["Their events with seats booked", "New event, Edit and Cancel event", "The attendee list for an event"],
    calls: ["GET /api/events", "POST /api/events", "PATCH /api/events/:id", "GET /api/events/:id/attendees"],
    week: 3,
    mock: {
      frame: "browser",
      title: "EventHub",
      url: "eventhub.vercel.app/organiser",
      nav: ["My events", "New event"],
      blocks: [
        { kind: "kpis", items: [{ label: "Upcoming events", value: "3" }, { label: "Seats booked", value: "86" }, { label: "Full events", value: "1" }] },
        {
          kind: "table",
          columns: ["Event", "Date", "Booked", "Status"],
          rows: [
            ["React Bengaluru Meetup", "Mar 14", "39 / 40", "Published"],
            ["Open Mic Night", "Mar 20", "25 / 25", "Published"],
            ["Design Jam", "Mar 2", "18 / 30", "Cancelled"],
          ],
        },
      ],
    },
  },
]

const taskManager: ProjectScreen[] = [
  {
    id: "auth",
    name: "Sign up and log in",
    purpose: "Create an account or log in. A new user then creates their first team.",
    shows: ["Name, email and password", "The API's error message under the form"],
    calls: ["POST /api/auth/signup", "POST /api/auth/login"],
    week: 3,
    mock: {
      frame: "browser",
      title: "TeamBoard",
      url: "teamboard.vercel.app/login",
      blocks: [{ kind: "form", title: "Log in", fields: ["Email", "Password"], button: "Log in" }],
    },
  },
  {
    id: "board",
    name: "Team board",
    purpose: "The team's work for one board, in three columns. Switch team or board from the sidebar.",
    shows: ["A team switcher and the team's boards", "To do, In progress and Done columns", "Cards with title, assignee, priority and due date"],
    calls: ["GET /api/teams", "GET /api/teams/:id/boards", "GET /api/boards/:id/tasks"],
    week: 3,
    mock: {
      frame: "browser",
      title: "TeamBoard",
      url: "teamboard.vercel.app/teams/design/boards/website",
      nav: ["Design team ▾", "Website board", "Launch board", "My tasks", "Members"],
      active: 1,
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
  },
  {
    id: "task-form",
    name: "Add or edit a task",
    purpose: "Create a task and assign it to a team member — or change it later.",
    shows: ["Title and description", "Assignee, picked from the team's members", "Due date and priority"],
    calls: ["POST /api/boards/:id/tasks", "PATCH /api/tasks/:id"],
    week: 3,
    mock: {
      frame: "browser",
      title: "TeamBoard",
      url: "teamboard.vercel.app/teams/design/boards/website",
      nav: ["Design team ▾", "Website board", "Launch board", "My tasks", "Members"],
      active: 1,
      blocks: [{ kind: "form", title: "Add task", fields: ["Title", "Description", "Assignee", "Due date", "Priority"], button: "Add task" }],
    },
  },
  {
    id: "my-tasks",
    name: "My tasks",
    purpose: "Everything assigned to you, across every board, earliest due first.",
    shows: ["Tasks from every board, grouped by board", "Due dates, with overdue ones highlighted", "Change a task's status from here"],
    calls: ["GET /api/me/tasks", "PATCH /api/tasks/:id"],
    week: 3,
    mock: {
      frame: "browser",
      title: "TeamBoard",
      url: "teamboard.vercel.app/me/tasks",
      nav: ["Design team ▾", "Website board", "Launch board", "My tasks", "Members"],
      active: 3,
      blocks: [
        {
          kind: "list",
          title: "My tasks",
          items: [
            { title: "Navbar redesign", meta: "Website board · In progress", right: "Overdue" },
            { title: "Launch checklist", meta: "Launch board · To do", right: "Mar 19" },
            { title: "Brand colours", meta: "Website board", right: "Done", done: true },
          ],
        },
      ],
    },
  },
  {
    id: "members",
    name: "Team members",
    purpose: "Admins add people to the team by email. Members only see the list.",
    shows: ["Everyone in the team, with their role", "Add member by email (admins only)"],
    calls: ["POST /api/teams/:id/members"],
    week: 3,
    mock: {
      frame: "browser",
      title: "TeamBoard",
      url: "teamboard.vercel.app/teams/design/members",
      nav: ["Design team ▾", "Website board", "Launch board", "My tasks", "Members"],
      active: 4,
      blocks: [
        {
          kind: "list",
          title: "Design team",
          items: [
            { title: "Asha Rao (you)", right: "Admin" },
            { title: "Priya Sharma", right: "Member" },
            { title: "Arjun Mehta", right: "Member" },
          ],
        },
        { kind: "form", title: "Add a member", fields: ["Their email"], button: "Add to team" },
      ],
    },
  },
]

export const projectScreens: Record<string, ProjectScreen[]> = {
  "job-tracker": jobTracker,
  "event-booking": eventBooking,
  "task-manager": taskManager,
  ...backendScreens,
  ...frontendScreens,
  ...appScreens,
  ...aiMlScreens,
  ...dataScienceScreens,
  ...pythonScreens,
  ...javaScreens,
  ...uiUxScreens,
}
